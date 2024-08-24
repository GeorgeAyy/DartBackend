import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Button, Table } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AddCategoryModal from "./AddCategoryModal";
import EditCategoryModal from "./EditCategoryModal";
import DeleteCategoryModal from "./DeleteCategoryModal";
import SetBudgetModal from "./SetBudgetModal";

function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [currentBudget, setCurrentBudget] = useState(0);
  const [reportData, setReportData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    axios
      .get("http://localhost:5000/api/categories", {
        withCredentials: true,
      })
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching the categories!", error);
      });
  };

  const handleAddCategory = (newCategory) => {
    axios
      .post(
        "http://localhost:5000/api/categories",
        { name: newCategory },
        { withCredentials: true }
      )
      .then(() => {
        setShowAddModal(false);
        fetchCategories();
      })
      .catch((error) => {
        console.error("Error adding the category!", error);
      });
  };

  const handleEditCategory = (updatedCategoryName) => {
    axios
      .put(
        `http://localhost:5000/api/categories/${currentCategory._id}`,
        { name: updatedCategoryName },
        { withCredentials: true }
      )
      .then(() => {
        setShowEditModal(false);
        fetchCategories();
      })
      .catch((error) => {
        console.error("Error editing the category!", error);
      });
  };

  const handleDeleteCategory = () => {
    axios
      .delete(`http://localhost:5000/api/categories/${currentCategory._id}`, {
        withCredentials: true,
      })
      .then(() => {
        setShowDeleteModal(false);
        fetchCategories();
      })
      .catch((error) => {
        console.error("Error deleting the category!", error);
      });
  };

  const handleSetBudget = (budget) => {
    axios
      .put(
        `http://localhost:5000/api/categories/${currentCategory._id}`,
        { budget },
        { withCredentials: true }
      )
      .then(() => {
        setShowBudgetModal(false);
        fetchCategories();
      })
      .catch((error) => {
        console.error("Error setting the budget!", error);
      });
  };

  const generateReport = () => {
    // Clear the forecast data when generating a report
    setForecastData(null);

    axios
      .get("http://localhost:5000/api/transactions/report", {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
        withCredentials: true,
      })
      .then((response) => {
        const report = response.data.data;
        console.log("Generated report:", report);

        // Store the report data in the state
        setReportData(report);
      })
      .catch((error) => {
        console.error("Error generating the report!", error);
      });
  };

  const generateForecast = () => {
    // Clear the report data when generating a forecast
    setReportData(null);

    axios
      .get("http://localhost:5000/api/transactions/forecast", {
        withCredentials: true,
      })
      .then((response) => {
        const forecast = response.data.data;
        console.log("Generated forecast:", forecast);

        // Store the forecast data in the state
        setForecastData(forecast);
      })
      .catch((error) => {
        console.error("Error generating the forecast!", error);
      });
  };

  const openEditModal = (category) => {
    setCurrentCategory(category);
    setShowEditModal(true);
  };

  const openDeleteModal = (category) => {
    setCurrentCategory(category);
    setShowDeleteModal(true);
  };

  const openBudgetModal = (category) => {
    setCurrentCategory(category);
    setCurrentBudget(category.budget || 0);
    setShowBudgetModal(true);
  };

  return (
    <Container className="mt-5">
      <Row className="mb-3">
        <Col>
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            Add Category
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Budget</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id}>
                  <td>{category.name}</td>
                  <td>
                    {category.budget ? `$${category.budget}` : "No Budget"}
                  </td>
                  <td>
                    <Button
                      variant="warning"
                      onClick={() => openEditModal(category)}
                    >
                      Edit
                    </Button>{" "}
                    <Button
                      variant="info"
                      onClick={() => openBudgetModal(category)}
                    >
                      Set Budget
                    </Button>{" "}
                    <Button
                      variant="danger"
                      onClick={() => openDeleteModal(category)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button variant="secondary" onClick={generateReport}>
            Generate Report
          </Button>{" "}
          <Button variant="info" onClick={generateForecast}>
            Generate Forecast
          </Button>
        </Col>
      </Row>

      {/* Improved date picker for report generation */}
      <Row className="mt-3">
        <Col md={6}>
          <label>Start Date:</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="yyyy-MM-dd"
            className="form-control"
          />
        </Col>
        <Col md={6}>
          <label>End Date:</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="yyyy-MM-dd"
            className="form-control"
          />
        </Col>
      </Row>

      {/* Display the report data if it exists */}
      {reportData && (
        <Row className="mt-5">
          <Col>
            <h3>Report Summary</h3>
            <p>
              <strong>Total Spent:</strong> ${reportData.totalSpent}
            </p>
            <h4>Category Breakdown:</h4>
            <ul>
              {Object.entries(reportData.categoryBreakdown).map(
                ([category, amount]) => (
                  <li key={category}>
                    {category}: ${amount}
                  </li>
                )
              )}
            </ul>
            <h4>AI Summary:</h4>
            <ReactMarkdown>{reportData.aiSummary}</ReactMarkdown>
          </Col>
        </Row>
      )}

      {/* Display the forecast data if it exists */}
      {forecastData && (
        <Row className="mt-5">
          <Col>
            <h3>Financial Forecast and Advice</h3>
            <h4>Monthly Spending Trends:</h4>
            <ul>
              {Object.entries(forecastData.monthlySpending).map(
                ([month, amount]) => (
                  <li key={month}>
                    {month}: ${amount}
                  </li>
                )
              )}
            </ul>
            <h4>AI Forecast and Advice:</h4>
            <ReactMarkdown>{forecastData.forecastSummary}</ReactMarkdown>
          </Col>
        </Row>
      )}

      <AddCategoryModal
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
        handleAddCategory={handleAddCategory}
      />

      <EditCategoryModal
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        handleEditCategory={handleEditCategory}
        currentCategory={currentCategory}
      />

      <DeleteCategoryModal
        show={showDeleteModal}
        handleClose={() => setShowDeleteModal(false)}
        handleDeleteCategory={handleDeleteCategory}
        currentCategory={currentCategory}
      />

      <SetBudgetModal
        show={showBudgetModal}
        handleClose={() => setShowBudgetModal(false)}
        handleSetBudget={handleSetBudget}
        currentBudget={currentBudget}
      />
    </Container>
  );
}

export default ManageCategories;
