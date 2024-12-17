import React, { useState, useEffect } from "react";
import Layout from "../../Layouts/Layout";
import AdminMenu from "../../Layouts/AdminMenu";
import { useContext } from "react";
import { noteContext } from "../../context/notes/noteContext";
import { Select } from "antd";
import toast from "react-hot-toast";
const { Option } = Select;
import { useNavigate, useParams } from "react-router-dom";

const UpdateProduct = () => {
  //context
  const context = useContext(noteContext);
  const { auth } = context;

  //navigate
  const navigate = useNavigate();
  const params = useParams();

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState("");
  const [id, setId] = useState("");

  //get single product
  let getSingleProduct = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/individualProduct/${params.slug}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      if (data?.success) {
        setName(data?.product?.name);
        setDescription(data?.product?.description);
        setPrice(data?.product?.price);
        setCategory(data?.product?.category._id);
        setQuantity(data?.product?.quantity);
        setShipping(data?.product?.shipping);
        // setPhoto(data?.product?.photo);
        setId(data?.product?._id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //get all products
  const getAllProducts = async () => {
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
      toast.error("Something went wrong in Getting Category");
    }
  };

  //get photo
  let getPhoto = async () => {
    try {
      const res = await fetch(`http://localhost:5000/productPhoto/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.blob();
      if (res.ok) {
        setPhoto(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllProducts();
    getSingleProduct();
    getPhoto();
  }, [id]);

  // handleCreate
  let handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      photo && productData.append("photo", photo);
      productData.append("category", category);

      const res = await fetch(`http://localhost:5000/updateProduct/${id}`, {
        method: "PUT",
        headers: {
          token: auth?.token,
        },
        body: productData,
      });
      const data = await res.json();
      if (data?.success) {
        toast.success(data?.message);
        navigate("/dashboard/admin/products");
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in Update Product.");
    }
  };

  //   handleDelete
  let handleDelete = async () => {
    try {
      const res = await fetch(`http://localhost:5000/deleteProduct/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data?.success) {
        toast.success(data?.message);
        navigate("/dashboard/admin/products");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in Delete Product.");
    }
  };
  return (
    <Layout title={"Create Product Dashboard"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9 mt-md-0 mt-3">
            <h1>Update/Delete Product</h1>
            <div className="m-1 w-75">
              <Select
                bordered={false}
                placeholder="Select a Category"
                size="large"
                showSearch
                className="form-select mb-3"
                onChange={(value) => setCategory(value)}
                value={category}
              >
                {categories?.map((category) => (
                  <Option key={category._id} value={category._id}>
                    {category.name}
                  </Option>
                ))}
              </Select>
              <div className="mb-3">
                <label className="btn btn-outline-primary col-md-12">
                  {/* {photo ? photo.name : "Upload Photo"} */}
                  {photo && "Do you want to Update Photo"}
                  <input
                    type="file"
                    name="photo"
                    accept="images/*"
                    onChange={(e) => {
                      setPhoto(e.target.files[0]);
                    }}
                    hidden
                  />
                </label>
              </div>
              <div className="mb-3">
                {photo ? (
                  <div className="text-center">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="Product Photo"
                      height={"200px"}
                      className="img img-responsive"
                    />
                  </div>
                ) : (
                  <>
                    <div className="text-center">
                      <img
                        src={`http://localhost:5000/productPhoto/${id}`}
                        alt="Product Photo"
                        height={"200px"}
                        className="img img-responsive"
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  value={name}
                  placeholder="Write a name"
                  className="form-control"
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </div>
              <div className="mb-3">
                <textarea
                  value={description}
                  class="form-control"
                  placeholder="Write a description"
                  style={{ height: "100px" }}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                ></textarea>
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  value={price}
                  placeholder="Write a price"
                  className="form-control"
                  onChange={(e) => {
                    setPrice(e.target.value);
                  }}
                />
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  value={quantity}
                  placeholder="Write a quantity"
                  className="form-control"
                  onChange={(e) => {
                    setQuantity(e.target.value);
                  }}
                />
              </div>
              <div className="mb-3">
                <Select
                  bordered={false}
                  placeholder="Select Shipping"
                  size="large"
                  showSearch
                  className="form-select mb-3"
                  onChange={(value) => setShipping(value)}
                  value={shipping ? "Yes" : "No"}
                >
                  <Option value="0">NO</Option>
                  <Option value="1">Yes</Option>
                </Select>
              </div>
              <div className="mb-3">
                <button className="btn btn-primary mx-3" onClick={handleUpdate}>
                  Update Product
                </button>
                <button
                  className="btn btn-primary mx-3"
                  onClick={(e) => {
                    e.preventDefault();
                    let a = confirm("Are you sure to delete this product?");
                    if (a) {
                      handleDelete();
                    }
                  }}
                >
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateProduct;
