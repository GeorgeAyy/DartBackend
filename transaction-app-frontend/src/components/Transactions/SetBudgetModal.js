import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function SetBudgetModal({ show, handleClose, handleSetBudget, currentBudget }) {
  const [budget, setBudget] = useState(currentBudget);

  const onSave = () => {
    handleSetBudget(budget);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Set Budget</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formBudget">
            <Form.Label>Budget Amount</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={onSave}>
          Save Budget
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SetBudgetModal;
