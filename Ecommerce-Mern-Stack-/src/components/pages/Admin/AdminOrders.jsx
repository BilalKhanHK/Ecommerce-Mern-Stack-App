import React from "react";
import Layout from "../../Layouts/Layout";
import AdminMenu from "../../Layouts/AdminMenu";
import { useContext, useEffect, useState } from "react";
import { noteContext } from "../../context/notes/noteContext";
import moment from "moment";
import { Select } from "antd";
const { Option } = Select;
import toast from "react-hot-toast";

const AdminOrders = () => {
  const context = useContext(noteContext);
  const { auth } = context;

  const [orders, setOrders] = React.useState([]);
  const [status, setStatus] = useState([
    "Not Process",
    "Processing",
    "Shipped",
    "Delivered",
    "Canceled",
  ]);

  //getOrders
  let getAllOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/allOrders", {
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
    getAllOrders();
  }, []);

  //   handleUpdate
  let handleUpdate = async (id, value) => {
    try {
      const res = await fetch(`http://localhost:5000/updateStatus/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: auth?.token,
        },
        body: JSON.stringify({ status: value }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Status Updated Successfully");
        getAllOrders();
      }
    } catch (err) {
      console.log("This is the error during the getOrders.", err);
    }
  };

  return (
    <Layout>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-8  text-center">
            <h1 className="text-primary fst-italic">All Orders</h1>
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
                        <td>
                          <Select
                            bordered={false}
                            defaultValue={o?.status}
                            size="large"
                            showSearch
                            className="form-select mb-3 "
                            onChange={(value) => {
                              handleUpdate(o?._id, value);
                            }}
                          >
                            {status?.map((s) => (
                              <Option key={s} value={s}>
                                {s}
                              </Option>
                            ))}
                          </Select>
                        </td>
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

export default AdminOrders;
