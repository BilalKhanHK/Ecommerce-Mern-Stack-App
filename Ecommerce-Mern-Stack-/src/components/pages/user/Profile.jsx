import React, { useState, useEffect } from "react";
import Layout from "../../Layouts/Layout";
import UserMenu from "../../Layouts/UserMenu";
import { useContext } from "react";
import { noteContext } from "../../context/notes/noteContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  //context
  const context = useContext(noteContext);
  const { auth, setAuth } = context;

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    cPassword: "",
  });
  // console.log(auth);

  useEffect(() => {
    const { email, phone, address, name } = auth?.user;
    setFormData({
      ...formData,
      name,
      email,
      phone,
      address,
    });
  }, []);

  //onchange
  let onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  //handlesubmit
  let handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/updateProfile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: auth?.token,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      // console.log("This is the data of update profile route:  ", data);
      if (data.success) {
        // data?.user
        setAuth({ ...auth, user: formData });
        localStorage.setItem(
          "auth",
          JSON.stringify({ ...auth, user: formData })
        );
        toast.success(data.message);
        navigate("/dashboard/user");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("This is Register error  :", error);
    }
  };

  return (
    <Layout title={"Profile"}>
      <div className="container-fluid p-3 m-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9  mt-md-0 mt-2">
            <h1 className="text-center">Profile</h1>
            <form
              className="container d-flex flex-column mt-2 mb-2"
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
                  value={formData.name}
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
                  value={formData.email}
                  disabled
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
                  value={formData.phone}
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
                  value={formData.address}
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

              <div className="mt-4 d-flex  container justify-content-center">
                <button type="submit" className=" mx-2 btn btn-primary  w-50">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
