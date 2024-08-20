import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

function EditTransactionModal({
  show,
  handleClose,
  currentTransaction,
  setCurrentTransaction,
  categories,
  handleEditTransaction,
  predictCategory,
}) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Transaction</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Transaction Type</Form.Label>
            <Form.Control
              type="text"
              value={currentTransaction?.transaction_type || ""}
              onChange={(e) =>
                setCurrentTransaction({
                  ...currentTransaction,
                  transaction_type: e.target.value,
                })
              }
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Category</Form.Label>
            <Form.Control
              as="select"
              value={currentTransaction?.category?._id || ""}
              onChange={(e) =>
                setCurrentTransaction({
                  ...currentTransaction,
                  category: categories.find(
                    (cat) => cat._id === e.target.value
                  ),
                })
              }
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
              value={currentTransaction?.amount || 0}
              onChange={(e) =>
                setCurrentTransaction({
                  ...currentTransaction,
                  amount: e.target.value,
                })
              }
            />
          </Form.Group>
          <Button
            variant="secondary"
            className="mt-2"
            onClick={() =>
              predictCategory(currentTransaction?.transaction_type)
            }
          >
            Predict Category
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleEditTransaction}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditTransactionModal;
