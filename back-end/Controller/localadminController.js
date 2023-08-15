const {securePassword} = require('../config/bcryptConfig')
const Localadmin = require('../models/localadminModel')
const jwt = require('jsonwebtoken')
const Project = require('../models/ProjectModel')
const bcrypt = require("bcrypt")
const nodemailer = require('nodemailer')
const Company = require('../models/companyModel')
const path = require('path')
const multer = require('multer')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../../front-end/client/public/project_images'));
  },
  filename: (req, file, cb) => {
      const name = Date.now() + '-' + file.originalname;
      cb(null, name);
  }
});

const fileFilter = (req, file, cb) => {
  if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/webp"
  ) {
      cb(null, true);
  } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg, .jpeg, and .webp formats allowed!"));
  }
};

const multerInstance = multer({
  storage: storage,
  fileFilter: fileFilter
});




const opts = {
    overwrite: true,
    invalidate: true,
    resource_type: "auto",
  };

  
  const otpGenerate = () => {
    const otp = Math.floor(Math.random() * 9000) + 1000;
    return otp;
  };





  const sendVerifyMail = async (name, email) => {
    try {
      const otp = otpGenerate();
      const subOtp = otp.toString();
      await Localadmin.updateOne({ email: email }, { $set: { otp: subOtp } });
      console.log(subOtp, 'sendle');
  
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        tls: {
          rejectUnauthorized: false,
        },
        requireTLS: true,
        auth: {
          user: process.env.email,
          pass: process.env.password,
        },
      });
  
      const mailOption = {
        from: "globalcycle12@gmail.com",
        to: email,
        subject: "to verify your detals",
        html:
          "<p>Hi " +
          name +
          " This is your otp to verify your gang accont the otp is " +
          otp +
          "</p>",
      };
  
      transporter.sendMail(mailOption, (error, info) => {
        if (error) {
          console.log(error.message);
        } else {
          console.log('Email has been sent', info.response);
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  
  const register = async (req, res) => {
    try {
      const { name, username , email, password, mobile } = req.body;
      const userExists = await Localadmin.findOne({ email: email });
      if (userExists) {
        return res.status(200).send({ message: 'Company email already exists', success: false });
      }
      
      const usernameExists = await Localadmin.findOne({ username : username})
      if (usernameExists){
        return res.status(200).send({ message: 'Company Username already exists', success: false });
      }
  
      const hashedPassword = await securePassword(password);
  
      const user = new Localadmin({
        name: name,
        username: username,
        email: email,
        password: hashedPassword,
        mobile: mobile,
      });
  
      await user.save();
      sendVerifyMail(name, email);
      res.status(200).send({ message: 'OTP has been sent', success: true });
    } catch (error) {
      res.status(500).send({ message: 'There was an error while creating the user', error, success: false });
    }
  };
  
  const otpVerification = async (req, res) => {
    try {
      const userOtp = await Localadmin.findOne({ email: req.body.email, otp: req.body.otp });
  
      if (!userOtp) {
        return res.status(200).send({ message: 'Invalid OTP, please check again', success: false });
      }
  
      await Localadmin.updateOne({ email: req.body.email }, { $unset: { otp: 1 }, $set: { isVerified: true } });
  
      res.status(200).send({ message: 'Registration successful', success: true });
    } catch (error) {
        console.log(error)
      res.status(500).send({ message: 'Something went wrong', success: false });
    }
  };

const login = async (req, res) => {
    try {
        const localadmin = await Localadmin.findOne({ email: req.body.email });
        if (!localadmin) {
          return res
            .status(200)
            .send({ message: "Admin does not exist", success: false });
        }
        console.log(req.body.password)
        console.log(localadmin.password)
        const isMatch = await bcrypt.compare(req.body.password, localadmin.password);
    
        if (!isMatch) {
          return res
            .status(200)
            .send({ message: "Password is incorrect", success: false });
        } else {
          const token = jwt.sign({ id: localadmin._id }, process.env.local_Secret, {
            expiresIn: "1d",
          });
          res
            .status(200)
            .send({ message: "Localadmin logged in successfully", success: true, token });
        }
      } catch (error) {
        console.log(error);
        res
          .status(500)
          .send({ message: "error while logging in", success: false, error });
      }
}




const profile = async (req, res) => {
    try {
  
        const localadmin = await Localadmin.findById(req.body.localId);
        if (!localadmin) {
          return res
            .status(200)
            .send({ message: "Admin not found", success: false });
        } else {
          res.status(200).send({
            success: true,
            data: {
              name: localadmin.name,
              email: localadmin.email,
              profile: localadmin.profile,
              mobile: localadmin.mobile, 
            },  
            
          });
        }
      } catch (error) {
        res
          .status(500)
          .send({ message: "Error getting admin info", success: false, error });
      }
}

const editprofile = async (req, res) => {
    try {
        const result = await Localadmin.findByIdAndUpdate(req.body.localId, {
          name: req.body.name,
          email: req.body.email,
          mobile: req.body.mobile,
        });
        if (result) {
          res
            .status(200)
            .send({ message: "Admin profile updated successfully", success: true });
        } else {
          res
            .status(200)
            .send({ message: "Admin profile not updated", success: false });
        }
      } catch (error) {
        res
          .status(500)
          .send({ message: "Error getting admin info", success: false, error });
      }
}

const uploadimage = async (req, res) => {
    try {
        const image = req.body.image;
        const imageUpload = await cloudinary.uploader.upload(image, opts)
        await Localadmin.findByIdAndUpdate(req.body.localId , {
          profile: imageUpload.secure_url
        })
        res.status(200).send({message: "Profile updated succesfully " , success: true })
      } catch (error) {
        res.status(500).send({
          message: "Error updating profile picture",
          success: false,
          error,
        });
      }
}


const addcompanydetails = async (req, res) => {
  try {
      const localId = req.body.localId;   
      multerInstance.fields([
          { name: 'license', maxCount: 1 },
          { name: 'certifications', maxCount: 5 }
      ])(req, res, async function (err) {
          if (err) {
              console.error('Error uploading images:', err);
              return res.status(500).json({ error: 'Error uploading images' });
          }
          const {
              companyname,
              companyusername,
              companycategories,
              aboutcompany,
              company
          } = req.body;     
          const localadmin = await Localadmin.findById(localId);
          if (!localadmin) {
              return res.status(404).send({ error: 'Localadmin not found' });
          }
          const companyId = localId;
          const existingCompany = await Company.findOne({ company: companyId });
          if (existingCompany) { 
              return res.status(200).json({  message : ' Company Details Already Added' , success : false, redirectTo: `/localadmin/showcompany/` });
          } else {
              const company = new Company({
                  companyname,
                  companycategories,
                  companyusername,
                  aboutcompany,
                  license: req.files['license'][0].filename, 
                  certifications: req.files['certifications'].map(file => file.filename), 
                  company : companyId   
              });
              if (company.companyusername === localadmin.username) {
                  const savedcompany = await company.save();
                  res.status(201).json({ company: savedcompany, success : true, redirectTo: '/localadmin/showcompany' });
              } else {
                  res.status(201).json({ message : 'Company username is Wrong' , success : false});
              }   
          }
      });

  } catch (error) {
      console.error('Error Creating Company Details', error);
      res.status(500).json({ error: 'Error creating Company Details' });
  }
};


const showcompany = async (req, res) => {
  try {
  
    const localId = req.body.localId;
    const localadmin = await Localadmin.findById(localId);

    if (!localadmin) {
      return res.status(404).json({ error: 'Localadmin not found' });
    }
    const company = await Company.findOne({ company: localId });
    if ( company === null || company.companyusername !== localadmin.username  ) {
      return res.status(200).json({ redirectTo: '/localadmin/addcompanydetails' });
    }
    return res.status(200).json({ company, success: true });
  } catch (error) {
    console.error('Error fetching company details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}



 

const addproject = async (req, res) => {
  try {
    const projectid = req.body.localId
    multerInstance.array('images', 3)(req, res, async function (err) {
      if (err) {
        console.error('Error uploading images:', err);
        return res.status(500).json({ error: 'Error uploading images' });
      }

      // Process other project data
      const { name, companyname, category, aboutproject ,projectId} = req.body;
      const images = req.files.map(file => file.filename);

      // Create and save the project
      
      console.log(projectid);
      const newProject = new Project({
        name,
        companyname,
        category,
        aboutproject,
        images: images,
        projectId:projectid
      });
      await newProject.save();
    

      res.status(201).json({ message: 'Project created successfully' });
    });
  } catch (error) {
    console.log("first")
    console.error('Error adding project:', error);
    res.status(500).json({ error: 'Error adding project' });
  }
};





const showproject = async (req, res) => {
  try {
    const localId = req.body.localId;
    const localadmin = await Localadmin.findById(localId);

    if (!localadmin) {
      return res.status(404).json({ message: 'Localadmin not found' });
    }

    const projects = await Project.find({ projectId: localId });

    res.status(200).json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const getProjectDetails = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.status(200).json(project);
  } catch (error) {
    console.error('Error fetching project details:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


const uploadImage = async (req, res) => {
  try {
  
    const { image } = req.body;
    const newProject = await Project.create({ image });
    res.status(201).json(newProject);
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports={
    register,
    login,
    profile,
    editprofile,
    uploadimage,
    addproject,
    showproject,
    sendVerifyMail,
    otpVerification,
    addcompanydetails,
    uploadImage,
    showcompany,
    getProjectDetails
}