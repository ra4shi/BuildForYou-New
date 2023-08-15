import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { localRequest } from '../../axios';
import { toast } from "react-hot-toast";
import './CompanyAdding.css'

const AddCompanyPage = () => {
  const [formData, setFormData] = useState({
    companyname: '',
    companyusername: '',
    companycategories: '',
    aboutcompany: '',
    certifications: [],
    license: '',
  });

  const history = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const [certificationPreviews, setCertificationPreviews] = useState([]);
  const [licensePreview, setLicensePreview] = useState(null);




  const handleCertificationsChange = (event) => {
    const files = Array.from(event.target.files);
    setFormData((prevState) => ({
      ...prevState,
      certifications: files,
    }));

    // Create previews for the selected certifications
    const previews = files.map((file) => URL.createObjectURL(file));
    setCertificationPreviews(previews);
  };

      
    const handleLicenseChange = (event) => {
      const file = event.target.files[0];
      setFormData((prevState) => ({
        ...prevState, 
        license: file,
      }));

    setLicensePreview(URL.createObjectURL(file));

  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const formDataWithFiles = new FormData();
      formDataWithFiles.append('companyname', formData.companyname);
      formDataWithFiles.append('companyusername', formData.companyusername);
      formDataWithFiles.append('companycategories', formData.companycategories);
      formDataWithFiles.append('aboutcompany', formData.aboutcompany);
      formDataWithFiles.append('license', formData.license);

      formData.certifications.forEach((file) => {
        formDataWithFiles.append('certifications', file);
      });

      const response = await localRequest({
        url: '/api/localadmin/addcompanydetails',
        method: 'POST',
        data: formDataWithFiles,
      });

      if (response && response.data) {
        const { redirectTo, company } = response.data;
        if (redirectTo) {
          history(redirectTo);
        } else {
       
          toast.success("Details Added");
          console.log('Company details added:', company);
          // You can set some state or show a success message here
        }
      } else {
        console.error('Invalid response:', response);
      }
    } catch (error) {
      console.error('Error adding company details:', error);
    }
  };

  return (
<div className="container-fluid px-1 py-5 mx-auto"  >
  <div className="row d-flex justify-content-center">
    <div className="col-xl-7 col-lg-8 col-md-9 col-11 text-center">
  
      <div className="card">
      <h3 className="company-details-heading">Company Details</h3>
      <p className="blue-text">
        <br /> Enter company details properly
      </p>
          <h5 className="text-center mb-4"></h5>
          <form className="form-card" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Enter your company name:</label>
              <input
                type="text"
                id="name"
                name="companyname"
                value={formData.companyname}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="username">Enter your company username:</label>
              <input
                type="text"
                id="username"
                name="companyusername"
                value={formData.companyusername}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="category">Enter your company category:</label>
              <input
                type="text"
                id="category"
                name="companycategories"
                value={formData.companycategories}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="about">Enter About your Company:</label>
              <input
                type="text"
                id="about"
                name="aboutcompany"
                value={formData.aboutcompany}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
          <label htmlFor="certification">Company Certification:</label>
          <input
            type="file"
            id="certification"
            name="certifications"
            multiple
            onChange={handleCertificationsChange}
          />
          {/* Display image previews */}
          <div className="image-preview">
            {certificationPreviews.map((preview, index) => (
              <div key={index} className="image-box">
                <img src={preview} alt={`Certification ${index}`} />
                {/* Allow changing specific certification image */}
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="license">Company license:</label>
          <input
            type="file"
            id="license"
            name="license"
            onChange={handleLicenseChange}
          />
          {/* Display image preview */}
          {licensePreview && <img src={licensePreview} alt="License" />}
        </div>
          <div className="row justify-content-end">
            <div className="form-group col-sm-6">
              <Link to="/localadmin/">
                <button className="btn-block btn-primary">Go to homepage</button>
              </Link>
              <button type="submit" className="btn-block btn-primary">
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>

  
  );
};

export default AddCompanyPage;



