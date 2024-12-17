import Layout from "../../Layouts/Layout";
import React, { useState, useEffect } from "react";
import AdminMenu from "../../Layouts/AdminMenu";
import toast from "react-hot-toast";
import { NavLink } from "react-router-dom";
const Product = () => {
  const [products, setProduct] = useState([]);

  //getAllProducts
  let getAllProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/allProducts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data?.success) {
        setProduct(data?.products);
        // alert("sdlk");
        // console.log(data?.products);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in Getting All Products.");
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <Layout title={"Products"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9 mt-md-0 mt-3">
            <h1 className="text-center">All Products List</h1>
            <div className="d-flex flex-wrap gap-3 justify-content-center mt-4">
              {products?.map((product) => {
                return (
                  <NavLink
                    to={`/dashboard/admin/product/${product.slug}`}
                    activeClassName=""
                    className="nav-link"
                    key={product._id}
                  >
                    <div className="card" style={{ width: "18rem" }}>
                      <img
                        src={`http://localhost:5000/productPhoto/${product._id}`}
                        className="card-img-top object-fit-fill"
                        alt={product.name}
                        style={{ height: "300px" }}
                      />
                      <div className="card-body">
                        <h5 className="card-title">{product.name}</h5>
                        <p className="card-text">{product.description}</p>
                      </div>
                    </div>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Product;
