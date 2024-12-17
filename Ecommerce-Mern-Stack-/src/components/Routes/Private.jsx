import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { noteContext } from "../context/notes/noteContext";
import { Outlet } from "react-router-dom";
import Spinner from "../Spinner";

const Private = () => {
  //getting states from context api
  const context = useContext(noteContext);
  const { auth } = context;

  //setting state of ok
  const [ok, setOk] = useState(false);

  //useEffect
  useEffect(() => {
    const authCheck = async () => {
      try {
        const res = await fetch("http://localhost:5000/user-auth", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: auth?.token,
          },
          //   headers: setAuthHeader(),
        });
        if (res.ok) {
          setOk(true);
        } else {
          setOk(false);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setOk(false);
      }
    };
    if (auth?.token) authCheck();
  }, [auth?.token]);
  return ok ? <Outlet /> : <Spinner />;
};

export default Private;
