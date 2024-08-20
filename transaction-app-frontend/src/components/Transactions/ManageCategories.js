import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Button, Table } from "react-bootstrap";
import AddCategoryModal from "./AddCategoryModal";
import EditCategoryModal from "./EditCategoryModal";
import DeleteCategoryModal from "./DeleteCategoryModal";

function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    axios
      .get("http://localhost:5000/api/categories", {
        withCredentials: true, // Include credentials (cookies) with the request
      })
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the categories!", error);
      });
  };

  const handleAddCategory = (newCategory) => {
    axios
      .post(
        "http://localhost:5000/api/categories",
        { name: newCategory },
        {
          withCredentials: true, // Include credentials (cookies) with the request
        }
      )
      .then(() => {
        setShowAddModal(false);
        fetchCategories(); // Refresh the categories list
      })
      .catch((error) => {
        console.error("There was an error adding the category!", error);
      });
  };

  const handleEditCategory = (updatedCategory) => {
    axios
      .put(
        `http://localhost:5000/api/categories/${currentCategory}`,
        { name: updatedCategory },
        {
          withCredentials: true, // Include credentials (cookies) with the request
        }
      )
      .then(() => {
        setShowEditModal(false);
        fetchCategories(); // Refresh the categories list
      })
      .catch((error) => {
        console.error("There was an error editing the category!", error);
      });
  };

  const handleDeleteCategory = () => {
    axios
      .delete(`http://localhost:5000/api/categories/${currentCategory}`, {
        withCredentials: true, // Include credentials (cookies) with the request
      })
      .then(() => {
        setShowDeleteModal(false);
        fetchCategories(); // Refresh the categories list
      })
      .catch((error) => {
        console.error("There was an error deleting the category!", error);
      });
  };

  const openEditModal = (category) => {
    setCurrentCategory(category); // Set the current category for editing
    setShowEditModal(true);
  };

  const openDeleteModal = (category) => {
    setCurrentCategory(category); // Set the current category for deleting
    setShowDeleteModal(true);
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category, index) => (
                <tr key={index}>
                  <td>{category}</td>
                  <td>
                    <Button
                      variant="warning"
                      onClick={() => openEditModal(category)}
                    >
                      Edit
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
    </Container>
  );
}

export default ManageCategories;
