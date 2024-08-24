// routes/transactionRoutes.js

const express = require("express");
const {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  categorizeTransaction,
} = require("../controllers/transactionController");
const { getCategoryByID } = require("../controllers/categoryController");
const { protect } = require("../middleware/authMiddleware");
const XLSX = require("xlsx");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { spawn } = require("child_process");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const Transaction = require("../models/Transaction");
const Category = require("../models/Category");
const dayjs = require("dayjs");
const {
  generateAIReportSummary,
  generateAIForecastAndAdvice,
} = require("../services/genAIService");
// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage: storage });

router
  .route("/")
  .get(
    protect,
    (req, res, next) => {
      console.log("GET /transactions - Request received");
      next();
    },
    getTransactions
  ) // GET /transactions - Fetch all transactions
  .post(
    protect,
    (req, res, next) => {
      console.log("POST /transactions - Request received with body:", req.body);
      next();
    },
    addTransaction
  ); // POST /transactions - Add a new transaction

router
  .route("/:id")
  .put(
    protect,
    (req, res, next) => {
      console.log(
        `PUT /transactions/${req.params.id} - Request received with body:`,
        req.body
      );
      next();
    },
    updateTransaction
  ) // PUT /transactions/:id - Update a transaction
  .delete(
    protect,
    (req, res, next) => {
      console.log(`DELETE /transactions/${req.params.id} - Request received`);
      next();
    },
    deleteTransaction
  ); // DELETE /transactions/:id - Delete a transaction

router.route("/categorize").post(
  protect,
  (req, res, next) => {
    console.log(
      "POST /transactions/categorize - Request received with body:",
      req.body
    );
    next();
  },
  categorizeTransaction
); // POST /categorize - Predict category

router.route("/category/:id").get(
  protect,
  (req, res, next) => {
    console.log(
      `GET /transactions/category/${req.params.id} - Request received`
    );
    next();
  },
  getCategoryByID
); // GET /transactions/category/:id - Get category by ID

// Function to convert Excel serial date to JavaScript Date
function excelDateToJSDate(serial) {
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);

  const fractional_day = serial - Math.floor(serial) + 0.0000001;

  let total_seconds = Math.floor(86400 * fractional_day);

  const seconds = total_seconds % 60;
  total_seconds -= seconds;

  const hours = Math.floor(total_seconds / (60 * 60));
  const minutes = Math.floor(total_seconds / 60) % 60;

  return new Date(
    date_info.getFullYear(),
    date_info.getMonth(),
    date_info.getDate(),
    hours,
    minutes,
    seconds
  );
}
// Import and categorize transactions from Excel file
router.post(
  "/import-transactions",
  protect,
  upload.single("file"),
  async (req, res) => {
    try {
      console.log("File upload received. Path:", req.file.path);

      const filePath = req.file.path;
      const uniqueOutputFileName = `final_categorized_transactions-${uuidv4()}.xlsx`;

      const outputFilePath = path.join(
        __dirname,
        "../uploads",
        uniqueOutputFileName
      );

      console.log("Unique output file name generated:", uniqueOutputFileName);
      console.log("Output file will be saved to:", outputFilePath);

      const pythonScriptPath = path.join(
        __dirname,
        "../services/Untitled-1.py"
      );

      console.log("Python script path:", pythonScriptPath);

      const pythonProcess = spawn(
        "C:\\Users\\georg\\AppData\\Local\\Programs\\Python\\Python311\\python.exe",
        [pythonScriptPath, filePath, outputFilePath]
      );

      console.log("Python process spawned. Waiting for output...");

      pythonProcess.stdout.on("data", (data) => {
        console.log(`Python script output: ${data.toString()}`);
      });

      pythonProcess.stderr.on("data", (data) => {
        console.error(`Python script error: ${data.toString()}`);
      });

      pythonProcess.on("close", async (code) => {
        console.log(`Python script exited with code: ${code}`);

        if (code === 0) {
          try {
            console.log(
              "Python script completed successfully. Reading output file..."
            );

            const workbook = XLSX.readFile(outputFilePath);
            console.log("Workbook read successfully:", workbook.SheetNames);

            const sheetName = workbook.SheetNames[0];
            const worksheet = XLSX.utils.sheet_to_json(
              workbook.Sheets[sheetName]
            );

            console.log("Worksheet data:", worksheet);

            const categoriesMap = {}; // To store category names and their MongoDB IDs

            for (const row of worksheet) {
              const categoryName = row["Gemini_Category"];
              console.log("Processing category:", categoryName);

              if (!categoriesMap[categoryName]) {
                let categoryDoc = await Category.findOne({
                  name: categoryName,
                  user: req.user._id,
                });

                if (!categoryDoc) {
                  console.log(
                    "Category not found. Creating new category:",
                    categoryName
                  );
                  categoryDoc = new Category({
                    name: categoryName,
                    user: req.user._id,
                  });
                  await categoryDoc.save();
                } else {
                  console.log("Category found:", categoryName);
                }

                categoriesMap[categoryName] = categoryDoc._id;
              }
            }

            const transactions = worksheet.map((row) => {
              let date;

              // Check if the date is in serial number format
              if (!isNaN(row["Date"]) && row["Date"] > 10000) {
                date = excelDateToJSDate(row["Date"]);
              } else {
                // Handle the date normally (e.g., if it's in string format)
                const dateStr = String(row["Date"]);
                if (dateStr.includes("/")) {
                  const [month, day, year] = dateStr.split("/").map(Number);
                  date = new Date(year, month - 1, day);
                } else {
                  console.error(`Invalid date format: ${row["Date"]}`);
                  return null;
                }
              }

              return {
                user: req.user._id,
                transaction_type: row["Transaction_Type"],
                category: categoriesMap[row["Gemini_Category"]],
                amount: parseFloat(row["Amount_Spent"]),
                date: date,
              };
            });

            const validTransactions = transactions.filter(
              (transaction) => transaction !== null
            );

            console.log("Transactions to insert:", validTransactions);

            const createdTransactions = await Transaction.insertMany(
              validTransactions
            );
            console.log(
              "Transactions created successfully:",
              createdTransactions
            );

            // Clean up the files
            console.log("Cleaning up temporary files...");
            fs.unlinkSync(filePath);
            fs.unlinkSync(outputFilePath);
            console.log("Temporary files deleted.");

            res.status(201).json(createdTransactions);
          } catch (error) {
            console.error("Error processing transactions:", error.message);
            res.status(500).json({ message: "Error processing transactions" });
          }
        } else {
          console.error("Python script failed with code:", code);
          res.status(500).json({ message: "Error processing file" });
        }
      });
    } catch (error) {
      console.error("Unexpected error:", error.message);
      res.status(500).json({ message: "Unexpected error occurred" });
    }
  }
);
router.get("/report", protect, async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    // Query the transactions within the specified date range
    const transactions = await Transaction.find({
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    }).populate("category"); // Populate the category field with its full document

    // Calculate total expenditures and other relevant data
    const totalSpent = transactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    // Group transactions by category and sum the amounts
    const categoryBreakdown = transactions.reduce((acc, transaction) => {
      const categoryName = transaction.category.name; // Access the name of the populated category
      if (!acc[categoryName]) {
        acc[categoryName] = 0;
      }
      acc[categoryName] += transaction.amount;
      return acc;
    }, {});

    // Use the AI to generate a summary of the report
    const aiSummary = await generateAIReportSummary({
      totalSpent,
      categoryBreakdown,
      transactions,
    });

    // Return the report and the AI-generated summary
    res.json({
      success: true,
      data: {
        totalSpent,
        categoryBreakdown,
        transactions,
        aiSummary,
      },
    });
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
router.get("/forecast", protect, async (req, res) => {
  try {
    // Fetch the user's past transactions
    const transactions = await Transaction.find({ user: req.user._id });

    // Calculate total expenditures, monthly trends, etc.
    const totalSpent = transactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    const monthlySpending = transactions.reduce((acc, transaction) => {
      const month = dayjs(transaction.date).format("YYYY-MM");
      if (!acc[month]) acc[month] = 0;
      acc[month] += transaction.amount;
      return acc;
    }, {});

    // Create the AI prompt for forecasting and advice
    const forecastPrompt = `
      Based on the following monthly spending trends:
      ${Object.entries(monthlySpending)
        .map(([month, amount]) => `${month}: $${amount}`)
        .join("\n")}

      Provide a forecast for future spending, advice on what to save up on, and suggestions on what to buy. 
      Include any insights on possible overspending and recommendations for better financial management.
    `;

    // Use the AI to generate a forecast and financial advice
    const forecastSummary = await generateAIForecastAndAdvice({
      forecastPrompt,
    });

    // Return the forecast and advice
    res.json({
      success: true,
      data: {
        forecastSummary,
        monthlySpending,
      },
    });
  } catch (error) {
    console.error("Error generating forecast:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
