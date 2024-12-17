import Layout from "../Layouts/Layout";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const CategoreyList = () => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(null);

  const navigate = useNavigate();

  const params = useParams();

  //products By Caytegory
  let productsByCaytegory = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/productByCategory/${params?.slug}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (data.success) {
        setProducts(data?.products);
        setTotal(data?.total);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    productsByCaytegory();
  }, [params?.slug]);
  return (
    <Layout>
      <h1 className="text-center mt-4">
        Category name: {products[0]?.category?.name}
      </h1>
      <h3 className="text-center text-primary">{total} results found</h3>
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
                    <button className="btn btn-success">Add to Cart</button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <h1 className="text-bg-danger p-4">No Such Product Available</h1>
        )}
      </div>
    </Layout>
  );
};

export default CategoreyList;
