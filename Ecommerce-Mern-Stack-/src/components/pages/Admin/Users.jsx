import React from "react";
import Layout from "../../Layouts/Layout";
import AdminMenu from "../../Layouts/AdminMenu";

const Users = () => {
  return (
    <Layout title={"All Users Dashboard"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Users Component</h1>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Users;
