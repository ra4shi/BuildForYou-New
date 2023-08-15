import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../local_admin/AddProject.css';
import { localRequest } from '../../axios';

const AddProject = () => {
  const [name, setName] = useState('');
  const [companyname, setCompanyname] = useState('');
  const [category, setCategory] = useState('');
  const [aboutProject, setAboutProject] = useState('');
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('companyname', companyname);
      formData.append('category', category);
      formData.append('aboutproject', aboutProject);
      for (let i = 0; i < images.length; i++) {
        formData.append('images', images[i]);
      }

      const response = await localRequest({
        url: '/api/localadmin/addproject',
        method: 'POST',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data', // Set content type for file upload
        },
      });

      console.log(response.data);

      // Reset form fields and navigate
      setName('');
      setCompanyname('');
      setCategory('');
      setAboutProject('');
      setImages([]);
      navigate('/localadmin/projects');
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  return (
    <div className="add-project-container">
      <h2>Add Project</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Project Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter project name"
            required
          />
        </div>
        <div className="form-group">
          <label>Company Name:</label>
          <input
            type="text"
            value={companyname}
            onChange={(e) => setCompanyname(e.target.value)}
            placeholder="Enter company name"
            required
          />
        </div>
        <div className="form-group">
          <label>Category:</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Enter category"
            required
          />
        </div>
        <div className="form-group">
          <label>About Project:</label>
          <textarea
            value={aboutProject}
            onChange={(e) => setAboutProject(e.target.value)}
            placeholder="Enter project description"
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label>Upload Images:</label>
          <input type="file" multiple onChange={(e) => setImages(e.target.files)} required />
        </div>
        <button type="submit">Add Project</button>
      </form>
    </div>
  );
};

export default AddProject;
