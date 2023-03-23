const express = require("express");
const router = express.Router();
const userController = require("../controllers/user/userController");
const { verifyUser } = require("../middleware/session");
const multer = require("multer");

const { storage, cloudinary } = require("../middleware/cloudinary");
const upload = multer({ storage });

 

router.get("/signup", userController.signup_page);
router.get("/login", userController.login_page);
router.post("/signup", userController.userPost);
router.post("/login", userController.user_verification); 

router.get("/", userController.get_home);
router.get("/shop", userController.getshop); 
router.get("/logout", userController.logOut);
router.get("/getCart", verifyUser, userController.getCart); 
router.get("/addToCart/:id", verifyUser, userController.addTocartUser);
router.post("/otpSignUp", userController.otpSignUp);
router.get("/removeCart/:id", userController.removeCartUser);
router.get("/productView/:id", userController.productView);
router.get("/wishList", verifyUser, userController.getWishList); 
router.get("/postWishList/:id", verifyUser, userController.postWishList);
router.get("/userProfile", verifyUser, userController.getUser);
router.post("/userProfile",verifyUser,upload.single("image"),userController.profileImage)
router.get("/userAddress", verifyUser, userController.addAddress); 
router.post("/postUserAddress", verifyUser, userController.postAddress);
router.get("/removeWishList/:id", verifyUser, userController.removeWishList);
router.post("/changeQuantity", userController.addQuantity);
router.get("/checkOut", verifyUser, userController.checkOut); 
 
router.get("/success",verifyUser, userController.success); 
router.get("/cancel",verifyUser,userController.cancel)      

router.post("/validateChechout",verifyUser, userController.validateChechout); 
router.get("/resetPassword",verifyUser,userController.resetPassword)
router.post("/postResetPassword",verifyUser,userController.postResetPassword)

router.get("/error404",verifyUser,userController.error404)
router.get("/forgotPassword",userController.forgotPassword) 
router.post("/forgotOtp",userController.forgotOtp)
router.post("/resetOtp",userController.resetOtp)
router.post("/afterForgotOtp",userController.afterForgotOtp)
router.post("/search",verifyUser,userController.search)
router.get("/filterView/:id",verifyUser,userController.filter) 
router.get("/MyOrders",verifyUser,userController.MyOrders)
router.get("/userOrderStatusChange/:id",verifyUser,userController.userOrderStatusChange)
router.get("/orderReview",verifyUser,userController.orderReview) 
router.post("/applyCoupon",verifyUser,userController.applyCoupon)


 

module.exports = router;
