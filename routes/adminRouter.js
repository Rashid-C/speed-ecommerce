const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin/adminController");
const { verifyAdmin } = require("../middleware/session");
const multer = require("multer");
const { storage, cloudinary } = require("../middleware/cloudinary");
const upload = multer({ storage });
const chart=require("chart.js")   

router.get("/", adminController.loginadmin);
router.post("/alogin", adminController.adminVerification);
router.get("/dash", verifyAdmin, adminController.getDash);
router.get("/product", verifyAdmin, adminController.adminProduct);
router.get("/addProduct", verifyAdmin, adminController.addProduct);
router.post("/addProduct",verifyAdmin,upload.array("image"),adminController.postProduct);
router.get("/logout", adminController.logOut);
router.get("/deleteProduct/:id", adminController.deleteProduct);
router.get("/restoreProduct/:id", adminController.restoreProduct); 
router.get("/editProduct/:id", adminController.editProduct); 
router.post("/editproduct/:id",upload.array("image"),adminController.postEdit);

router.get("/adminUsers", verifyAdmin, adminController.users);
router.get("/blockUser/:id", verifyAdmin, adminController.blockUser);
router.get("/unBlockUser/:id", verifyAdmin, adminController.unBlock);

router.get("/orders", verifyAdmin,adminController.orders);
router.post("/editOrder/:id",verifyAdmin,adminController.editOrder)
router.get("/view_Orders/:id",verifyAdmin,adminController.viewOrder)

router.get("/adminCategory",verifyAdmin, adminController.showCategory);
router.post("/addCategory",verifyAdmin,adminController.addCategory)
router.get("/deleteCategory/:id",verifyAdmin,adminController.deleteCategory)
router.post("/editCategory/:id",verifyAdmin,adminController.editCategory)

router.get("/coupon",verifyAdmin,adminController.coupon)
router.get("/addCoupon",verifyAdmin,adminController.addCoupon)
router.post("/addCoupon",verifyAdmin,adminController.postCoupon)
router.get('/deleteCoupon/:id',verifyAdmin,adminController.deleteCoupon);
router.post("/editCoupon/:id",verifyAdmin,adminController.editCoupon)

router.get("/dashboard",verifyAdmin,adminController.dashboard)
router.get("/salesReportDay",verifyAdmin,adminController.salesReportDay)
router.get("/salesReportWeek",verifyAdmin,adminController.salesReportWeek)
router.get("/salesReportMonth",verifyAdmin,adminController.salesReportMonth)
router.get("/salesReportYear",verifyAdmin,adminController.salesReportYear)

router.get("/offer",verifyAdmin,adminController.offer)
router.post("/offerDelete/:id",verifyAdmin,adminController.offerDelete)
router.post("/editOffer/:id",verifyAdmin,adminController.editOffer)
router.post("/createOffer",verifyAdmin,adminController.createOffer)



module.exports = router;
