import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';
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

const CompanyDetails = ({ localId }) => {
  const [companyData, setCompanyData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanyDetails();
  }, []);

  const fetchCompanyDetails = async () => {
    try {
      const response = await axios.post(
        '/api/localadmin/showcompany',
        { localId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('localtoken')}`,
          },
        }
      );

      if (!response) {
        navigate('/localadmin/addcompanydetails');
      }

      const { company, redirectTo } = response.data;

      if (redirectTo) {
        window.location.href = redirectTo;
      } else {
        setCompanyData(company);
      }

      if (response.data.success) {
        navigate('/localadmin/showcompany');
      } else {
        console.log('error');
      }
    } catch (error) {
      console.error('Error fetching company details:', error);
    }
  };

  return (
    <div className="home-container">
      <Sidebar />
      <div className="home-container-right">
        <div className="main-container">
          {companyData ? (
            <div>
              <h1>Company Details</h1>
              <p>Company Name: {companyData.companyname}</p>
              <p>Company Username: {companyData.companyusername}</p>
              <p>Company Categories: {companyData.companycategories}</p>
              <p>About Company: {companyData.aboutcompany}</p>
              <p>Certifications:</p>
              <div className="image-gallery">
                {companyData.certifications.map((certification, index) => (
                  <img
                  key={index}
                  src={`/project_images/${certification}`}
                  alt={`Image ${index}`}
                />
                ))}
              </div>
              <p>License:</p>
              {companyData.license && (
                <img
                  src={`/project_images/${companyData.license}`}
                  alt={"Image"}
                />
              )}
              <div className="form-group col-sm-6">
                <Link to="/localadmin/">
                  <button className="btn-block btn-primary">
                    Go to homepage
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <p>Loading company details...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
