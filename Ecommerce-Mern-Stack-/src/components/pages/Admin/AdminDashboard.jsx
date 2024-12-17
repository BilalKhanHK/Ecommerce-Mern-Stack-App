import React from "react";
import Layout from "../../Layouts/Layout";
import AdminMenu from "../../Layouts/AdminMenu";
import { useContext } from "react";
import { noteContext } from "../../context/notes/noteContext";

const AdminDashboard = () => {
  const context = useContext(noteContext);
  const { auth, setAuth } = context;

  return (
    <Layout title={"Admin Dashboard"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <div className="card w-75 p-3">
              <h5>Admin Name: {auth?.user?.name}</h5>
              <h5>Admin Email: {auth?.user?.email}</h5>
              <h5>Admin Contact : {auth?.user?.phone}</h5>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
