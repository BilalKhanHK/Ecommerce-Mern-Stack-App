import React from "react";
import Layout from "../../Layouts/Layout";
import UserMenu from "../../Layouts/UserMenu";
import { useContext } from "react";
import { noteContext } from "../../context/notes/noteContext";

const Dashboard = () => {
  const context = useContext(noteContext);
  const { auth, setAuth } = context;

  return (
    <Layout title={"Users Dashboard"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <div className="card w-75 p-3">
              <h5>User Name: {auth?.user?.name}</h5>
              <h5>User Email: {auth?.user?.email}</h5>
              <h5>User Contact : {auth?.user?.phone}</h5>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
