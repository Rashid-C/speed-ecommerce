const express = require("express");
const router = express.Router();
const adminController=require("../controllers/admin/adminController");
const { verifyAdmin } = require("../middleware/session");
const multer = require("multer")
const {storage} = require("../middleware/cloudinary")
const upload = multer({storage})

   
router.get("/", adminController.loginadmin)
router.post("/login",adminController.adminVerification)
router.get('/dash',verifyAdmin,adminController.getDash)
router.get("/product",verifyAdmin,adminController.adminProduct)
router.get("/addProduct" ,verifyAdmin, adminController.addProduct)
router.post("/addProduct",verifyAdmin,upload.array('image',3),  adminController.postProduct);
router.get("/logout",adminController.logOut)
router.get("/deleteProduct/:id",adminController.deleteProduct)
router.get("/restoreProduct/:id",adminController.restoreProduct)
router.get("/editProduct/:id",adminController.editProduct)
router.post("/editproduct/:id",adminController.postEdit)


 
module.exports = router;