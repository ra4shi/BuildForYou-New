import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import './AddBanner.css'


const AdminBannerAdd = () => {
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [images, setImages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('link', link);
      formData.append('isActive', isActive);
      for (let i = 0; i < images.length; i++) {
        formData.append('image', images[i]);
      }

      const response = await axios.post('/api/admin/add-banner', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast.success('Banner created successfully');
      }
    } catch (error) {
      console.error('Error creating banner:', error);
      toast.error('Failed to create banner');
    }
  };

  return (
    <div className="banner-form-container">
      <h1>Add Banner</h1>
      <form className="banner-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="link">Link:</label>
          <input
            type="text"
            id="link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="isActive">Active:</label>
          <input
            type="checkbox"
            id="isActive"
            checked={isActive}
            onChange={() => setIsActive(!isActive)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="image">Image:</label>
          <input
            type="file"
            id="image"
            multiple
            onChange={(e) => setImages(e.target.files)}
          />
        </div>
        <button type="submit" className="submit-button">
          Add Banner
        </button>
      </form>
    </div>
  );
};

export default AdminBannerAdd;
