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

  // Sort transactions globally
  const sortedTransactions = filteredTransactions.sort((a, b) => {
    const fieldA = a[sortField];
    const fieldB = b[sortField];

    if (fieldA < fieldB) return sortOrder === "asc" ? -1 : 1;
    if (fieldA > fieldB) return sortOrder === "asc" ? 1 : -1;
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

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // The maximum number of page buttons to show
    const halfPagesToShow = Math.floor(maxPagesToShow / 2);

    if (totalPages <= maxPagesToShow) {
      // If total pages are less than max pages to show, show all
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= halfPagesToShow + 1) {
        // If current page is near the start
        for (let i = 1; i <= maxPagesToShow; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - halfPagesToShow) {
        // If current page is near the end
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - maxPagesToShow + 1; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // If current page is somewhere in the middle
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (
          let i = currentPage - halfPagesToShow;
          i <= currentPage + halfPagesToShow;
          i++
        ) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

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
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentTransactions.map((transaction) => (
            <tr key={transaction._id}>
              <td>{transaction.transaction_type}</td>
              <td>{transaction.category?.name || "Uncategorized"}</td>
              <td>{transaction.amount}</td>
              <td>{transaction.date}</td>
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
        {getPageNumbers().map((number, index) =>
          number === "..." ? (
            <Pagination.Ellipsis key={index} />
          ) : (
            <Pagination.Item
              key={number}
              active={number === currentPage}
              onClick={() => paginate(number)}
            >
              {number}
            </Pagination.Item>
          )
        )}
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
