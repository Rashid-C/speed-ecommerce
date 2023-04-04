const category = require("../../model/category");
const order = require("../../model/order");
const products = require("../../model/products");
const userDetails = require("../../model/userModel");
const moment = require("moment");
const coupon = require("../../model/coupon");
const { default: mongoose } = require("mongoose");
const PDFDocument = require("pdfkit");
const fs = require("fs");

// ----------Admin-Login----------------------------------------------------------------------------------------
exports.loginadmin = (req, res) => {
  try {
    if (req.session.admin) {
      res.render("admin/home");
    } else {
      res.render("admin/alogin");
    }
  } catch (error) {
    console.log(error);
  }
};
// -------------------------------------------------------------------------------------------
exports.getDash = (req, res) => {
  res.render("admin/home");
};
// ----------Admin-Verification-------------------------------------------------------------------------------------

exports.adminVerification = (req, res) => {
  try {
    const admin = {
      email: "admin@gmail.com",
      password: "123",
    };

    const adminData = req.body;

    if (
      adminData.email === admin.email &&
      adminData.password === admin.password
    ) {
      req.session.admin = admin;

      res.redirect("/admin/dash");
    } else {
      res.redirect("/admin");
    }
  } catch (error) {
    console.log(error);
  }
};
// -----------------------------------------------------------------------------------------
exports.adminProduct = async (req, res) => {
  try {
    const productData = await products.find();
    res.render("admin/product", { productData });
  } catch (error) {
    console.log(error);
  }
};
// ------------------------------------------------------------------------------------------
exports.addProduct = async (req, res) => {
  try {
    const Category = await category.find();
    res.render("admin/addproduct", { Category });
  } catch (error) {
    console.log(error);
  }
};
// -----------------------------------------------------------------------------------------------------------------
exports.postProduct = async (req, res) => {
  try {
    const image = req.files.map((img) => ({
      url: img.path,
      filename: img.filename,
    }));
    const { name, brand, description, stock, category, price, size } = req.body;
    const productInsert = new products({
      id: Date.now(),
      name: name,
      brand: brand,
      description: description,
      stock: stock,
      category: category,
      price: price,
      size: size,
      image: image,
    });
    productInsert.save().then((result) => {
      if (result) {
        res.redirect("/admin/product");
      }
    });
  } catch (error) {
    console.log(error);
  }
};
// ---------------------------------------------------------------------------------------

exports.logOut = (req, res) => {
  req.session.destroy();
  res.redirect("/admin");
};
// ----------Admin-Delete-Product--------------------------------------------------------------------------------------
exports.deleteProduct = (req, res) => {
  const productId = req.params.id;
  products
    .findByIdAndUpdate({ _id: productId }, { isDeleted: true })
    .then(() => {
      res.redirect("/admin/product");
    });
};
// --------------------------------------------------------------------------------------------------
exports.restoreProduct = (req, res) => {
  const productId = req.params.id;
  products
    .findByIdAndUpdate({ _id: productId }, { isDeleted: false })
    .then(() => {
      res.redirect("/admin/product");
    });
};
// --------------------------------------------------------------------------------------------
exports.editProduct = async (req, res) => {
  const id = req.params.id;
  const Category = await category.find();
  products.findOne({ _id: id }).then((productE) => {
    res.render("admin/editProduct", { productE, Category });
  });
};
//----------------------------------------------------------------------------------------------------------
exports.postEdit = (req, res) => {
  const id = req.params.id;
  const image = req.files.map((img) => ({
    url: img.path,
    filename: img.filename,
  }));
  const { name, brand, description, stock, category, price, size } = req.body;
  products
    .findOneAndUpdate(
      { _id: id },
      {
        name: name,
        brand: brand,
        description: description,
        stock: stock,
        category: category,
        price: price,
        size: size,
        image: image,
      }
    )
    .then(() => {
      res.redirect("/admin/product");
    });
};
// -------------------------------------------------------------------------------------------------
exports.users = async (req, res) => {
  try {
    const users = await userDetails.find();
    res.render("admin/adminUsers", { users });
  } catch (error) {
    console.log(error + "admin user page loading error");
  }
};
// ---------------------------------------------------------------------------------------------------
exports.blockUser = async (req, res) => {
  try {
    const userId = req.params.id;
    await userDetails
      .findByIdAndUpdate({ _id: userId }, { $set: { isBlocked: true } })
      .then(() => {
        res.redirect("/admin/adminUsers");
      });
  } catch (error) {
    console.log(error + "block user error");
  }
};
// ---------------------------------------------------------------------------------------------------
exports.unBlock = async (req, res) => {
  try {
    const userId = req.params.id;
    await userDetails
      .findByIdAndUpdate({ _id: userId }, { $set: { isBlocked: false } })
      .then(() => {
        res.redirect("/admin/adminUsers");
      });
  } catch (error) {
    console.log(error);
  }
};
// --------------------------------------------------------------------------------
exports.orders = async (req, res) => {
  try {
    const id = req.params.id;
    const orderData = await order.find();
    res.render("admin/order", { orderData, id });
  } catch (error) {
    console.log(error + "orders error");
  }
};
// -----------order status change---------------------------------------------------------
exports.editOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const Data = req.body;
    await order
      .findByIdAndUpdate(
        { _id: orderId },
        { orderStatus: Data.orderstatus, paymentStatus: Data.paymentstatus }
      )
      .then(() => {
        res.redirect("/admin/orders");
      });
  } catch (error) {
    console.log(error + "shippingOrder issues");
  }
};
// -------------------------------------------------------------------------------------------
exports.showCategory = async (req, res) => {
  try {
    category.find().then((fullCategoryData) => {
      if (fullCategoryData) {
        res.render("admin/adminCategory", { fullCategoryData });
      } else {
        console.log("not found " + fullCategoryData + "errrrrrr");
      }
    });
  } catch (error) {
    console.log("show category error" + error);
  }
};
// -----------------------------------------------------------------------------
exports.addCategory = async (req, res) => {
  try {
    const newCategoryData = req.body.category;
    const fullCategoryData = await category.find();
    category.find({ category: newCategoryData }).then((result) => {
      if (result.length) {
        res.render("admin/adminCategory", {
          err_msg: "Category Already Existed...!",
          fullCategoryData,
        });
      } else {
        const newCategoryData = new category({
          category: req.body.category,
        });
        newCategoryData.save().then((result) => {
          res.redirect("/admin/adminCategory");
        });
      } 
    });
  } catch (error) {
    console.log(error + "add category error");
  }
};
// -------------Delete Category--------------------------
exports.deleteCategory = async (req, res) => {
  try {
    const id = req.params.id;
    await category.deleteOne({ _id: id }).then(() => {
      res.redirect("/admin/adminCategory");
    });
  } catch (error) {
    console.log(error + "delete Category error");
  }
};
// ------------------editCategory-------------------------------------------
exports.editCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const newCategoryData = req.body.category;
    const fullCategoryData = await category.find();
    const oldCategory = await category.find({ _id: id });
    category.find({ category: newCategoryData }).then((result) => {
      if (result.length) {
        res.render("admin/adminCategory", {
          err_msg: "Category Already Existed...!",
          fullCategoryData,
        });
      } else {
        category
          .findByIdAndUpdate(
            { _id: id },
            { $set: { category: newCategoryData } }
          )
          .then(() => {
            products
              .updateMany(
                { category: oldCategory[0].category },
                { $set: { category: newCategoryData } }
              )
              .then(() => {
                res.redirect("/admin/adminCategory");
              });
          });
      }
    });
  } catch (error) {
    console.log(error + "edit category issues");
  }
};
// -----------------------------------------------------------------------
exports.viewOrder = async (req, res) => {
  try {
    const id = req.params.id;
    const ObjectId = mongoose.Types.ObjectId;
   order
      .aggregate([
        {
          $match: { _id: ObjectId(id) },
        },
        {
          $unwind: "$orderItem",
        },
        {
          $lookup: {
            from: "products",
            localField: "orderItem",
            foreignField: "_id",
            as: "productDetails",
          },
        },
      ])
      .then((result) => {
        res.render("admin/viewOrders", { id, result });
      });
  } catch (error) {
    console.log(error + "issue in view order");
  }
};

// ----------------------coupon--------------------------------------------------
exports.coupon = async (req, res) => {
  try {
    const couponData = await coupon.find();
    res.render("admin/coupon", { couponData });
  } catch (error) {
    console.log(error);
  }
};

// ------------------------add coupon-------------------------------------------------
exports.addCoupon = (req, res) => {
  try {
    res.render("admin/addCoupon");
  } catch (error) {
    console.log(error);
  }
};
// ----------------------post coupon----------------------------------------------------
exports.postCoupon = async (req, res) => {
  try {
    const data = req.body;
    const dis = parseInt(data.discount);
    const discount = dis / 100;
    coupon
      .create({
        couponName: data.coupon,
        discount: discount * 100,
        expiryDate: data.expirydate,
      })
      .then(() => {
        res.redirect("/admin/coupon");
      });
  } catch (error) {
    console.log(error);
  }
};
// ---------------------deleteCoupon--------------------------------------------
exports.deleteCoupon = async (req, res) => {
  try {
    const id = req.params.id;
    coupon.deleteOne({ _id: id }).then(() => {
      res.redirect("/admin/coupon");
    });
  } catch (error) {
    console.log(error);
  }
};
// ---------------editCoupon----------------------------------------------------
exports.editCoupon = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    coupon
      .updateOne(
        { _id: id },
        {
          couponName: data.coupon,
          discount: data.discount,
          expiryDate: data.expirydate,
        }
      )
      .then(() => {
        res.redirect("/admin/coupon");
      });
  } catch (error) {
    console.log(error);
  }
};
// ---------------------DashBoard-------------------------------------------------------------------------------------------------------
exports.dashboard = async (req, res) => {
  try {
    const cod = await order.find({
      paymentMethod: "cod",
    });
    const online = await order.find({
      paymentMethod: "onlinePayment",
    });
    const totalProduct = await products.countDocuments();
    const totalUser = await userDetails.countDocuments();
    const totalOrder = await order.countDocuments();
    const orders = await order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);
    let totalRevenue = 0;
    if (orders[0]) {
      totalRevenue = orders[0].totalRevenue;
    }
    const codNumber = cod.length;
    const onlinePayment = online.length;
    const orderPending = await order.find({
      orderStatus: "Pending",
    });
    const orderShipped = await order.find({
      orderStatus: "Shipping",
    });
    const orderDelivered = await order.find({
      orderStatus: "Delivered",
    });
    const orderCancelled = await order.find({
      orderStatus: "Cancelled",
    });
    const delivery = orderDelivered.length;
    const pending = orderPending.length;
    const shipping = orderShipped.length;
    const cancel = orderCancelled.length;
    const pie = [codNumber, onlinePayment];
    const barChart = [delivery, shipping, pending, cancel];
    res.render("admin/dashboard", {
      codNumber,
      onlinePayment,
      totalProduct,
      totalUser,
      totalOrder,
      totalRevenue,
      pie,
      barChart,
    });
  } catch (error) {
    console.log(error);
  }
};
// -------------------------------Sales report Per Day--------------------------------------------------------------------
exports.salesReportDay = async (req, res) => {
  try {
    const Today = moment().format("L");
    const result = await order.aggregate([
      {
        $match: {
          orderStatus: "Delivered",
          date: Today,
        },
      },
      {
        $group: {
          _id: 0,
          totalAmount: { $sum: "$totalAmount" },
        },
      },
    ]);
    const totalAmount = result[0].totalAmount;
    const data = await order.aggregate([
      {
        $match: { date: Today, orderStatus: "Delivered" },
      },
      {
        $unwind: "$orderItem",
      },
      {
        $lookup: {
          from: "products",
          localField: "orderItem",
          foreignField: "_id",
          as: "productDetails",
        },
      },
    ]);
    const salesData = data;
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream("sales-reportPerDay.pdf"));
    doc
      .image("logo.png", 50, 45, { width: 50 })
      .fillColor("#444444")
      .fontSize(20)
      .text("SPEED CYCLES.(Day Report)", 110, 57)
      .fontSize(10)
      .text("HiLIGHT BUILDING,CALICUT", 200, 65, { align: "right" })
      .text("KERALA ,PIN 673639", 200, 80, { align: "right" })
      .moveDown();
    doc.moveDown();
    doc.font("Helvetica-Bold").fontSize(12);
    doc.text("DATE", 40, 100);
    doc.text("USER", 100, 100);
    doc.text("PRODUCT", 150, 100);
    doc.text("PRICE", 280, 100);
    doc.text("PAYMENT", 330, 100);
    doc.text("TOTAL", 400, 100);
    doc.font("Helvetica").fontSize(10);
    let y = 120;
    salesData.forEach((sale) => {
      doc.text(sale.date, 40, y);
      doc.text(sale.address.firstName, 100, y);
      let productList = "";
      let count = 1;
      sale.productDetails.forEach((item) => {
        productList += count + ". " + item.name;
        count++;
      });
      doc.text(productList, 150, y);
      doc.text(sale.totalAmount, 280, y);
      doc.text(sale.paymentMethod, 330, y);
      doc.text(totalAmount, 400, y);
      y += 20;
    });
    res.setHeader(
      "Content-disposition",
      `attachment; filename=${"sales-reportPerDay.pdf"}`
    );
    res.setHeader("Content-type", "application/pdf");
    doc.pipe(res);
    doc.end();
  } catch (error) {
    console.log(error);
  }
};
// ---------------------Sales Data Report per week--------------------------------------------------------------------
exports.salesReportWeek = async (req, res) => {
  try {
    const startOfWeek = moment().startOf("week").format("L");
    const endOfWeek = moment().endOf("week").format("L");
    const result = await order.aggregate([
      {
        $match: {
          orderStatus: "Delivered",
          date: {
            $gte: startOfWeek,
            $lte: endOfWeek,
          },
        },
      },
      {
        $group: {
          _id: 0,
          totalAmount: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalAmount = result[0].totalAmount;
    console.log(totalAmount);
    const data = await order.aggregate([
      {
        $match: {
          date: {
            $gte: startOfWeek,
            $lte: endOfWeek,
          },
          orderStatus: "Delivered",
        },
      },
      {
        $unwind: "$orderItem",
      },
      {
        $lookup: {
          from: "products",
          localField: "orderItem",
          foreignField: "_id",
          as: "productDetails",
        },
      },
    ]);
    const salesData = data;
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream("sales-reportPerWeek.pdf"));
    doc
      .image("logo.png", 50, 45, { width: 50 })
      .fillColor("#444444")
      .fontSize(20)
      .text("SPEED CYCLES.(Week Report)", 110, 57)
      .fontSize(10)
      .text("HiLIGHT BUILDING,CALICUT", 200, 65, { align: "right" })
      .text("KERALA ,PIN 673639", 200, 80, { align: "right" })
      .moveDown();
    doc.moveDown();
    doc.font("Helvetica-Bold").fontSize(12);
    doc.text("DATE", 40, 100);
    doc.text("USER", 100, 100);
    doc.text("PRODUCT", 150, 100);
    doc.text("PRICE", 280, 100);
    doc.text("PAYMENT", 330, 100);
    doc.text("TOTAL", 400, 100);
    doc.font("Helvetica").fontSize(10);
    let y = 120;
    salesData.forEach((sale) => {
      doc.text(sale.date, 40, y);
      doc.text(sale.address.firstName, 100, y);
      let productList = "";
      let count = 1;
      sale.productDetails.forEach((item) => {
        productList += count + ". " + item.name;
        count++;
      });
      doc.text(productList, 150, y);
      doc.text(sale.totalAmount, 280, y);
      doc.text(sale.paymentMethod, 330, y);
      doc.text(totalAmount, 400, y);
      y += 20;
    });
    res.setHeader(
      "Content-disposition",
      `attachment; filename=${"sales-reportPerDay.pdf"}`
    );
    res.setHeader("Content-type", "application/pdf");
    doc.pipe(res);
    doc.end();
  } catch (error) {
    console.log(error);
  }
};
// ---------------salesReportMonth--------------------------------
exports.salesReportMonth = async (req, res) => {
  const PDFDocument = require("pdfkit");
  const fs = require("fs");
  const moment = require("moment");
  try {
    const startOfMonth = moment().startOf("month").format("L");
    const endOfMonth = moment().endOf("month").format("L");
    const result = await order.aggregate([
      {
        $match: {
          orderStatus: "Delivered",
          date: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
        },
      },
      {
        $group: {
          _id: 0,
          totalAmount: { $sum: "$totalAmount" },
        },
      },
    ]);
    const totalAmount = result[0].totalAmount;
    const data = await order.aggregate([
      {
        $match: {
          date: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
          orderStatus: "Delivered",
        },
      },
      {
        $unwind: "$orderItem",
      },
      {
        $lookup: {
          from: "products",
          localField: "orderItem",
          foreignField: "_id",
          as: "productDetails",
        },
      },
    ]);
    const salesData = data;
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream("sales-reportPerMonth.pdf"));
    doc
      .image("logo.png", 50, 45, { width: 50 })
      .fillColor("#444444")
      .fontSize(20)
      .text("SPEED CYCLES.(Month Report)", 110, 57)
      .fontSize(10)
      .text("HiLIGHT BUILDING,CALICUT", 200, 65, { align: "right" })
      .text("KERALA ,PIN 673639", 200, 80, { align: "right" })
      .moveDown();
    doc.moveDown();
    doc.font("Helvetica-Bold").fontSize(12);
    doc.text("DATE", 40, 100);
    doc.text("USER", 100, 100);
    doc.text("PRODUCT", 150, 100);
    doc.text("PRICE", 280, 100);
    doc.text("PAYMENT", 330, 100);
    doc.text("TOTAL", 400, 100);
    doc.font("Helvetica").fontSize(10);
    let y = 120;
    salesData.forEach((sale) => {
      doc.text(sale.date, 40, y);
      doc.text(sale.address.firstName, 100, y);
      let productList = "";
      let count = 1;
      sale.productDetails.forEach((item) => {
        productList += count + ". " + item.name;
        count++;
      });
      doc.text(productList, 150, y);
      doc.text(sale.totalAmount, 280, y);
      doc.text(sale.paymentMethod, 330, y);
      doc.text(totalAmount, 400, y);
      y += 20;
    });
    res.setHeader(
      "Content-disposition",
      `attachment; filename=${"sales-reportPerDay.pdf"}`
    );
    res.setHeader("Content-type", "application/pdf");
    doc.pipe(res);
    doc.end();
  } catch (error) {
    console.log(error);
  }
};
// ---------------------salesReportYear-------------------
exports.salesReportYear = async (req, res) => {
  try {
    const startOfYear = moment().startOf("year").format("L");
    const endOfYear = moment().endOf("year").format("L");
    const result = await order.aggregate([
      {
        $match: {
          orderStatus: "Delivered",
          date: {
            $gte: startOfYear,
            $lte: endOfYear,
          },
        },
      },
      {
        $group: {
          _id: 0,
          totalAmount: { $sum: "$totalAmount" },
        },
      },
    ]);
    const totalAmount = result[0].totalAmount;
    const data = await order.aggregate([
      {
        $match: {
          date: {
            $gte: startOfYear,
            $lte: endOfYear,
          },
          orderStatus: "Delivered",
        },
      },
      {
        $unwind: "$orderItem",
      },
      {
        $lookup: {
          from: "products",
          localField: "orderItem",
          foreignField: "_id",
          as: "productDetails",
        },
      },
    ]);
    const salesData = data;
    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream("sales-reportPerYear.pdf"));
    doc
      .image("logo.png", 50, 45, { width: 50 })
      .fillColor("#444444")
      .fontSize(20)
      .text("SPEED CYCLES.(Yearly Report)", 110, 57)
      .fontSize(10)
      .text("HiLIGHT BUILDING,CALICUT", 200, 65, { align: "right" })
      .text("KERALA ,PIN 673639", 200, 80, { align: "right" })
      .moveDown();
    doc.moveDown();
    doc.font("Helvetica-Bold").fontSize(12);
    doc.text("MONTH", 40, 100);
    doc.text("USER", 100, 100);
    doc.text("PRODUCT", 150, 100);
    doc.text("PRICE", 280, 100);
    doc.text("PAYMENT", 330, 100);
    doc.text("TOTAL", 400, 100);
    doc.font("Helvetica").fontSize(10);
    let y = 120;
    salesData.forEach((sale) => {
      let month = moment(sale.date).format("MMMM");
      doc.text(month, 40, y);
      doc.text(sale.address.firstName, 100, y);
      let productList = "";
      let count = 1;
      sale.productDetails.forEach((item) => {
        productList += count + ". " + item.name;
        count++;
      });
      doc.text(productList, 150, y);
      doc.text(sale.totalAmount, 280, y);
      doc.text(sale.paymentMethod, 330, y);
      doc.text(totalAmount, 400, y);
      y += 20;
    });
    res.setHeader(
      "Content-disposition",
      `attachment; filename=${"sales-reportPerDay.pdf"}`
    );
    res.setHeader("Content-type", "application/pdf");
    doc.pipe(res);
    doc.end();
  } catch (error) {
    console.log(error);
  }
};
