import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

function FilterTransactionsModal({
  show,
  handleClose,
  filterCategory,
  setFilterCategory,
  categories,
}) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Filter Transactions</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Filter by Category</Form.Label>
            <Form.Control
              as="select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category._id}>
                  {category.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleClose}>
          Apply Filter
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default FilterTransactionsModal;
