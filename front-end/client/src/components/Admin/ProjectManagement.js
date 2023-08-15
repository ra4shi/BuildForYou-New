import React, { useState, useEffect } from "react";
import axios from "axios";
import './ProjectManagement.css'

const AdminProjectApproval = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.post("/api/admin/project-management");
      setProjects(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (projectId, newStatus) => {
    try {
      const response = await axios.post(
        "/api/admin/update-status",
        {
          projectId: projectId,
          newStatus: newStatus,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("admintoken"),
          },
        }
      );

      if (response.data.message === "Project status updated successfully") {
        
        const updatedProjects = projects.map((project) =>
          project._id === projectId
            ? { ...project, status: newStatus }
            : project
        );
        setProjects(updatedProjects);
      }
    } catch (error) {
      console.error("Error updating project status:", error);
    }
  };

  return (
    <div>
      <h1>Admin Project Approval</h1>
      {loading ? (
        <p>Loading projects...</p>
      ) : (
        <table className="project-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project._id}>
                <td>{project.name}</td>
                <td>{project.companyname}</td>
                <td>{project.status}</td>
                <td>
                  <button
                    onClick={() => handleStatusUpdate(project._id, "approved")}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(project._id, "rejected")}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminProjectApproval;
