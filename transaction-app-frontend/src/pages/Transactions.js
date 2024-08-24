import React, { useState, useEffect } from "react";
import axios from "axios";
import TransactionList from "../components/Transactions/TransactionList";
import AddTransactionModal from "../components/Transactions/AddTransactionModal";
import EditTransactionModal from "../components/Transactions/EditTransactionModal";
import DeleteTransactionModal from "../components/Transactions/DeleteTransactionModal";
import SortTransactionsModal from "../components/Transactions/SortTransactionsModal";
import FilterTransactionsModal from "../components/Transactions/FilterTransactionsModal";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import * as XLSX from "xlsx"; // Import XLSX for handling Excel files

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [newTransaction, setNewTransaction] = useState({
    transaction_type: "",
    category: "",
    amount: 0,
  });
  const [categories, setCategories] = useState([]);
  const [sortField, setSortField] = useState("transaction_type");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterCategory, setFilterCategory] = useState("");
  const [excelFile, setExcelFile] = useState(null);

  useEffect(() => {
    console.log("Fetching transactions...");
    fetchTransactions();
  }, []);

  const fetchTransactions = () => {
    axios
      .get("http://localhost:5000/api/transactions", {
        withCredentials: true,
      })
      .then((response) => {
        console.log("Transactions fetched:", response.data);
        setTransactions(response.data);

        // Extract and set unique categories
        const uniqueCategories = [
          ...new Map(
            response.data.map((t) => [t.category?._id, t.category])
          ).values(),
        ].filter((c) => c); // Filter out null categories

        setCategories(uniqueCategories);
        console.log("Unique categories set:", uniqueCategories);
      })
      .catch((error) => {
        console.error("Error fetching transactions!", error);
      });
  };

  const handleAddTransaction = () => {
    console.log("Adding transaction:", newTransaction);
    axios
      .post("http://localhost:5000/api/transactions", newTransaction, {
        withCredentials: true,
      })
      .then(() => {
        setShowAddModal(false);
        console.log("Transaction added successfully!");
        fetchTransactions();
      })
      .catch((error) => {
        console.error("Error adding transaction!", error);
      });
  };

  const handleEditTransaction = () => {
    console.log("Editing transaction:", currentTransaction);
    axios
      .put(
        `http://localhost:5000/api/transactions/${currentTransaction._id}`,
        currentTransaction,
        {
          withCredentials: true,
        }
      )
      .then(() => {
        setShowEditModal(false);
        console.log("Transaction edited successfully!");
        fetchTransactions();
      })
      .catch((error) => {
        console.error("Error editing transaction!", error);
      });
  };

  const handleDeleteTransaction = () => {
    console.log("Deleting transaction:", currentTransaction);
    axios
      .delete(
        `http://localhost:5000/api/transactions/${currentTransaction._id}`,
        {
          withCredentials: true,
        }
      )
      .then(() => {
        setShowDeleteModal(false);
        console.log("Transaction deleted successfully!");
        fetchTransactions();
      })
      .catch((error) => {
        console.error("Error deleting transaction!", error);
      });
  };

  const predictCategory = (transactionType) => {
    if (!transactionType) {
      console.error("Error: transactionType is empty or undefined.");
      return;
    }

    console.log("Predicting category for transaction type:", transactionType);
    axios
      .post(
        "http://localhost:5000/api/transactions/categorize",
        { transaction_type: transactionType },
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        const predictedCategory = response.data.category;
        console.log("Predicted category:", predictedCategory);
        if (currentTransaction) {
          setCurrentTransaction({
            ...currentTransaction,
            category: predictedCategory,
          });
        } else {
          setNewTransaction({
            ...newTransaction,
            category: predictedCategory,
          });
        }

        if (!categories.some((cat) => cat._id === predictedCategory)) {
          setCategories((prevCategories) => [
            ...prevCategories,
            { _id: predictedCategory, name: "New Category" }, // Placeholder name; you might fetch the actual category data
          ]);
          console.log("Category added to categories list:", predictedCategory);
        }
      })
      .catch((error) => {
        console.error("Error predicting category!", error);
      });
  };

  const openEditModal = (transaction) => {
    console.log("Opening edit modal for transaction:", transaction);
    setCurrentTransaction(transaction);
    setShowEditModal(true);
  };

  const openDeleteModal = (transaction) => {
    console.log("Opening delete modal for transaction:", transaction);
    setCurrentTransaction(transaction);
    setShowDeleteModal(true);
  };

  const sortedTransactions = transactions.sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });
  console.log("Sorted transactions:", sortedTransactions);

  const filteredTransactions = sortedTransactions.filter((transaction) =>
    filterCategory ? transaction.category?._id === filterCategory : true
  );

  console.log("Filtered transactions:", filteredTransactions);

  const exportToExcel = () => {
    // Map the transactions to include only the desired fields with new names
    const formattedTransactions = transactions.map((transaction) => ({
      Transaction_Type: transaction.transaction_type,
      Amount_Spent: transaction.amount,
      Date: transaction.date, // Assuming 'date' is already in the correct format
    }));

    // Define a worksheet and a workbook
    const worksheet = XLSX.utils.json_to_sheet(formattedTransactions);
    const workbook = XLSX.utils.book_new();

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

    // Create a download link for the Excel file
    XLSX.writeFile(workbook, "transactions.xlsx");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setExcelFile(file);
  };

  const importFromExcel = async () => {
    if (!excelFile) return;

    const formData = new FormData();
    formData.append("file", excelFile);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/transactions/import-transactions",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      console.log("Imported transactions:", response.data);
      fetchTransactions(); // Refresh the transaction list after import
    } catch (error) {
      console.error("Error importing transactions!", error);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="mb-3">
        <Col>
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            Add Transaction
          </Button>{" "}
          <Button variant="info" onClick={() => setShowSortModal(true)}>
            Sort Transactions
          </Button>{" "}
          <Button variant="warning" onClick={() => setShowFilterModal(true)}>
            Filter Transactions
          </Button>{" "}
          <Button variant="success" onClick={importFromExcel}>
            Import Transactions from Excel
          </Button>
          <Button variant="secondary" onClick={exportToExcel}>
            Export to Excel
          </Button>
          <Form.Control type="file" onChange={handleFileUpload} />
        </Col>
      </Row>
      <TransactionList
        transactions={filteredTransactions}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
      />

      <AddTransactionModal
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
        newTransaction={newTransaction}
        setNewTransaction={setNewTransaction}
        categories={categories}
        setCategories={setCategories} // Pass setCategories here
        handleAddTransaction={handleAddTransaction}
        predictCategory={predictCategory}
      />

      <EditTransactionModal
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        currentTransaction={currentTransaction}
        setCurrentTransaction={setCurrentTransaction}
        categories={categories}
        handleEditTransaction={handleEditTransaction}
        predictCategory={predictCategory}
      />

      <DeleteTransactionModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        handleDeleteTransaction={handleDeleteTransaction}
      />

      <SortTransactionsModal
        show={showSortModal}
        handleClose={() => setShowSortModal(false)}
        sortField={sortField}
        setSortField={setSortField}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      <FilterTransactionsModal
        show={showFilterModal}
        handleClose={() => setShowFilterModal(false)}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        categories={categories}
      />
    </Container>
  );
}

export default Transactions;
