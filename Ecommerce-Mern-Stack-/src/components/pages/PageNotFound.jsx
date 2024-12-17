import React from "react";
import Layout from "../Layouts/Layout";
import { NavLink } from "react-router-dom";

const PageNotFound = () => {
  return (
    <Layout>
      <div className="container mt-5 p-5">
        <div className="d-flex flex-column align-items-center  p-5">
          <h1>404</h1>
          <h3>Oops ! Page Not Found.</h3>
          <button className="btn-primary btn">
            <NavLink className="nav-link" activeClassName="active" to="/" exact>
              Go Back
            </NavLink>
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default PageNotFound;
