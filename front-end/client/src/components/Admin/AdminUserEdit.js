import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import logo from "../../logo.svg";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../../redux/alertsSlice";
import axios from "axios";
import { toast } from "react-hot-toast";

function AdminUserEdit() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [data, setData] = useState({ name: "", email: "" });

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("admin_Secret");
    navigate("/admin");
  };

  const [searchParams] = useSearchParams();

  const getData = async () => {
    const id = searchParams.get("id");
    try {
      dispatch(showLoading());
      const res = await axios.post("/api/admin/get-user-data", { id });
      dispatch(hideLoading());
      if (res.data.success) {
        setData(res.data.data);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  const editUser = async (e) => {
    e.preventDefault();

    const id = searchParams.get("id");
    try {
      dispatch(showLoading());
      const response = await axios.post("/api/admin/edit-user-info", {
        name: e.target.name.value ? e.target.name.value : data.name,
        email: e.target.email.value ? e.target.email.value : data.email,
        id: id,
      });
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success("Profile Updated Successfully");
        navigate("/users-list");
      }
    } catch (error) {
      toast.error("Something Went Wrong " + error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <div className="home-container">
        <div className="home-container-left">
          <div className="side-nav">
            <div className="logo">
              <img src={logo} className="App-logo" alt="logo" />
            </div>
            <div className="nav-lists">
              <Link
                to="/adminHome"
                className={
                  location.pathname === "/adminHome"
                    ? "nav-list active-nav-list"
                    : "nav-list"
                }
              >
                Home
              </Link>

              <Link
                to="/company-approvel"
                className={
                  location.pathname === "/company-approvel"
                    ? "nav-list active-nav-list"
                    : "nav-list"
                }
              >
                Companies
              </Link>

              <Link
                to="/users-list"
                className={
                  location.pathname === "/users-list"
                    ? "nav-list active-nav-list"
                    : "nav-list"
                }
              >
                Users List
              </Link>
              <Link className="nav-list" onClick={handleLogout}>
                Logout
              </Link>
            </div>
          </div>
        </div>
        <div className="home-container-right">
          <div className="main-container">
            <h1>Edit User</h1>
            {/* Template Start */}

            <form onSubmit={editUser}>
              <div className="form-group">
                <div className="card">
                  <div className="card-body">
                    <div className="row mb-3">
                      <div className="col-sm-3">
                        <h6 className="mb-0">Full Name</h6>
                      </div>
                      <div className="col-sm-9 text-secondary">
                        <input
                          type="text"
                          className="form-control"
                          placeholder={data.name}
                          name="name"
                        />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-sm-3">
                        <h6 className="mb-0">Email</h6>
                      </div>
                      <div className="col-sm-9 text-secondary">
                        <input
                          type="text"
                          className="form-control"
                          placeholder={data.email}
                          name="email"
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-sm-3"></div>
                      <div className="col-sm-9 text-secondary">
                        <button className="btn btn-primary px-4" type="submit">
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>

            {/* Template End */}
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminUserEdit;
