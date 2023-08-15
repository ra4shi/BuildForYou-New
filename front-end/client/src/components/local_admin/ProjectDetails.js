import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import logo from '../../logo.svg';

const Sidebar = ({ location, handleLogout }) => {
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
              location.pathname === '/localadmin'
                ? 'nav-list active-nav-list'
                : 'nav-list'
            }
          >
            Home
          </Link>

          <Link
            to="/localadmin/showcompany"
            className={
              location.pathname === '/localadmin/showcompany'
                ? 'nav-list active-nav-list'
                : 'nav-list'
            }
          >
            Company details
          </Link>

          <Link
            to="/localadmin/projects"
            className={
              location.pathname === '/localadmin/projects'
                ? 'nav-list active-nav-list'
                : 'nav-list'
            }
          >
            Projects
          </Link>

          <Link
            to="/localadmin/profile"
            className={
              location.pathname === '/localadmin/profile'
                ? 'nav-list active-nav-list'
                : 'nav-list'
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

const ProjectDetails = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await axios.get(
          `/api/localadmin/projects/${projectId}`
        );
        setProject(response.data);
      } catch (error) {
        console.error('Error fetching project details:', error);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  if (!project) {
    return <p>Loading project details...</p>;
  }

  return (
    <div className="home-container">
      <Sidebar location={window.location} handleLogout={() => {}} />
      <div className="home-container-right">
        <div className="main-container">
          <div className="project-details-container">
            <h3>{project.name}</h3>
            <p>Company: {project.companyname}</p>
            <p>Category: {project.category}</p>
            <p>About: {project.aboutproject}</p>
            <div className="image-gallery">
              {project.images?.map((image, index) => (
                <img
                  key={index}
                  src={`/project_images/${image}`}
                  alt={`Image ${index}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
