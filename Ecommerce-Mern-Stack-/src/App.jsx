import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";
import About from "./components/pages/About";
import Contact from "./components/pages/Contact";
import Policy from "./components/pages/Policy";
import PageNotFound from "./components/pages/PageNotFound";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import NoteState from "./components/context/notes/NoteState";
import Dashboard from "./components/pages/user/Dashboard";
import Private from "./components/Routes/Private";
import ForgetPassword from "./components/pages/ForgetPassword";
import AdminRoute from "./components/Routes/AdminRoute";
import AdminDashboard from "./components/pages/Admin/AdminDashboard";
import CreateCategory from "./components/pages/Admin/CreateCategory";
import CreateProduct from "./components/pages/Admin/CreateProduct";
import Users from "./components/pages/Admin/Users";
import Profile from "./components/pages/user/Profile";
import Orders from "./components/pages/user/Orders";
import Product from "./components/pages/Admin/Product";
import UpdateProduct from "./components/pages/Admin/UpdateProduct";
import ProductDetails from "./components/pages/ProductDetails";
import AllCategories from "./components/pages/AllCategories";
import CategoreyList from "./components/pages/CategoreyList";
import Cart from "./components/pages/Cart";
import AdminOrders from "./components/pages/Admin/AdminOrders";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <NoteState>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:slug" element={<ProductDetails />} />
            <Route path="/categories" element={<AllCategories />} />
            <Route path="/categories/:slug" element={<CategoreyList />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/about" element={<About />} />
            <Route path="/policy" element={<Policy />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Private />}>
              <Route path="user" element={<Dashboard />} />
              <Route path="user/profile" element={<Profile />} />
              <Route path="user/orders" element={<Orders />} />
            </Route>
            <Route path="/dashboard" element={<AdminRoute />}>
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="admin/createCategory" element={<CreateCategory />} />
              <Route path="admin/createProduct" element={<CreateProduct />} />
              <Route path="admin/product/:slug" element={<UpdateProduct />} />
              <Route path="admin/products" element={<Product />} />
              <Route path="admin/users" element={<Users />} />
              <Route path="admin/orders" element={<AdminOrders />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/forgetPassword" element={<ForgetPassword />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </NoteState>
    </>
  );
}

export default App;
