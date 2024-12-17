import React, { useState, useRef } from "react";
import Layout from "../Layouts/Layout";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useContext } from "react";
import { noteContext } from "../context/notes/noteContext";

const Login = () => {
  const location = useLocation();
  const context = useContext(noteContext);
  const { auth, setAuth } = context;
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  //onchnge
  let onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  //handleSubmit
  let handleSubmit = async (e) => {
    setSubmitting(true);
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log("This is Login Data :  ", data);
      if (data.success) {
        setAuth({ ...auth, user: data.user, token: data.token });
        // localStorage.setItem("token", data.token);
        localStorage.setItem("auth", JSON.stringify(data));
        navigate(location.state || "/");
      } else {
        toast.error(data.message);
        emailRef.current.value = "";
        passwordRef.current.value = "";
      }
    } catch (error) {
      console.log("This is Login Error  :", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout title={"Login Page"}>
      {submitting && (
        <div
          className="container d-flex justify-content-center align-items-center"
          style={{ height: "70vh" }}
        >
          <div className="spinner-border text-info" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {!submitting && (
        <form
          className="container d-flex flex-column justify-content-center"
          style={{ height: "60vh" }}
          onSubmit={handleSubmit}
        >
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              name="email"
              ref={emailRef}
              onChange={onChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              name="password"
              ref={passwordRef}
              onChange={onChange}
              required
            />
          </div>
          <div className="row mt-4">
            <button type="submit" className="col mx-3 btn btn-primary w-25">
              Login
            </button>
            <button type="submit" className="col mx-3 btn btn-success w-25">
              <NavLink
                to="/register"
                className="nav-link text-dark"
                activeClassName="active"
              >
                Don't have account? Sign up.
              </NavLink>
            </button>
            <button type="submit" className="col-12 mx-3 btn btn-success w-25">
              <NavLink
                to="/forgetPassword"
                className="nav-link text-dark"
                activeClassName="active"
              >
                Forget Password
              </NavLink>
            </button>
          </div>
        </form>
      )}
    </Layout>
  );
};

export default Login;
