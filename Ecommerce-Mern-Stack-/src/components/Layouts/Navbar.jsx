import React, { useRef, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useContext } from "react";
import { noteContext } from "../context/notes/noteContext";
import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

const Navbar = () => {
  const context = useContext(noteContext);
  const { auth, setAuth, searchQuery, setSearchQuery, categories, cart } =
    context;

  const navigate = useNavigate();

  // logout
  let logout = () => {
    let a = confirm("Are you Sure to logout?");
    if (a) {
      setAuth({
        ...auth,
        user: null,
        token: "",
      });
      localStorage.removeItem("auth");
      navigate("/login");
    } else {
      navigate("/");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg bg-success p-3">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">
          <i
            class="fa-solid fa-basket-shopping"
            style={{ color: "#63E6BE" }}
          ></i>{" "}
          E-Commerce App
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 fs-4">
            <li className="nav-item">
              <NavLink
                className="nav-link"
                activeClassName="active"
                to="/"
                exact
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link"
                activeClassName="active"
                to="/about"
              >
                About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link"
                activeClassName="active"
                to="/contact"
              >
                Contact
              </NavLink>
            </li>
            {/* <li className="nav-item">
              <NavLink
                className="nav-link"
                activeClassName="active"
                to="/policy"
              >
                Policy
              </NavLink>
            </li> */}
            <li className="nav-item dropdown">
              <NavLink
                to="/categories"
                className="nav-link dropdown-toggle"
                data-bs-toggle="dropdown"
              >
                Categories
              </NavLink>
              <ul className="dropdown-menu">
                <li>
                  <NavLink className="dropdown-item" to="/categories">
                    All Categories
                  </NavLink>
                </li>

                {categories?.map((category) => {
                  return (
                    <li key={category._id}>
                      <NavLink
                        className="dropdown-item"
                        to={`/categories/${category.slug}`}
                      >
                        {category.name}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </li>
          </ul>
          <div className="me-auto container  mx-5 row">
            <div className="col">
              {!auth.user ? (
                <>
                  <button className="btn btn-primary mx-2">
                    <NavLink
                      className="nav-link"
                      activeClassName="active"
                      to="/login"
                    >
                      Login
                    </NavLink>
                  </button>
                  <button className="btn btn-primary mx-2">
                    <NavLink
                      className="nav-link"
                      activeClassName="active"
                      to="/register"
                    >
                      Register
                    </NavLink>
                  </button>
                </>
              ) : (
                <>
                  <button className="btn btn-primary mx-2" onClick={logout}>
                    <NavLink
                      className="nav-link"
                      activeClassName="active"
                      to="/register"
                    >
                      Logout
                    </NavLink>
                  </button>
                </>
              )}
              <button
                className="btn btn-primary mx-2"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/cart");
                }}
              >
                Cart {cart.length}
              </button>
            </div>
            <form className="col d-flex" role="search">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
              />
              <button className="btn btn-primary mx-2">
                <NavLink
                  className="nav-link"
                  activeClassName="active"
                  to={`/dashboard/${auth?.user?.role ? "admin" : "user"}`}
                >
                  Dashboard
                </NavLink>
              </button>
            </form>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
