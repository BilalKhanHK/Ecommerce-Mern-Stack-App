import React from "react";
import Layout from "../Layouts/Layout";
import { useContext, useState, useEffect } from "react";
import { noteContext } from "../context/notes/noteContext";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DropIn from "braintree-web-drop-in-react";

const Cart = () => {
  const context = useContext(noteContext);
  const { cart, auth, setCart } = context;

  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState(null);

  const navigate = useNavigate();

  //total Price
  const totalPrice = () => {
    try {
      let total = 0;
      cart?.forEach((item) => {
        total += item.price;
      });
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    } catch (error) {
      console.log(error);
    }
  };

  //removeItem
  let removeItem = async (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };

  //getPaymenet Gatway token
  let getToken = async () => {
    try {
      const res = await fetch("http://localhost:5000/braintree/token", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success) {
        setClientToken(data?.clientToken?.clientToken);
      }
    } catch (error) {
      console.log("This is error while getting braintree token  :", error);
    }
  };
  useEffect(() => {
    getToken();
  }, [auth?.token]);

  //handlePayment
  let handlePayment = async () => {
    try {
      if (!instance) {
        console.error("Braintree instance is not set");
        return;
      }
      const { nonce } = await instance.requestPaymentMethod();
      const res = await fetch("http://localhost:5000/braintree/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: auth?.token,
        },
        body: JSON.stringify({
          nonce,
          cart,
        }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.removeItem("cart");
        setCart([]);
        setLoading(false);
        navigate("/dashboard/user/orders");
      }
    } catch (error) {
      console.log("This is Register error  :", error);
    }
  };

  return (
    <Layout title={"Cart Page"}>
      {auth.user ? (
        cart.length > 0 ? (
          <div className="container mt-4">
            <h1 className="text-center text-primary fst-italic">Your Cart</h1>
            <h1 className="text-center text-info fst-italic text-decoration-underline">
              {auth?.user?.name}
            </h1>
            <h4 className="text-center">Total Items: {cart.length}</h4>
            <div className="row ">
              <div className="col-md-8">
                <div className="d-flex flex-wrap gap-3 mt-4 justify-content-center mb-4">
                  {cart?.map((product) => {
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
                          <div className="d-flex flex-wrap gap-4 justify-content-center">
                            <button
                              className="btn btn-danger"
                              onClick={(e) => {
                                e.preventDefault();
                                removeItem(product._id);
                              }}
                            >
                              Remove Item
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="col-md-4 text-center mb-4 mb-md-0">
                <h2>Cart Summary</h2>
                <h4>Payment | CheckOut</h4>
                <hr />
                <h4>Total: {totalPrice()}</h4>
                {auth?.user?.address && (
                  <>
                    <h1>Current Address</h1>
                    <h4 className="text-danger">{auth?.user?.address}</h4>
                    <button
                      className="btn btn-primary mt-3"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate("/dashboard/user/profile");
                      }}
                    >
                      Update Address
                    </button>
                  </>
                )}
                <div className="mt-3 mb-3">
                  {!clientToken || !cart.length ? (
                    " "
                  ) : (
                    <>
                      <DropIn
                        options={{
                          authorization: clientToken,
                          paypal: {
                            flow: "vault",
                          },
                        }}
                        onInstance={(instance, error) => {
                          if (error) {
                            console.error(
                              "Error creating DropIn instance:",
                              error
                            );
                          } else {
                            console.log("DropIn Instance:", instance);
                            setInstance(instance);
                          }
                        }}
                      />
                      <button
                        className="btn btn-success"
                        onClick={(e) => {
                          e.preventDefault();
                          handlePayment();
                        }}
                      >
                        Make Payment
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="container mt-4">
            <h1 className="text-center text-primary fst-italic">Your Cart</h1>
            <h3 className="text-center text-danger fst-italic">
              Your Cart is Empty
            </h3>
            <h1 className="text-center text-info fst-italic text-decoration-underline">
              {auth?.user?.name}
            </h1>
          </div>
        )
      ) : (
        <div className="container mt-4  d-flex flex-column align-items-center gap-3">
          <h1 className="text-center text-primary fst-italic">Your Cart</h1>
          <h3 className="text-center text-danger fst-italic">
            Please Login to View Your Cart
          </h3>
          <button
            className="btn btn-primary w-50"
            onClick={(e) => {
              e.preventDefault();
              navigate("/login");
            }}
          >
            Login
          </button>
        </div>
      )}
    </Layout>
  );
};

export default Cart;
