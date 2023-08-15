const express = require("express");
const router = express.Router();

const adminController =require('../Controller/adminController')
const auth = require('../middlewares/adminauthMiddleware')



router.post('/admin-login', adminController.adminLogin);

//get users list
router.post('/users-list', adminController.getUsersList);

//get admin list
router.post("/localadmin-list",adminController.getLocaladminList)

//blocK admin by id
router.post("/block-unblock-admin" , adminController.checkblock)
 



//delete user by id

router.post('/block-localadmin-by-id' , adminController.blockUserById);

//get user data
router.post("/get-user-data" , adminController.getUserData)

//edit user info
router.post("/edit-user-info" , adminController.editUserinfo)

//add new user
router.post("/add-user" , adminController.addUser)  

router.post("/project-management"  , adminController.approvel)

router.post("/update-status" , adminController.updateStatus)

router.post('/add-banner', adminController.createBanner);

router.post('/show-banner',adminController.showbanner)


module.exports = router;
