import React, { useState } from "react";
import { Form, Table, Button, Pagination } from "react-bootstrap";

function TransactionList({ transactions, onEdit, onDelete }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("transaction_type");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter transactions based on search term
  const filteredTransactions = transactions.filter((transaction) =>
    transaction.transaction_type
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // Sort transactions
  const sortedTransactions = filteredTransactions.sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // Get current transactions based on pagination
  const indexOfLastTransaction = currentPage * itemsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - itemsPerPage;
  const currentTransactions = sortedTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  // Calculate the total number of pages
  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Form.Control
        type="text"
        placeholder="Search transactions..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-3"
      />
      <Table striped bordered hover>
        <thead>
          <tr>
            <th onClick={() => handleSort("transaction_type")}>
              Transaction Type
            </th>
            <th onClick={() => handleSort("category.name")}>Category</th>
            <th onClick={() => handleSort("amount")}>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentTransactions.map((transaction) => (
            <tr key={transaction._id}>
              <td>{transaction.transaction_type}</td>
              {/* Ensure you access the name field of the category object */}
              <td>{transaction.category?.name || "Uncategorized"}</td>
              <td>{transaction.amount}</td>
              <td>
                <Button variant="warning" onClick={() => onEdit(transaction)}>
                  Edit
                </Button>{" "}
                <Button variant="danger" onClick={() => onDelete(transaction)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination>
        <Pagination.First
          onClick={() => paginate(1)}
          disabled={currentPage === 1}
        />
        <Pagination.Prev
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {[...Array(totalPages)].map((_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => paginate(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
        <Pagination.Last
          onClick={() => paginate(totalPages)}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    </>
  );
}

export default TransactionList;
