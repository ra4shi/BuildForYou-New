import React, { useState, useEffect } from 'react';
import {Link , useLocation , useNavigate} from 'react-router-dom'
import axios from 'axios';
import './ShowBanner.css'
import logo from "../../logo.svg";

const BannerList = () => {
    const location = useLocation();
    const navigate = useNavigate();
  const [banners, setBanners] = useState([]);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("admin_Secret");
    navigate("/admin");
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await axios.post('/api/admin/show-banner');
      setBanners(response.data);
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
  };

  return (
    <div className="banner-list">

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
                to="/admin/project-management"
                className={
                  location.pathname === "/admin/project-management"
                    ? "nav-list active-nav-list"
                    : "nav-list"
                }
              >
                Projects
              </Link>

              <Link
                to="/admin/show-banner"
                className={
                  location.pathname === "/admin/show-banner"
                    ? "nav-list active-nav-list"
                    : "nav-list"
                }
              >
                Banner
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
    
    <h1 className="banner-heading">Banner List</h1>
    <div className="banner-container">
      {banners.map((banner) => (    
        <div key={banner._id} className="banner-item">
          <h2 className="banner-title">{banner.title}</h2>
          <img src={`/banner_images/${banner.image}`} alt={banner.title} className="banner-image" />
          <p className="banner-link">Link: {banner.link}</p>
          <p className={`banner-status ${banner.isActive ? 'active' : 'inactive'}`}>
            Status: {banner.isActive ? 'Active' : 'Inactive'}
          </p>
        </div>
      ))}
    </div>
  </div>
  );
};

export default BannerList;
