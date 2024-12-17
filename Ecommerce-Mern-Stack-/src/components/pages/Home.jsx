import React, { useState, useEffect } from "react";
import Layout from "../Layouts/Layout";
import { useContext } from "react";
import { noteContext } from "../context/notes/noteContext";
import toast from "react-hot-toast";
import { Checkbox, Radio } from "antd";
import { json } from "react-router-dom";
import { Prices } from "../Prices";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  //context
  const context = useContext(noteContext);
  const { auth, setAuth, searchQuery, setCart, cart } = context;

  //states
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(null);
  const [loading, setLoading] = useState(true);
  //ref
  const resetRef = useRef();

  const navigate = useNavigate();

  //search Query
  let SearchProducts = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/searchProduct/${searchQuery}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (data?.success) {
        setProducts(data?.products);
        setTotal(data?.total);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Something went wrong in Searching Products in home.jsx.");
    }
  };

  //getProducts
  let getAllProducts = async () => {
    try {
      const res = await fetch(`http://localhost:5000/allProducts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data?.success) {
        setProducts(data?.products);
        setTotal(data?.total);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Something went wrong in Getting All Products in home.jsx.");
    }
  };

  //getAllCategories
  const getAllCategories = async () => {
    try {
      //get All categories api
      const res = await fetch("http://localhost:5000/allCategories", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data?.success) {
        setCategories(data?.categories);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in Getting Category in home.jsx");
    }
  };

  // handleFilter
  let handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };

  //getFilters
  let filterProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/filterProducts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ checked: checked, radio: radio }),
      });
      const data = await res.json();
      if (data?.success) {
        setProducts(data?.products);
        setTotal(data?.total);
        // console.log(data?.products);
        // console.log("This is product state: ", products);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in Getting Filters in home.jsx");
    }
  };

  useEffect(() => {
    filterProducts();
  }, [checked, radio]);

  useEffect(() => {
    getAllCategories();
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      getAllProducts();
    }
  }, [searchQuery]);

  useEffect(() => {
    if (searchQuery) {
      SearchProducts();
    }
  }, [searchQuery]);

  return (
    <Layout title={"All Products - Best of Offers"}>
      <div className="row mt-4">
        <div className="col-md-3 d-flex flex-column align-items-center mt-3 mb-3">
          {/* category filter  */}
          <div>
            <h4 className="text-center">Filter By Category</h4>
            <div className="d-md-flex flex-md-column text-center">
              {categories?.map((category) => {
                return (
                  <Checkbox
                    className="mt-2 fs-5 ms-2"
                    key={category._id}
                    onChange={(e) => {
                      e.preventDefault();
                      handleFilter(e.target.checked, category._id);
                    }}
                  >
                    {category.name}
                  </Checkbox>
                );
              })}
            </div>
          </div>
          {/* price filter  */}
          <div className=" mt-3 container">
            <h4 className="text-center">Filter By Prices</h4>
            {/* {JSON.stringify(radio)} */}
            <div className="text-center">
              <Radio.Group
                onChange={(e) => {
                  e.preventDefault();
                  setRadio(e.target.value);
                }}
              >
                {Prices?.map((prices) => {
                  return (
                    <Radio
                      key={prices._id}
                      className="mt-2 fs-5 d-md-block"
                      value={prices.array}
                    >
                      {prices.name}
                    </Radio>
                  );
                })}
              </Radio.Group>
            </div>
          </div>
          <button
            className="btn btn-primary mt-4"
            onClick={() => {
              window.location.reload();
            }}
            ref={resetRef}
          >
            Reset All Filters
          </button>
        </div>
        <div className="col-md-9">
          {loading ? (
            <div
              className="container d-flex justify-content-center align-items-center"
              style={{ height: "40vh" }}
            >
              <div className="spinner-border text-info" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-center">All Products</h1>
              <h3 className="text-primary text-center">
                Total Number of Products: {total}
              </h3>
              <div className="d-flex flex-wrap gap-3 mt-4 justify-content-center mb-4">
                {total > 0 ? (
                  products?.map((product) => {
                    return (
                      <div
                        key={product._id}
                        className="card"
                        style={{ width: "18rem" }}
                      >
                        <img
                          src={`http://localhost:5000/productPhoto/${product._id}`}
                          className="card-img-top object-fit-fill"
                          alt={product.name}
                          style={{ height: "300px" }}
                        />
                        <div className="card-body">
                          <h5 className="card-title">{product.name}</h5>
                          <p className="card-text">
                            {product?.description?.substring(0, 60)}...
                          </p>
                          <p className="card-text text-primary fs-4">
                            {product.price}$
                          </p>
                          <div className="d-flex flex-wrap gap-4">
                            <button
                              className="btn btn-primary"
                              onClick={(e) => {
                                e.preventDefault();
                                navigate(`/product/${product.slug}`);
                              }}
                            >
                              More Details
                            </button>
                            <button
                              className="btn btn-success"
                              onClick={(e) => {
                                e.preventDefault();
                                if (auth?.user) {
                                  setCart([...cart, product]);
                                  localStorage.setItem(
                                    "cart",
                                    JSON.stringify([...cart, product])
                                  );
                                  toast.success("Item Added to Cart.");
                                } else {
                                  navigate("/login");
                                }
                              }}
                            >
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <h1 className="text-bg-danger p-4">
                    No Such Product Available
                  </h1>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Home;
