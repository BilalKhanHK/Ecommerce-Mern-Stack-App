import Layout from "../Layouts/Layout";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProductDetails = () => {
  const params = useParams();
  const [products, setProducts] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);

  //  getSimilarProducts
  let getSimilarProducts = async (pid, cid) => {
    try {
      const res = await fetch(
        `http://localhost:5000/relatedProducts/${pid}/${cid}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  //getSingle Product
  let getSingleProduct = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/individualProduct/${params?.slug}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      setProducts(data?.product);
      getSimilarProducts(data?.product._id, data?.product?.category?._id);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSingleProduct();
  }, []);

  return (
    <Layout>
      <div className="container mt-4">
        {/* {JSON.stringify(products)} */}
        <h1 className="text-center ">Product Details</h1>
        <div className="row p-3">
          <div className="col-md-6">
            <img
              src={`http://localhost:5000/productPhoto/${products._id}`}
              className="card-img-top object-fit-fill"
              alt={products.name}
              style={{ height: "300px" }}
            />
          </div>
          <div className="col-md-6 mt-md-0 mt-3">
            <h1>Name: {products.name}</h1>
            <h3 className="text-warning">
              Description: {products.description}
            </h3>
            <h4>price: {products.price}$</h4>
            <h5>Category: {products?.category?.name}</h5>
            <button className="btn btn-success w-50 mt-3">Add to Cart</button>
          </div>
        </div>
      </div>
      <div>
        <h1 className="text-center text-primary">Related Products</h1>
        {relatedProducts.length < 1 ? (
          <h1 className="text-center text-warning">
            No Similar Product Availabe.
          </h1>
        ) : (
          <div className="d-flex flex-wrap gap-3 mt-4 justify-content-center mb-4">
            {relatedProducts?.map((product) => {
              return (
                <>
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
                      <div className="d-flex flex-wrap gap-4 justify-content-center">
                        <button className="btn btn-success">Add to Cart</button>
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductDetails;
