import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function EditCategoryModal({
  show,
  handleClose,
  handleEditCategory,
  currentCategory,
}) {
  const [updatedCategory, setUpdatedCategory] = useState("");

  useEffect(() => {
    setUpdatedCategory(currentCategory);
  }, [currentCategory]);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Category</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              type="text"
              value={updatedCategory}
              onChange={(e) => setUpdatedCategory(e.target.value)}
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
          onClick={() => handleEditCategory(updatedCategory)}
        >
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditCategoryModal;
