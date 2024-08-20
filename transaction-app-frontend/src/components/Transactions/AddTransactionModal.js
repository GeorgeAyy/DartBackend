import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

function AddTransactionModal({
  show,
  handleClose,
  newTransaction,
  setNewTransaction,
  categories,
  setCategories, // Adding setCategories to update the category list
  handleAddTransaction,
}) {
  const handlePredictCategory = async () => {
    console.log("Predict Category clicked");
    console.log("Current transaction type:", newTransaction.transaction_type);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/transactions/categorize",
        { transaction_type: newTransaction.transaction_type },
        { withCredentials: true }
      );

      console.log("Prediction response data:", response.data);

      const predictedCategoryId = response.data.category;
      console.log("Predicted category ID:", predictedCategoryId);

      // Fetch the full category object if it's not already in the list
      const existingCategory = categories.find(
        (category) => category._id === predictedCategoryId
      );

      console.log("Existing category found:", existingCategory);

      if (!existingCategory) {
        const categoryResponse = await axios.get(
          `http://localhost:5000/api/categories/${predictedCategoryId}`,
          { withCredentials: true }
        );

        console.log("Category fetch response data:", categoryResponse.data);

        const predictedCategory = categoryResponse.data;
        setCategories((prevCategories) => [
          ...prevCategories,
          predictedCategory,
        ]);

        console.log("Updated categories list:", [
          ...categories,
          predictedCategory,
        ]);
      }

      setNewTransaction({
        ...newTransaction,
        category: predictedCategoryId,
      });

      console.log("Updated newTransaction:", {
        ...newTransaction,
        category: predictedCategoryId,
      });
    } catch (error) {
      console.error("There was an error predicting the category!", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Transaction</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Transaction Type</Form.Label>
            <Form.Control
              type="text"
              value={newTransaction.transaction_type}
              onChange={(e) => {
                console.log("Transaction type changed:", e.target.value);
                setNewTransaction({
                  ...newTransaction,
                  transaction_type: e.target.value,
                });
              }}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Category</Form.Label>
            <Form.Control
              as="select"
              value={newTransaction.category}
              onChange={(e) => {
                console.log("Category changed:", e.target.value);
                setNewTransaction({
                  ...newTransaction,
                  category: e.target.value,
                });
              }}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Amount</Form.Label>
            <Form.Control
              type="number"
              value={newTransaction.amount}
              onChange={(e) => {
                console.log("Amount changed:", e.target.value);
                setNewTransaction({
                  ...newTransaction,
                  amount: e.target.value,
                });
              }}
            />
          </Form.Group>
          <Button
            variant="secondary"
            className="mt-2"
            onClick={handlePredictCategory}
          >
            Predict Category
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            console.log("Add Transaction clicked");
            handleAddTransaction();
          }}
        >
          Add Transaction
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddTransactionModal;
