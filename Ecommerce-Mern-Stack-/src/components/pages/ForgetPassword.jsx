import React, { useState } from "react";
import Layout from "../Layouts/Layout";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ForgetPassword = () => {
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    question: "",
    newPassword: "",
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
      const res = await fetch("http://localhost:5000/forgetPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log("This is Forget Password Data :  ", data);
      if (!data.success) {
        toast.error(data.message);
        return;
      }
      navigate("/login");
      toast.success(data.message);
    } catch (error) {
      console.log("This is Forget Password Error  :", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout title={"Forget Password Page!"}>
      {submitting && (
        <div
          className="container d-flex justify-content-center align-items-center"
          style={{ height: "70vh" }}
        >
          <div class="spinner-border text-info" role="status">
            <span class="visually-hidden">Loading...</span>
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
              onChange={onChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">
              Question
            </label>
            <input
              type="text"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              name="question"
              onChange={onChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleInputPassword1" className="form-label">
              New Password
            </label>
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              name="newPassword"
              onChange={onChange}
              required
            />
          </div>
          <div className="row mt-4">
            <button type="submit" className="col mx-3 btn btn-primary w-25">
              Change Password
            </button>
          </div>
        </form>
      )}
    </Layout>
  );
};

export default ForgetPassword;
