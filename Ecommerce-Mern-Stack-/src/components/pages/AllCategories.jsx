import React from "react";
import Layout from "../Layouts/Layout";
import { useContext } from "react";
import { noteContext } from "../context/notes/noteContext";
import { NavLink } from "react-router-dom";

const AllCategories = () => {
  const context = useContext(noteContext);
  const { categories } = context;
  return (
    <Layout>
      <div className="container mt-3">
        <h1 className="text-center">All Categories Page</h1>
        <div className="d-flex flex-wrap gap-3 justify-content-center mt-4">
          {categories?.map((category) => {
            return (
              <NavLink
                to={`/categories/${category.slug}`}
                className="text-decoration-none"
              >
                <div
                  key={category._id}
                  className="card"
                  style={{ width: "18rem" }}
                >
                  <div className="card-body">
                    <h5 className="card-title">{category.name}</h5>
                  </div>
                </div>
              </NavLink>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default AllCategories;
