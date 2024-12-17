import React, { useState, useEffect } from "react";
import Layout from "../Layouts/Layout";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { noteContext } from "../context/notes/noteContext";

const Register = () => {
  //context
  const context = useContext(noteContext);
  const { auth, setAuth } = context;

  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    cPassword: "",
    phone: "",
    address: "",
    question: "",
  });

  //onchange
  let onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  //handlesubmit
  let handleSubmit = async (e) => {
    setSubmitting(true);
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log("This is Signin Data :  ", data);
      if (data.success) {
        setAuth({ ...auth, user: data.user, token: data.token });
        // localStorage.setItem("token", data.token);
        localStorage.setItem("auth", JSON.stringify(data));
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("This is Register error  :", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Layout title={"Register Page"}>
        {submitting && (
          <div
            className="container d-flex justify-content-center align-items-center flex-column"
            style={{ height: "70vh" }}
          >
            <div class="spinner-border text-info" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <h1>Registering</h1>
          </div>
        )}
        {!submitting && (
          <form
            className="container d-flex flex-column mt-5 mb-5"
            onSubmit={handleSubmit}
          >
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                aria-describedby="emailHelp"
                name="name"
                onChange={onChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                aria-describedby="emailHelp"
                name="email"
                onChange={onChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">
                Phone
              </label>
              <input
                type="text"
                className="form-control"
                id="phone"
                aria-describedby="emailHelp"
                name="phone"
                onChange={onChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">
                Address
              </label>
              <input
                type="text"
                className="form-control"
                id="phone"
                aria-describedby="emailHelp"
                name="address"
                required
                onChange={onChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">
                Question
              </label>
              <input
                type="text"
                className="form-control"
                id="question"
                aria-describedby="emailHelp"
                name="question"
                required
                onChange={onChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                required
                onChange={onChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="cPassword" className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                className="form-control"
                id="cPassword"
                name="cPassword"
                required
                onChange={onChange}
              />
            </div>
            <div className="row mt-4">
              <button type="submit" className="col mx-2 btn btn-primary w-25">
                Register
              </button>
              <button type="submit" className="col mx-2 btn btn-success w-25">
                <NavLink
                  to="/login"
                  className="nav-link text-dark"
                  activeClassName="active"
                >
                  Already have an account? Login
                </NavLink>
              </button>
            </div>
          </form>
        )}
      </Layout>
    </div>
  );
};

export default Register;
