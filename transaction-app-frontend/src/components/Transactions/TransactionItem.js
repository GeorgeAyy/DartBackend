import React from "react";

function TransactionItem({ transaction }) {
  return (
    <li className="list-group-item d-flex justify-content-between align-items-center">
      {transaction.transaction_type}
      <span
        className={`badge ${
          transaction.category ? "badge-info" : "badge-secondary"
        } badge-pill`}
      >
        {transaction.category || "Uncategorized"}
      </span>
    </li>
  );
}

export default TransactionItem;
