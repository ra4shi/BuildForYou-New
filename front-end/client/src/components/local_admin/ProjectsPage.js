import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';






import logo from "../../logo.svg";
const Sidebar = () => {
 
  const location = useLocation();
  const handleLogout = (e) => {
    e.preventDefault();
    
    location("/localadmin/login");
    localStorage.removeItem("localtoken");
  };
  return (
    <div className="home-container-left">
      <div className="side-nav">
        <div className="logo">
          <img src={logo} className="App-logo" alt="logo" />
        </div>
        <div className="nav-lists">
          <Link
            to="/localadmin"
            className={
              location.pathname === "/localadmin"
                ? "nav-list active-nav-list"
                : "nav-list"
            }
          >
            Home
          </Link>

          <Link
            to="/localadmin/showcompany"
            className={
              location.pathname === "/localadmin/showcompany"
                ? "nav-list active-nav-list"
                : "nav-list"
            }
          >
            Company details
          </Link>

          <Link
            to="/localadmin/projects"
            className={
              location.pathname === "/localadmin/projects"
                ? "nav-list active-nav-list"
                : "nav-list"
            }
          >
            Projects
          </Link>

          <Link
            to="/localadmin/profile"
            className={
              location.pathname === "/localadmin/profile"
                ? "nav-list active-nav-list"
                : "nav-list"
            }
          >
            Admin Profile
          </Link>

          <Link className="nav-list" onClick={handleLogout}>
            Logout
          </Link>
        </div>
      </div>
    </div>
  );
};

const ShowProjects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.post(
          "/api/localadmin/projects",
          {},
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("localtoken"),
            },
          }
        );
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="home-container">
      <Sidebar />
      <div className="home-container-right">
        <div className="main-container">
          <h1>Projects List</h1>
          <ul>
            {projects.length > 0 ? (
              projects.map(project => (
                <li key={project._id}>
                  <h3>{project.name}</h3>
                  <p>Company: {project.companyname}</p>
                  <p>Category: {project.category}</p>
                  <Link to={`/localadmin/projects/${project._id}`}>View Details</Link>
                  <hr />
                 
                </li>
              ))
            ) : (
              <p>No projects available.</p>
            )}
          </ul>
          <Link to="/localadmin/addproject">
                  <button className="btn-block btn-primary">
                    Add Project
                  </button>
                </Link>
        </div>
      </div>
    </div>
  );
};

export default ShowProjects;
