import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function EditCategoryModal({
  show,
  handleClose,
  handleEditCategory,
  currentCategory,
}) {
  const [updatedCategoryName, setUpdatedCategoryName] = useState("");

  useEffect(() => {
    if (currentCategory) {
      setUpdatedCategoryName(currentCategory.name); // Set only the name property
    }
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
              value={updatedCategoryName}
              onChange={(e) => setUpdatedCategoryName(e.target.value)}
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
          onClick={() => handleEditCategory(updatedCategoryName)}
        >
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditCategoryModal;
