import React, { useState, useEffect } from "react";
import Layout from "../../Layouts/Layout";
import UserMenu from "../../Layouts/UserMenu";
import { useContext } from "react";
import { noteContext } from "../../context/notes/noteContext";
import moment from "moment";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const context = useContext(noteContext);
  const { auth } = context;

  //getOrders
  let getOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/orders", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: auth?.token,
        },
      });
      const data = await res.json();
      setOrders(data?.orders);
    } catch (err) {
      console.log("This is the error during the getOrders.", err);
    }
  };

  useEffect(() => {
    getOrders();
  }, [auth?.token]);

  return (
    <Layout title={"Yours Orders"}>
      {/* <div className="container mt-3">{JSON.stringify(orders, null, 4)}</div> */}
      <div className="container-fluid p-3 m-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-8 text-center mt-3 mt-md-0">
            <h3 className="text-primary fst-italic">All Orders</h3>
            {orders?.map((o, i) => {
              return (
                <div className="border shadow">
                  <table className="table">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Status</th>
                        <th scope="col">Buyer</th>
                        <th scope="col">Orders</th>
                        <th scope="col">Payment</th>
                        <th scope="col">Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{i + 1}</td>
                        <td>{o?.status}</td>
                        <td>{o?.buyer?.name}</td>
                        <td>{moment(o?.createdAt).fromNow()}</td>
                        <td>{o?.payment?.success ? "Success" : "Failed"}</td>
                        <td>{o?.products?.length}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="container">
                    <div className="d-flex flex-wrap gap-3 mt-4 justify-content-center mb-4">
                      {o?.products?.map((product) => {
                        return (
                          <div
                            key={product._id}
                            className="card"
                            style={{ width: "13rem" }}
                          >
                            <img
                              src={`http://localhost:5000/productPhoto/${product._id}`}
                              className="card-img-top object-fit-fill"
                              alt={product.name}
                              style={{ height: "150px" }}
                            />
                            <div className="card-body">
                              <h5 className="card-title">{product.name}</h5>
                              <p className="card-text">
                                {product?.description?.substring(0, 60)}...
                              </p>
                              <p className="card-text text-primary fs-4">
                                {product.price}$
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Orders;
