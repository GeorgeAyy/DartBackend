import React from "react";
import { Modal, Button } from "react-bootstrap";

function DeleteTransactionModal({
  show,
  handleClose,
  handleDeleteTransaction,
}) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Transaction</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete this transaction?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDeleteTransaction}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteTransactionModal;
