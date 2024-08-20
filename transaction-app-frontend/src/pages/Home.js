import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="jumbotron text-center">
      <h1 className="display-4">Welcome to Transaction Management App</h1>
      <p className="lead">Manage your transactions effortlessly.</p>
      <hr className="my-4" />
      <p>Start by logging in or creating an account.</p>
      <Link to="/login" className="btn btn-primary btn-lg mr-2">
        Login
      </Link>
      <Link to="/register" className="btn btn-secondary btn-lg">
        Register
      </Link>
    </div>
  );
}

export default Home;
