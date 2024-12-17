import React, { useEffect, useState } from "react";
import Layout from "../../Layouts/Layout";
import AdminMenu from "../../Layouts/AdminMenu";
import toast from "react-hot-toast";
import CategoryForm from "../../Form/CategoryForm";
import { useContext } from "react";
import { noteContext } from "../../context/notes/noteContext";
import { useRef } from "react";

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [currentCategoryId, setCurrentCategoryId] = useState(null);

  //ref
  const editref = useRef(null);
  const catRef = useRef(null);
  const descriptionRef = useRef(null);
  const closeRef = useRef(null);

  //handleEdit
  let handleEdit = (c) => {
    editref.current.click();
    setCategory(c.name);
    setCurrentCategoryId(c._id);
  };

  //onChange
  let onChange = (e) => {
    setCategory(e.target.value);
  };

  //handleUpdate
  let handleUpdate = async (e) => {
    e.preventDefault();
    try {
      //update api
      const res = await fetch(
        `http://localhost:5000/updateCategory/${currentCategoryId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token: auth?.token,
          },
          body: JSON.stringify({ name: category }),
        }
      );
      const data = await res.json();
      if (data?.success) {
        descriptionRef.current.value = "";
        closeRef.current.click();
        getAllCategories();
        toast.success("Category Updated");
        setCurrentCategoryId(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("UPdate category error", error);
      toast.error("Something went wrong in Update Category input form.");
    }
    // update api
  };

  //context
  const context = useContext(noteContext);
  const { auth } = context;

  //handlesubmit
  let handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //create Category Api
      const res = await fetch("http://localhost:5000/createCategory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: auth?.token,
        },
        body: JSON.stringify({ name: name }),
      });
      const data = await res.json();
      if (data?.success) {
        toast.success("Category Created");
        setName("");
        getAllCategories();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Create category error", error);
      toast.error("Something went wrong in input form.");
    }
  };

  //get all categories
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
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in Getting Category");
    }
  };
  useEffect(() => {
    getAllCategories();
    // console.log(categories);
  }, []);

  //handleDelete
  let handleDelete = async (c) => {
    console.log(c._id);
    try {
      //delete api
      const res = await fetch(`http://localhost:5000/deleteCategory/${c._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          token: auth?.token,
        },
      });
      const data = await res.json();
      if (data?.success) {
        toast.success("Category Deleted");
        getAllCategories();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in Deleting Category");
    }
  };

  return (
    <Layout title={"Create Category"}>
      {/* model  */}
      <div>
        <div>
          {/* Button trigger modal */}
          <button
            type="button"
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            style={{ display: "none" }}
            ref={editref}
          ></button>
          {/* Modal */}
          <div
            className="modal fade"
            id="exampleModal"
            tabIndex={-1}
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">
                    Edit Category
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  />
                </div>
                <div className="modal-body">
                  <form>
                    <div className="mb-3 my-3">
                      <label htmlFor="title" className="form-label">
                        Category
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="etitle"
                        name="description"
                        aria-describedby="emailHelp"
                        onChange={onChange}
                        ref={descriptionRef}
                        value={category}
                      />
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    ref={closeRef}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleUpdate}
                  >
                    Update Category
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center">Manage Category</h1>
            <div className="p-3 ">
              <CategoryForm
                handleSubmit={handleSubmit}
                value={name}
                setValue={setName}
              />
            </div>
            <div className="w-75">
              {categories.length > 0 ? (
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Name</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((c, index) => {
                      return (
                        <>
                          <tr key={c._id}>
                            <td>{c.name}</td>
                            <td>
                              <button
                                className="btn btn-primary mx-2"
                                onClick={() => {
                                  handleEdit(c, index);
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger mx-2"
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDelete(c);
                                }}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        </>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="alert alert-danger" role="alert">
                  No Category Found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;
