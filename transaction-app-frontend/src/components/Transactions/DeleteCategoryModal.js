import React from "react";
import { Modal, Button } from "react-bootstrap";

function DeleteCategoryModal({ show, handleClose, handleDeleteCategory }) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Category</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete this category?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDeleteCategory}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteCategoryModal;
