const adminDetails = require("../../model/adminModel");
const category = require("../../model/category");
const order = require("../../model/order");
const products = require("../../model/products");
const userDetails = require("../../model/userModel");
const moment = require("moment");
let coupon = require("../../model/coupon");
const { count } = require("../../model/adminModel");
const { default: mongoose, ObjectId } = require("mongoose");
const { countDocuments } = require("../../model/userModel");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const offer = require("../../model/offer");

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

    let { name, brand, description, stock, category, price, size } = req.body;

    let productInsert = new products({
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
    .then((productData) => {
      res.redirect("/admin/product");
    });
};
// --------------------------------------------------------------------------------------------------
exports.restoreProduct = (req, res) => {
  const productId = req.params.id;

  products
    .findByIdAndUpdate({ _id: productId }, { isDeleted: false })
    .then((productData) => {
      res.redirect("/admin/product");
    });
};
// --------------------------------------------------------------------------------------------
exports.editProduct = async (req, res) => {
  const id = req.params.id;
  const Category = await category.find();
  products.findOne({ _id: id }).then((productE) => {
    res.render("admin/editProduct", { productE, Category });
    // console.log(productE);
  });
};
//----------------------------------------------------------------------------------------------------------
exports.postEdit = (req, res) => {
  const id = req.params.id;
  const image = req.files.map((img) => ({
    url: img.path,
    filename: img.filename,
  }));

  let { name, brand, description, stock, category, price, size } = req.body;
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
    .then((productE) => {
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
    let orderData = await order.find();

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
    let fullCategoryData = await category.find();
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
    const Data = req.body;

    let newCategoryData = req.body.category;
    let fullCategoryData = await category.find();
    let oldCategory = await category.find({ _id: id });

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
    // order.{_id:'c63ff10b28a0cc99def2e5a2f'}
    const id = req.params.id;
    // console.log(id);
    const orderdata = await order.findOne({ _id: id });
    // console.log(orderdata._id);
    const ObjectId = mongoose.Types.ObjectId;
    let data = await order
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
        // console.log(result[0].productDetails);
        // console.log(result);

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
    // const max = parseInt(data.maxlimit);
    const discount = dis / 100;
    coupon
      .create({
        couponName: data.coupon,
        discount: discount,
        // maxLimit: max,
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
    let id = req.params.id;

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

    let totalProduct = await products.countDocuments();

    let totalUser = await userDetails.countDocuments();

    let totalOrder = await order.countDocuments();

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

    let codNumber = cod.length;
    let onlinePayment = online.length;

    let orderPending = await order.find({
      orderStatus: "Pending",
    });
    let orderShipped = await order.find({
      orderStatus: "Shipping",
    });
    let orderDelivered = await order.find({
      orderStatus: "Delivered",
    });
    let orderCancelled = await order.find({
      orderStatus: "Cancelled",
    });
    let delivery = orderDelivered.length;
    console.log(delivery + "Delivered");
    let pending = orderPending.length;
    console.log(pending + "Pending");
    let shipping = orderShipped.length;
    console.log(shipping + "Shipping");
    let cancel = orderCancelled.length;
    console.log(cancel + "Cancelled");

    let pie = [codNumber, onlinePayment];
    let barChart = [delivery, shipping, pending, cancel];

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
    let Today = moment().format("L");

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

    let totalAmount = result[0].totalAmount;

    let data = await order.aggregate([
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

    console.log("matched data");
    console.log(data[0].productDetails[0].name);

    const salesData = data;

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream("sales-reportPerDay.pdf"));

    // Add the logo and company information
    doc
      .image("logo.png", 50, 45, { width: 50 })
      .fillColor("#444444")
      .fontSize(20)
      .text("SPEED CYCLES.(Day Report)", 110, 57)
      .fontSize(10)
      .text("HiLIGHT BUILDING,CALICUT", 200, 65, { align: "right" })
      .text("KERALA ,PIN 673639", 200, 80, { align: "right" })
      .moveDown();

    // Add the table header
    doc.moveDown();
    doc.font("Helvetica-Bold").fontSize(12);
    doc.text("DATE", 40, 100);
    doc.text("USER", 100, 100);
    doc.text("PRODUCT", 150, 100);
    doc.text("PRICE", 280, 100);
    doc.text("PAYMENT", 330, 100);
    doc.text("TOTAL", 400, 100);

    // Add the table rows
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

    // Pipe the generated PDF to the response object
    doc.pipe(res);

    doc.end();
  } catch (error) {
    console.log(error);
  }
};
// ---------------------Sales Data Report per week--------------------------------------------------------------------
exports.salesReportWeek = async (req, res) => {
  try {
    let startOfWeek = moment().startOf("week").format("L");
    console.log(startOfWeek + "start>>>>>>>>>>>>>>>>>>>>>>>");
    let endOfWeek = moment().endOf("week").format("L");
    console.log(endOfWeek + "end>>>>>>>>>>>>>>>>>>>>>>>");

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

    let totalAmount = result[0].totalAmount;
    console.log(totalAmount);

    let data = await order.aggregate([
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

    console.log("matched data");
    console.log(data[0].productDetails[0].name);

    const salesData = data;

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream("sales-reportPerWeek.pdf"));

    // Add the logo and company information
    doc
      .image("logo.png", 50, 45, { width: 50 })
      .fillColor("#444444")
      .fontSize(20)
      .text("SPEED CYCLES.(Week Report)", 110, 57)
      .fontSize(10)
      .text("HiLIGHT BUILDING,CALICUT", 200, 65, { align: "right" })
      .text("KERALA ,PIN 673639", 200, 80, { align: "right" })
      .moveDown();

    // Add the table header
    doc.moveDown();
    doc.font("Helvetica-Bold").fontSize(12);
    doc.text("DATE", 40, 100);
    doc.text("USER", 100, 100);
    doc.text("PRODUCT", 150, 100);
    doc.text("PRICE", 280, 100);
    doc.text("PAYMENT", 330, 100);
    doc.text("TOTAL", 400, 100);

    // Add the table rows
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

    // Pipe the generated PDF to the response object
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
    let startOfMonth = moment().startOf("month").format("L");
    console.log(startOfMonth + "start>>>>>>>>>>>>>>>>>");
    let endOfMonth = moment().endOf("month").format("L");
    console.log(endOfMonth + "end>>>>>>>>>>>>>>>>>>>>");

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

    let totalAmount = result[0].totalAmount;
    console.log(totalAmount);

    let data = await order.aggregate([
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

    console.log("matched data");
    console.log(data[0].productDetails[0].name);

    const salesData = data;

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream("sales-reportPerMonth.pdf"));

    // Add the logo and company information
    doc
      .image("logo.png", 50, 45, { width: 50 })
      .fillColor("#444444")
      .fontSize(20)
      .text("SPEED CYCLES.(Month Report)", 110, 57)
      .fontSize(10)
      .text("HiLIGHT BUILDING,CALICUT", 200, 65, { align: "right" })
      .text("KERALA ,PIN 673639", 200, 80, { align: "right" })
      .moveDown();

    // Add the table header
    doc.moveDown();
    doc.font("Helvetica-Bold").fontSize(12);
    doc.text("DATE", 40, 100);
    doc.text("USER", 100, 100);
    doc.text("PRODUCT", 150, 100);
    doc.text("PRICE", 280, 100);
    doc.text("PAYMENT", 330, 100);
    doc.text("TOTAL", 400, 100);

    // Add the table rows
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

    // Pipe the generated PDF to the response object
    doc.pipe(res);

    doc.end();
  } catch (error) {
    console.log(error);
  }
};
// ---------------------salesReportYear-------------------
exports.salesReportYear = async (req, res) => {
  try {
    let startOfYear = moment().startOf("year").format("L");
    console.log(startOfYear + "start y");
    let endOfYear = moment().endOf("year").format("L");
    console.log(endOfYear + "end y");

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

    let totalAmount = result[0].totalAmount;

    let data = await order.aggregate([
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

    console.log("matched data");
    console.log(data[0].productDetails[0].name);

    const salesData = data;

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream("sales-reportPerYear.pdf"));

    // Add the logo and company information
    doc
      .image("logo.png", 50, 45, { width: 50 })
      .fillColor("#444444")
      .fontSize(20)
      .text("SPEED CYCLES.(Yearly Report)", 110, 57)
      .fontSize(10)
      .text("HiLIGHT BUILDING,CALICUT", 200, 65, { align: "right" })
      .text("KERALA ,PIN 673639", 200, 80, { align: "right" })
      .moveDown();

    // Add the table header
    doc.moveDown();
    doc.font("Helvetica-Bold").fontSize(12);
    doc.text("MONTH", 40, 100);
    doc.text("USER", 100, 100);
    doc.text("PRODUCT", 150, 100);
    doc.text("PRICE", 280, 100);
    doc.text("PAYMENT", 330, 100);
    doc.text("TOTAL", 400, 100);

    // Add the table rows
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

    // Pipe the generated PDF to the response object
    doc.pipe(res);

    doc.end();
  } catch (error) {
    console.log(error);
  }
};
// ---------------------get all -offer-----------------------------------------------------------------------
exports.offer = async (req, res) => {
  try {
    const offers = await offer.find();
    // res.json(offers);
    res.render("admin/offer", { offers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// -------------------offer---Delete-----------------------------------------------------
exports.offerDelete = async (req, res) => {
  try {
    let id = req.params.id;
    offer.deleteOne({ _id: id }).then(() => {
      res.redirect("/admin/offer");
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// -------------------editoffer---------------------------------------
exports.editOffer = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    offer
      .updateOne(
        { _id: id },
        {
          name: data.offer,
          description: data.Description,
          discount: data.Discount,
          startDate: data.startDate,
          endDate: data.endDate,
        }
      )
      .then(() => {
        res.redirect("/admin/offer");
      });
  } catch (error) {
    console.log(error);
  }
};
// ----------createOffer-------------------------------------------------------
exports.createOffer = async (req, res) => {
  try {
    const offerData = new offer({
      name: req.body.name,
      description: req.body.description,
      discount: req.body.discount,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
    });

    const newOffer = await offerData.save();
    res.redirect("/admin/offer");
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
// -------------------------------------------------------------
