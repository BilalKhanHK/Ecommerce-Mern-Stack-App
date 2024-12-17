import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Spinner = ({ path = "login" }) => {
  const [count, setCount] = useState(3);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prevValue) => --prevValue);
    }, 1000);
    count === 0 &&
      navigate(`/${path}`, {
        state: location.pathname,
      });
    return () => {
      clearInterval(interval);
    };
  }, [count, navigate, path]);

  return (
    <div
      className="container d-flex justify-content-center align-items-center flex-column"
      style={{ height: "90vh" }}
    >
      <h4 className="text-center mx-3">redirecting you in {count} second</h4>
      <div
        className="spinner-border text-info"
        role="status"
        style={{ width: "3rem", height: "3rem" }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;
