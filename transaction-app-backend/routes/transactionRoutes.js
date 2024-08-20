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

const router = express.Router();

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

module.exports = router;
