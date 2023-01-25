const express = require("express");
const router = express.Router();
const userController = require("../controllers/user/userController");
const { verifyUser } = require("../middleware/session");



router.get("/signup",userController.signup_page);
router.get('/login',userController.login_page)
router.post("/signup",userController.userPost)
router.post('/login',userController.user_verification)
router.get('/',userController.get_home)
router.get("/shop",userController.getshop)
router.get('/logout',userController.logOut)
router.get("/addToCart",verifyUser,userController.addToCart)
module.exports = router;
