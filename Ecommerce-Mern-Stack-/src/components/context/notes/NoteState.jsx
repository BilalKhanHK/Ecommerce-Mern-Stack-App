import React, { useState, useEffect } from "react";
import { noteContext } from "./noteContext";

const NoteState = (props) => {
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const data = localStorage.getItem("auth");
    if (data) {
      const parseData = JSON.parse(data);
      setAuth({
        ...auth,
        user: parseData.user,
        token: parseData.token,
      });
    }
  }, []);

  useEffect(() => {
    getAllCategories();
  }, []);

  useEffect(() => {
    let existingCartItem = localStorage.getItem("cart");
    if (existingCartItem) {
      setCart(JSON.parse(existingCartItem));
    }
  }, []);

  //get all products
  const getAllCategories = async () => {
    try {
      //get All categories api
      const res = await fetch("http://localhost:5000/allCategories", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data?.success) {
        setCategories(data?.categories);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in Getting Category in context api.");
    }
  };

  return (
    <noteContext.Provider
      value={{
        auth,
        setAuth,
        searchQuery,
        setSearchQuery,
        categories,
        cart,
        setCart,
      }}
    >
      {props.children}
    </noteContext.Provider>
  );
};

export default NoteState;
