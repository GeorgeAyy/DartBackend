import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function AddCategoryModal({ show, handleClose, handleAddCategory }) {
  const [newCategory, setNewCategory] = useState("");

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Category</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          variant="primary"
          onClick={() => handleAddCategory(newCategory)}
        >
          Add Category
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddCategoryModal;
