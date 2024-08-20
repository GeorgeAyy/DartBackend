// routes/categoryRoutes.js

const express = require("express");
const {
  getCategories,
  addCategory,
  editCategory,
  deleteCategory,
  getCategoryByID,
} = require("../controllers/categoryController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router
  .route("/")
  .get(
    protect,
    (req, res, next) => {
      console.log("GET /categories - Request received");
      next();
    },
    getCategories
  ) // GET /categories - Fetch all categories
  .post(
    protect,
    (req, res, next) => {
      console.log("POST /categories - Request received with body:", req.body);
      next();
    },
    addCategory
  ); // POST /categories - Add a new category

router
  .route("/:id")
  .get(
    protect,
    (req, res, next) => {
      console.log(`GET /categories/${req.params.id} - Request received`);
      next();
    },
    getCategoryByID
  ) // GET /categories/:id - Get a category by ID
  .put(
    protect,
    (req, res, next) => {
      console.log(
        `PUT /categories/${req.params.id} - Request received with body:`,
        req.body
      );
      next();
    },
    editCategory
  ) // PUT /categories/:id - Edit a category
  .delete(
    protect,
    (req, res, next) => {
      console.log(`DELETE /categories/${req.params.id} - Request received`);
      next();
    },
    deleteCategory
  ); // DELETE /categories/:id - Delete a category

module.exports = router;
