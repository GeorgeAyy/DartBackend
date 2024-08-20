const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyDOExmBe0spo7h7PXGRbFqiPRPzfn5FdxE");
//log the key

// Initialize the model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const predictCategory = async (transactionType, existingCategories) => {
  console.log("Starting category prediction...");
  console.log("Transaction Type:", transactionType);
  console.log("Existing Categories:", existingCategories);

  try {
    const prompt = `
      Categorize the following transaction type: "${transactionType}".
      Existing categories: ${existingCategories.join(", ")}.
      If it fits an existing category, return the category name. 
      Otherwise, suggest a new category.
      
      Please respond with only the category name in the format: 
      "Category: <category name>"
    `;

    console.log("Generated Prompt:", prompt);

    // Generate content using the AI model
    const result = await model.generateContent([prompt]);
    console.log("Raw Result:", result);

    // Assuming the response is in the format "Category: <category name>"
    const text = result.response.text().trim();

    // Extracting just the category name from the response
    const categoryMatch = text.match(/Category:\s*(.*)/);
    const category = categoryMatch ? categoryMatch[1].trim() : "Uncategorized";

    console.log("Predicted Category:", category);

    return category;
  } catch (error) {
    console.error("Error generating category:", error);
    return "Uncategorized";
  }
};

module.exports = { predictCategory };
