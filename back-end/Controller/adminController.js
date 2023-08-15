const Localadmin = require('../models/localadminModel')
const { securePassword } = require("../config/bcryptConfig");
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Project = require('../models/ProjectModel');
const Banner = require('../models/bannerModel')

const path = require('path')
const multer = require('multer')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../../front-end/client/public/banner_images'));
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
  fileFilter: fileFilter,
  fieldName: 'image'
});


const adminEmail = "admin@gmail.com";
const adminPassword = "123";

const adminLogin = (req, res) => {
  if (req.body.email === adminEmail && req.body.password === adminPassword) {
    const admin_Secret = jwt.sign({ id: "thisIsAdmin" }, process.env.admin_Secret, {
      expiresIn: "1d",
    });
    res.status(200).send({
      message: "Admin logged in successfully",
      success: true,
      admin_Secret,
    });
  } else {
    res.status(200).send({ message: "Username or password is incorrect", success: false });
  }
};

const getUsersList = async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).send({ message: "Users fetched successfully", success: true, users });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Something went wrong on the server side" });
    }
  };

  const getLocaladminList = async (req , res ) => {
    try {
        const localadmin = await Localadmin.find();
        res
          .status(200)
          .send({ message: "Admins fetched successsfully", success: true, localadmin });
      } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Something went wrong on server side" });
      }
  }

  const checkblock = async ( req , res ) => {
    try {
        const admin = await Localadmin.findById(req.body.id);
    
        if (!admin) {
          return res.status(200).send({ message: "Admin not found", success: false });
        }
    
        admin.isBlocked = !admin.isBlocked; // Toggle the blocked status
    
        await admin.save();
    
        return res.status(200).send({
          message: `Admin ${admin.isBlocked ? 'blocked' : 'unblocked'} successfully`,
          success: true
        });
      } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Server side error", success: false });
      }
  }

  const blockUserById = async (req, res) => {
    try {
      const userId = req.body.id;
      const data = await User.findByIdAndUpdate(userId, { status: 'blocked' }, { new: true });
  
      if (data) {
        res.status(200).send({ message: "User blocked successfully", success: true });
      } else {
        res.status(200).send({ message: "User not found", success: false });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Server side error", success: false });
    }
  };

  const getUserData = async (req, res) => {
    try {
        const data = await User.findOne({ _id: req.body.id });
        if (data) {
          res
            .status(200)
            .send({
              message: "User data fetched successfully",
              success: true,
              data,
            });
        } else {
          res.status(200).send({ message: "User not found", success: false });
        }
      } catch (error) {
        res.status(500).send({ message: "Server Side Error", success: false });
      }
  }

  const editUserinfo = async (req, res) => {
    try {
        const data = await User.findByIdAndUpdate(req.body.id, {
          name: req.body.name,
          email: req.body.email,
          mobile: req.body.mobile
        });
        if(data){
          res.status(200).send({message: "User updated succesfully" , success: true})
        }
      } catch (error) {
        console.log(error);
        res.status(500).send({ message: "server side error", success: false });
      }
  }

  const addUser = async (req, res) => {
    try {
        const userExists = await User.findOne({ email: req.body.email });
        if (userExists) {
          return res
            .status(200)
            .send({ message: "User already exist", success: false });
        }
        const hashedPassword = await securePassword(req.body.password);
        const user = new User({
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword,
        });
        await user.save();
        res
          .status(200)
          .send({ message: "User created successfully", success: true });
      } catch (error) {
        console.log(error);
        res.status(500).send({ message: "server side error", success: false });
      }
  }

  const approvel = async (req, res) => {
    try {
      const projects = await Project.find();
      res.status(200).json(projects);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Side Error" });
    }
  };
  
  const updateStatus = async (req, res) => {
    const { projectId, newStatus } = req.body;
  
    try {
      
      const project = await Project.findById(projectId);
  
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
     
      
      project.status = newStatus;
      
      await project.save();
    
  
      res.status(200).json({ message: "Project status updated successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Side Error" });
    }
  };



  const createBanner = async (req, res) => {
    try {
      multerInstance.array('image',1)(req, res, async function (err) {
        if (err) {
          console.error('Error uploading image:', err);
          return res.status(500).json({ error: 'Error uploading image' });
        }
      
        const { title, link, isActive } = req.body;
        const images = req.files.map(file => file.filename);
        const banner = new Banner({
          title,
          link,
          isActive,
          image: images, // Use req.file.filename instead of req.files['banner'][0].filename
        });
  
        await banner.save();
        res.status(201).json({ success: true, message: 'Banner created successfully' });
      });
    } catch (error) {
      console.error('Error creating banner:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };
  

  const showbanner = async (req, res) => {
    try {
      const banners = await Banner.find();
      res.status(200).json(banners);
    } catch (error) {
      console.error('Error fetching banners:', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };


  






module.exports = {
  adminLogin,
  getUsersList,
  getLocaladminList,
  checkblock,
  blockUserById,
  getUserData,
  editUserinfo,
  addUser,
  approvel,
  updateStatus,
  createBanner,
  showbanner


};
