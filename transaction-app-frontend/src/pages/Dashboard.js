import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  ListGroup,
  Badge,
} from "react-bootstrap";
import { Bar, Pie } from "react-chartjs-2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Dashboard() {
  const [insights, setInsights] = useState([]);
  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    fetchDashboardData();
  }, [startDate, endDate]);

  const fetchDashboardData = () => {
    axios
      .get("http://localhost:5000/api/dashboard", {
        params: { startDate, endDate },
        withCredentials: true,
      })
      .then((response) => {
        setInsights(response.data);
      })
      .catch((error) => {
        console.error("Error fetching dashboard data!", error);
      });
  };

  const generateChartData = () => {
    const categories = insights.map((insight) => insight.categoryName);
    const totalBudgets = insights.map((insight) => insight.totalBudget);
    const spending = insights.map((insight) => insight.totalSpent);

    return {
      labels: categories,
      datasets: [
        {
          label: "Total Budget",
          data: totalBudgets,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
        {
          label: "Total Spent",
          data: spending,
          backgroundColor: "rgba(255, 99, 132, 0.6)",
        },
      ],
    };
  };

  const generatePieData = () => {
    const categories = insights.map((insight) => insight.categoryName);
    const overBudgetStatus = insights.map((insight) =>
      insight.overBudget ? 1 : 0
    );

    return {
      labels: categories,
      datasets: [
        {
          data: overBudgetStatus,
          backgroundColor: overBudgetStatus.map((status) =>
            status ? "rgba(255, 99, 132, 0.6)" : "rgba(75, 192, 192, 0.6)"
          ),
        },
      ],
    };
  };

  const renderOverBudgetCategories = () => {
    const overBudgetCategories = insights.filter(
      (insight) => insight.overBudget
    );

    if (overBudgetCategories.length === 0) {
      return <p>All categories are within the budget.</p>;
    }

    return (
      <ListGroup>
        {overBudgetCategories.map((category) => (
          <ListGroup.Item
            key={category.categoryName}
            className="d-flex justify-content-between align-items-center"
          >
            {category.categoryName}
            <Badge bg="danger" pill>
              Over by ${category.totalSpent - category.totalBudget}
            </Badge>
          </ListGroup.Item>
        ))}
      </ListGroup>
    );
  };

  return (
    <Container className="text-center mt-5">
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard. Here are some insights:</p>

      <Row className="mb-4">
        <Col>
          <Form.Group controlId="startDate">
            <Form.Label>Start Date</Form.Label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="yyyy/MM/dd"
              className="form-control"
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="endDate">
            <Form.Label>End Date</Form.Label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="yyyy/MM/dd"
              className="form-control"
            />
          </Form.Group>
        </Col>
        <Col className="align-self-end">
          <Button variant="primary" onClick={fetchDashboardData}>
            Refresh Data
          </Button>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <h3>Over Budget Categories</h3>
          {renderOverBudgetCategories()}
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <h3>Total Budget vs Spending</h3>
          <div style={{ height: "300px" }}>
            <Bar data={generateChartData()} />
          </div>
        </Col>
        <Col md={6}>
          <h3>Over Budget Status</h3>
          <div style={{ height: "300px" }}>
            <Pie data={generatePieData()} />
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
