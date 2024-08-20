import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

function SortTransactionsModal({
  show,
  handleClose,
  sortField,
  setSortField,
  sortOrder,
  setSortOrder,
}) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Sort Transactions</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Sort By</Form.Label>
            <Form.Control
              as="select"
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
            >
              <option value="transaction_type">Transaction Type</option>
              <option value="category">Category</option>
              <option value="amount">Amount</option>
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Order</Form.Label>
            <Form.Control
              as="select"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleClose}>
          Apply Sorting
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SortTransactionsModal;
