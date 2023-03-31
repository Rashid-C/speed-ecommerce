const userDetails = require("../../model/userModel");
const bcryptjs = require("bcryptjs");
const products = require("../../model/products");
const carts = require("../../model/cart");
const { default: mongoose } = require("mongoose");
const { mailTransporter, OTP } = require("../../middleware/nodemailer");
const otp = require("../../model/nodemailer");
const wishList = require("../../model/wishList");
const userdetails = require("../../model/userModel");
const order = require("../../model/order");
const user = true;
const category = require("../../model/category");
const moment = require("moment");
const paypal = require("paypal-rest-sdk");
const coupon = require("../../model/coupon");
require("dotenv").config();

paypal.configure({
  mode: "sandbox", //sandbox or live
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});
// -------------------------------------------------------------------------------
const securePassword = async (password) => {
  try {
    const passwordhash = await bcryptjs.hash(password, 10);
    return passwordhash;
  } catch (error) {
    console.log(error);
    res.render("user/error404");
  }
};
// --------------------------------------------------------------------------
exports.login_page = async (req, res) => {
  try {
    if (req.session.user) {
      res.redirect("/");
    } else {
      res.render("user/login");
    }
  } catch (error) {
    console.log(error);
    res.render("user/error404");
  }
};
// ---------------------------------------------------------------------------------------------

exports.signup_page = (req, res) => {
  try {
    res.render("user/signup");
  } catch (error) {
    console.log(error);
    res.render("user/error404");
  }
};
// -----------------------------------------------------------------------------------------------
exports.userPost = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const mailDetails = {
      from: "jsoanu@gmail.com",
      to: email,
      subject: "SPEED_CYCLE_SHOP",
      html: `<p>YOUR OTP FOR REGISTERING IN SPEED_CYCLE_SHOP IS <h1> ${OTP} <h1> </p>`,
    };
    userDetails.findOne({ email: email }).then((user) => {
      if (user) {
        res.render("user/signup", { err_msg: "userdetails already exits...!" });
      } else {
        mailTransporter.sendMail(mailDetails, (err, data) => {
          if (err) {
            console.error();
            res.render("user/error404");
          } else {
            const newOtp = new otp({
              otp: OTP,
            });
            console.log(OTP);
            newOtp.save();
            res.render("user/otpSignup.ejs", { name, email, password });
          }
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.render("user/error404");
  }
};
// -----------------------------------------------------------------------------------------------------------------
exports.otpSignUp = async (req, res) => {
  const { name, email, password } = req.body;
  const userOtp = req.body.otp;
  const otpDetails = await otp.findOne({ otp: userOtp });
  if (otpDetails) {
    const userPassword = await securePassword(password);
    const userInsert = new userDetails({
      username: name,
      email: email,
      password: userPassword,
    });
    await userInsert.save();
    req.session.user = email;
    res.redirect("/login");
  } else {
    res.render("user/otpSignUp", {
      name,
      email,
      password,
      err_msg: "invalid OTP...!",
    });
  }
};
// -------------------------------------------------------------------------------------------------------------
exports.user_verification = async (req, res) => {
  try {
    const { Email, password } = req.body;
    const userData = await userDetails.findOne({ email: Email });
    if (userData) {
      if (userData.isBlocked) {
        res.render("user/login", {
          err_msg: "You were Blocked by admin ...!",
        });
      } else {
        bcryptjs.compare(password, userData.password).then((result) => {
          if (result) {
            req.session.user = Email;
            res.redirect("/");
          } else {
            res.render("user/login", {
              err_msg: "invalid user...!",
            });
          }
        });
      }
    } else {
      res.render("user/login", {
        err_msg: "invalid user...!",
      });
    }
  } catch (error) {
    console.log(error);
    res.render("user/error404");
  }
};
//--------------Get home----------------------------------------------------------------------------------------------------
exports.get_home = async (req, res) => {
  let cartCount;
  const user = req.session.user;
  const userData = await userDetails.findOne({ email: user });
  if (userData) {
    const cart = await carts.findOne({ userId: userData.id });
    if (cart) {
      cartCount = cart.product.length;
    }
  }
  products
    .find()
    .limit(6)
    .then((productData) => {
      res.render("user/index", { productData, user, cartCount });
    });
};
// --------------------Shop page-------------------------------------------------------------------------------------------------
exports.getshop = async (req, res) => {
  let cartCount;
  const user = req.session.user;
  const userData = await userDetails.findOne({ email: user });
  if (userData) {
    const cart = await carts.findOne({ userId: userData.id });
    if (cart) {
      cartCount = cart.product.length;
    }
  }
  const filterCategory = await category.find();
  products.find().then((productData) => {
    res.render("user/shop", { productData, user, cartCount, filterCategory });
  });
};
// --------------User Logout-------------------------------------------------------------------------------------------------------
exports.logOut = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};
// -------Show Add To Cart----------------------------------------------------------------------------------------------------------------

exports.getCart = async (req, res) => {
  let cartCount;
  const email = req.session.user;
  const user = await userDetails.findOne({ email: email });
  if (user) {
    const cart = await carts.findOne({ userId: user.id });
    if (cart) {
      cartCount = cart.product.length;
    }
  }
  const product = await carts.aggregate([
    {
      $match: { userId: user.id },
    },
    {
      $unwind: "$product",
    },
    {
      $project: {
        productItem: "$product.productId",
        quantity: "$product.quantity",
      },
    },
    {
      $lookup: {
        from: "products",
        localField: "productItem",
        foreignField: "_id",
        as: "productDetails",
      },
    },
    {
      $project: {
        productItem: 1,
        quantity: 1,
        productDetails: { $arrayElemAt: ["$productDetails", 0] },
      },
    },
    {
      $addFields: {
        productPrice: {
          $sum: {
            $multiply: ["$quantity", "$productDetails.price"],
          },
        },
      },
    },
  ]);
  let sum = product.reduce((accumulator, object) => {
    return accumulator + object.productPrice;
  }, 0);
  res.render("user/addToCart", {
    product,
    user: req.session.user,
    cartCount,
    sum,
  });
};
// --------Adding Add To Cart(working)----------------------------------------------------------------------------------------------------------------------------------------------------------
exports.addTocartUser = async (req, res) => {
  try {
    const id = req.session.user;
    const proId = req.params.id;
    const productId = mongoose.Types.ObjectId(proId);
    const proObj = {
      productId,
    };
    const user = await userDetails.findOne({ email: id });
    if (user) {
      const cart = await carts.findOne({ userId: user.id });
      if (cart) {
        const productEx = cart.product.findIndex(
          (product) => product.productId == proId
        );
        if (productEx != -1) {
          await carts.aggregate([
            {
              $unwind: "$product",
            },
          ]);

          await carts.updateOne(
            { userId: user.id, "product.productId": productId },
            { $inc: { "product.$.quantity": 1 } }
          );
          res.redirect("/getCart");
        } else {
          await carts.updateOne(
            { userId: user.id },
            { $push: { product: { productId } } }
          );
        }
        res.redirect("/getCart");
      } else {
        const newcart = new carts({
          userId: user.id,
          product: [
            {
              productId: productId,
              quantity: 1,
            },
          ],
        });
        newcart.save();
        res.redirect("/getCart");
      }
    } else {
      console.log("no user exist");
    }
  } catch (error) {
    console.log(error);
  }
};
// ----------------------remove cart items--------------------------------------------------------------------------------------------------------
exports.removeCartUser = async (req, res) => {
  try {
    const email = req.session.user;
    const userdata = await userDetails.findOne({ email: email });
    const data = req.params.id;
    await carts
      .updateOne(
        { userId: userdata.id },
        { $pull: { product: { productId: data } } }
      )
      .then((response) => {
        res.redirect("/getCart");
      });
  } catch (error) {
    console.log("removeCartUser" + error);
    res.render("user/error404");
  }
};
// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
exports.productView = async (req, res) => {
  try {
    let cartCount;
    const id = req.params.id;
    const user = req.session.user;
    const userData = await userDetails.findOne({ email: user });
    if (userData) {
      const cart = await carts.findOne({ userId: userData.id });
      if (cart) {
        cartCount = cart.product.length;
      }
    }
    const product = await products.findOne({ _id: id });
    res.render("user/product", { product, user, cartCount });
  } catch (error) {
    console.log("productView page Error" + error);
    res.render("user/error404");
  }
};
// --------------------------------------------------------------------------------------------------------------------------------
exports.getWishList = async (req, res) => {
  try {
    let cartCount;
    const user = req.session.user;
    const userData = await userDetails.findOne({ email: user });
    if (userData) {
      const cart = await carts.findOne({ userId: userData.id });
      if (cart) {
        cartCount = cart.product.length;
      }
    }
    const productData = await wishList.aggregate([
      {
        $match: { userId: userData.id },
      },
      {
        $unwind: "$product",
      },
      {
        $project: {
          productItem: "$product.productId",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "productItem",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $project: {
          productItem: 1,
          productDetails: { $arrayElemAt: ["$productDetails", 0] },
        },
      },
    ]);
    res.render("user/wishList", { productData, user, cartCount });
  } catch (error) {
    console.log("wishList error " + error);
    res.render("user/error404");
  }
};
//------------------------------------------------------------------------------------------------------------------------------------
exports.postWishList = async (req, res) => {
  try {
    const id = req.session.user;
    const proId = req.params.id;
    const productId = mongoose.Types.ObjectId(proId);
    const proObj = {
      productId,
    };
    const user = await userDetails.findOne({ email: id });
    if (user) {
      const wishL = await wishList.findOne({ userId: user.id });
      if (wishL) {
        const wishExi = wishL.product.findIndex(
          (product) => product.productId == proId
        );
        if (wishExi != -1) {
          await wishList.aggregate([
            {
              $unwind: "$product",
            },
          ]);
          await wishList.updateOne(
            { userId: user.id, "product.productId": productId },
            { $inc: { "product.$.quantity": 1 } }
          );
          res.redirect("/wishList");
        } else {
          await wishList.updateOne(
            { userId: user.id },
            { $push: { product: { productId } } }
          );
        }
        res.redirect("/wishList");
      } else {
        const newWishList = new wishList({
          userId: user.id,
          product: [
            {
              productId: productId,
            },
          ],
        });
        newWishList.save();
        res.redirect("/wishList");
      }
    } else {
      console.log("no wishlist exist");
      res.render("user/error404");
    }
  } catch (error) {
    console.log("post wishlist error" + error);
    res.render("user/error404");
  }
};
//---------------------------------------------------------------------------------------------
exports.getUser = async (req, res) => {
  try {
    let cartCount;
    const email = req.session.user;
    const user = await userDetails.findOne({ email: email });
    if (user) {
      const cart = await carts.findOne({ userId: user.id });
      if (cart) {
        cartCount = cart.product.length;
      }
    }
    res.render("user/userProfile", { user, cartCount });
  } catch (error) {
    console.log("get user page error" + error);
    res.render("user/error404");
  }
};
// -----------------------profileImage------------------------------
exports.profileImage = async (req, res) => {
  try {
    const profileImage = req.file.path;
    const email = req.session.user;
    userdetails
      .updateOne({ email: email }, { $set: { profileImage: profileImage } })
      .then((data) => {
        console.log(data);
        res.redirect("/userProfile");
      });
  } catch (error) {
    console.log(error);
  }
};
// ------------------------------------------------------------------------------------------------------
exports.addAddress = async (req, res) => {
  try {
    let cartCount;
    const user = await req.session.user;
    const userData = await userDetails.findOne({ email: user });
    if (userData) {
      const cart = await carts.findOne({ userId: userData.id });
      if (cart) {
        cartCount = cart.product.length;
      }
    }
    res.render("user/userAddress", { userData, user, cartCount });
  } catch (error) {
    console.log(error + "addAddress page is not working");
    res.render("user/error404");
  }
};
// -----------------------------------------------------------------------------------
exports.postAddress = async (req, res) => {
  try {
    const email = req.session.user;
    const {
      firstName,
      lastname,
      house,
      street,
      city,
      district,
      state,
      pin,
      phone,
    } = req.body;

    await userDetails
      .updateOne(
        { email: email },
        {
          $set: {
            primaryAddress: {
              firstName: firstName,
              lastName: lastname,
              house: house,
              street: street,
              city: city,
              district: district,
              state: state,
              pin: pin,
              mobile: phone,
            },
          },
        }
      )
      .then((user) => {
        res.redirect("/userProfile");
      });
  } catch (error) {
    console.log(error + "post user address adding error");
    res.render("user/error404");
  }
};
// ---------------------------------------------------------------------------------------------------------------

exports.removeWishList = async (req, res) => {
  try {
    const email = req.session.user;
    const userdata = await userDetails.findOne({ email: email });
    const data = req.params.id;
    await wishList
      .updateOne(
        { userId: userdata.id },
        { $pull: { product: { productId: data } } }
      )
      .then((response) => {
        res.redirect("/wishList");
      });
  } catch (error) {
    console.log("remove wishlist" + error);
    res.render("user/error404");
  }
};
// ---------------user quantity inc/dec--------------------------------------------------
exports.addQuantity = async (req, res) => {
  try {
    const data = await req.body;
    const user = req.session.user;
    const objId = mongoose.Types.ObjectId(data.product);
    await carts.aggregate([
      {
        $unwind: "$product",
      },
    ]);
    await carts
      .updateOne(
        { _id: data.cart, "product.productId": objId },
        { $inc: { "product.$.quantity": data.count } }
      )
      .then(() => {
        res.json({ status: true });
      });
  } catch (error) {
    console.log(error + "addQuantity error");
    res.render("user/error404");
  }
};
// --------------------User checkout------------------------
exports.checkOut = async (req, res) => {
  try {
    let cartCount;
    const email = req.session.user;
    const userData = await userDetails.findOne({ email: email });
    if (userData) {
      const cart = await carts.findOne({ userId: userData.id });
      if (cart) {
        cartCount = cart.product.length;
      }
    }
    const product = await carts
      .aggregate([
        {
          $match: { userId: userData.id },
        },
        {
          $unwind: "$product",
        },
        {
          $project: {
            productItem: "$product.productId",
            quantity: "$product.quantity",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "productItem",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        {
          $project: {
            productItem: 1,
            quantity: 1,
            productDetails: { $arrayElemAt: ["$productDetails", 0] },
          },
        },
        {
          $addFields: {
            productPrice: {
              $sum: {
                $multiply: ["$quantity", "$productDetails.price"],
              },
            },
          },
        },
      ])
      .exec();
    let sum = product.reduce((accumulator, object) => {
      return accumulator + object.productPrice;
    }, 0);
    if (product.length) {
      res.render("user/checkOut", {
        user,
        cartCount,
        product,
        userData,
        sum,
      });
    } else {
      res.redirect("/getCart");
    }
  } catch (error) {
    console.log(error + "Check out page error");
    res.render("user/error404");
  }
};
// -----validateChechout---------------------------------------------
exports.validateChechout = async (req, res) => {
  const user = req.session.user;
  const data = req.body;
  let cartCount;
  const userData = await userdetails.findOne({ email: user });
  if (user) {
    const cart = await carts.findOne({ userId: userData.id });
    if (cart) {
      cartCount = cart.product.length;
    }
  }
  let addressObj = {};
  if (data.profileAddress) {
    addressObj = {
      firstName: userData.primaryAddress.firstName,
      lastname: userData.primaryAddress.lastName,
      house: userData.primaryAddress.house,
      street: userData.primaryAddress.street,
      city: userData.primaryAddress.city,
      district: userData.primaryAddress.district,
      state: userData.primaryAddress.state,
      pin: userData.primaryAddress.pin,
      mobile: userData.primaryAddress.mobile,
    };
  } else {
    addressObj = {
      firstName: data.firstName,
      lastname: data.lastname,
      house: data.house,
      street: data.street,
      city: data.city,
      district: data.district,
      state: data.state,
      pin: data.pin,
      mobile: data.mobile,
    };
  }
  let paymentdata = data.payment;
  if (addressObj.firstName && paymentdata) {
    let orderdetails = new order({
      userId: userData.id,
      address: addressObj,
      orderItem: data.ids,
      totalAmount: data.sum,
      paymentMethod: paymentdata,
      orderStatus: "Pending",
      paymentStatus: "Not Paid",
      date: moment().format("L"),
    });
    orderdetails.save().then((result) => {
      if (result) {
        carts.deleteOne({ userId: userData.id }).then((result) => {});
      }
    });
    if (paymentdata === "cod") {
      res.render("user/cod", { user, cartCount, userData });
    } else if (paymentdata === "onlinePayment") {
      const create_payment_json = {
        intent: "sale",
        payer: {
          payment_method: "paypal",
        },
        redirect_urls: {
          return_url: "https://speedcycles.online/success",
          cancel_url: "https://speedcycles.online/cancel",
        },
        transactions: [
          {
            item_list: {
              items: [
                {
                  name: "Red Sox Hat",
                  sku: "001",
                  price: "25.00",
                  currency: "USD",
                  quantity: 1,
                },
              ],
            },
            amount: {
              currency: "USD",
              total: "25.00",
            },
            description: "Hat for the best team ever",
          },
        ],
      };
      paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
          throw error;
        } else {
          for (let i = 0; i < payment.links.length; i++) {
            if (payment.links[i].rel === "approval_url") {
              res.redirect(payment.links[i].href);
            }
          }
        }
      });
    }
  } else {
    const product = await carts
      .aggregate([
        {
          $match: { userId: userData.id },
        },
        {
          $unwind: "$product",
        },
        {
          $project: {
            productItem: "$product.productId",
            quantity: "$product.quantity",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "productItem",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        {
          $project: {
            productItem: 1,
            quantity: 1,
            productDetails: { $arrayElemAt: ["$productDetails", 0] },
          },
        },
        {
          $addFields: {
            productPrice: {
              $sum: {
                $multiply: ["$quantity", "$productDetails.price"],
              },
            },
          },
        },
      ])
      .exec();
    let sum = product.reduce((accumulator, object) => {
      return accumulator + object.productPrice;
    }, 0);
    res.render("user/checkOut", {
      user,
      cartCount,
      product,
      userData,
      sum,
      err_msg: "fill the credentials...!",
    });
  }
};
// ---------------------payment----success------------------------
exports.success = async (req, res) => {
  const user = req.session.user;
  let cartCount;
  const userData = await userdetails.findOne({ email: user });
  if (userData) {
    order
      .updateOne(
        {
          userId: userData.id,
        },
        { $set: { paymentStatus: "Paid", orderStatus: "Shipping" } }
      )
      .then((data) => {});
  }
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;
  const execute_payment_json = {
    payer_id: payerId,
    transactions: [
      {
        amount: {
          currency: "USD",
          total: "25.00",
        },
      },
    ],
  };
  paypal.payment.execute(paymentId, execute_payment_json, function (
    error,
    payment
  ) {
    if (error) {
      console.log(error.response);
      throw error;
    } else {
      console.log(JSON.stringify(payment));
      res.render("user/cod", { user, cartCount, userData });
    }
  });
};
// ------------payment fail-------------------------
exports.cancel = async (req, res) => {
  try {
    const user = req.session.user;
    const userData = await userdetails.findOne({ email: user });
    if (userData) {
      order
        .updateOne(
          { userId: userData.id },
          { $set: { orderStatus: "Cancelled", paymentStatus: "Not Paid" } }
        )
        .then((data) => {});
    }
    res.render("user/paymentFail", { user, userData });
  } catch (error) {
    console.log(error);
    res.render("user/error404");
  }
};
// ------------------reset password------------------------
exports.resetPassword = (req, res) => {
  try {
    res.render("user/resetPassword");
  } catch (error) {
    console.log(error);
    res.render("user/error404");
  }
};
// ----------post reset password---------------------------
exports.postResetPassword = async (req, res) => {
  try {
    const user = req.session.user;
    const data = req.body;
    const userData = await userDetails.findOne({ email: user });
    bcryptjs.compare(data.currentPassword, userData.password).then((result) => {
      if (result) {
        if (data.newPassword && data.conformNewPassword) {
          if (data.newPassword === data.conformNewPassword) {
            bcryptjs.hash(data.newPassword, 10).then((newPassword) => {
              userDetails
                .findByIdAndUpdate(
                  { _id: userData.id },
                  {
                    password: newPassword,
                  }
                )
                .then(() => {
                  res.redirect("/login");
                });
            });
          } else {
            res.render("user/resetPassword", {
              data,
              err_msg: "Conform Password Should Be Same...!",
            });
          }
        } else {
          res.render("user/resetPassword", {
            data,
            err_msg: "You Must Enter Password...!",
          });
        }
      } else {
        res.render("user/resetPassword", {
          data,
          err_msg: "Current Password Not Matching...!",
        });
      }
    });
  } catch (error) {
    res.render("user/error404");
    console.log(error);
    res.render("user/error404");
  }
};
// -----error404----error404-------------------------------------------------------------
exports.error404 = (req, res) => {
  try {
    res.render("user/error404");
  } catch (error) {
    console.log(error);
    res.render("user/error404");
  }
};
// -------------forgotPassword-----------------------------------------------------------------------------
exports.forgotPassword = async (req, res) => {
  try {
    res.render("user/forgotPassword");
  } catch (error) {
    console.log(error);
    res.render("user/error404");
  }
};
// ---------------forgotOtp-----------------------------------
exports.forgotOtp = async (req, res) => {
  try {
    const email = req.body.email;
    const userdata = await userDetails.findOne({ email: email });
    if (userdata) {
      let mailDetails = {
        from: "gkyddu04@gmail.com",
        to: email,
        subject: "SPEED_CYCLE_SHOP",
        html: `<p>YOUR OTP FOR RESET PASSWORD IN SPEED_CYCLES_SHOP IS <h1> ${OTP} <h1> </p>`,
      };
      mailTransporter.sendMail(mailDetails, (err, data) => {
        if (err) {
          console.error();
        } else {
          const newOtp = new otp({
            otp: OTP,
          });
          console.log(OTP);
          newOtp.save();
          res.render("user/forgotOtp", { email });
        }
      });
    } else {
      res.render("user/forgotPassword", { err_msg: "Email noty valid" });
    }
  } catch (error) {
    console.log(error);
    res.render("user/error404");
  }
};
// ----------------resetOtp---------------------------------
exports.resetOtp = async (req, res) => {
  try {
    const data = req.body.otp;
    const email = req.body.email;
    const otpDetails = await otp.findOne({ otp: data });
    if (otpDetails) {
      res.render("user/afterForgotOtp", { email });
    } else {
      res.render("user/forgotOtp", { email, err_msg: "O T P is not valid" });
    }
  } catch (error) {
    console.log(error);
    res.render("user/error404");
  }
};
// -----------------------afterForgotOtp--------------------------------------
exports.afterForgotOtp = async (req, res) => {
  try {
    const data = req.body;
    const email = req.body.email;
    const userData = await userDetails.findOne({ email: email });
    if (data.newPassword === data.conformNewPassword) {
      bcryptjs.hash(data.newPassword, 10).then((newPassword) => {
        userDetails
          .findByIdAndUpdate(
            { _id: userData.id },
            {
              password: newPassword,
            }
          )
          .then(() => {
            res.redirect("/login");
          });
      });
    } else {
      res.render("user/afterForgotOtp", {
        email,
        err_msg: "Password must be same...!",
      });
    }
  } catch (error) {
    console.log(error);
    res.render("user/error404");
  }
};
// ---------------------serach--------------------------
exports.search = async (req, res) => {
  try {
    const data = req.body.search;
    let cartCount;
    const user = req.session.user;
    const filterCategory = await category.find();
    const userData = await userDetails.findOne({ email: user });
    if (userData) {
      const cart = await carts.findOne({ userId: userData.id });
      if (cart) {
        cartCount = cart.product.length;
      }
    }
    const productData = await products.find({
      $or: [
        { name: new RegExp(data, "i") },
        { category: new RegExp(data, "i") },
      ],
    });
    res.render("user/shop", { productData, user, cartCount, filterCategory });
  } catch (error) {
    console.log(error);
    res.render("user/error404");
  }
};
// ------filter--------------------------------
exports.filter = async (req, res) => {
  try {
    let cartCount;
    const user = req.session.user;
    const userData = await userDetails.findOne({ email: user });
    if (userData) {
      const cart = await carts.findOne({ userId: userData.id });
      if (cart) {
        cartCount = cart.product.length;
      }
    }
    const filterCategory = await category.find();
    const categoryData = req.params.id;
    const productData = await products.find({ category: categoryData });
    res.render("user/shop", { productData, user, cartCount, filterCategory });
  } catch (error) {
    console.log(error);
    res.render("user/error404");
  }
};
// --------MyOrders------------------------
exports.MyOrders = async (req, res) => {
  try {
    let cartCount;
    const user = req.session.user;
    const userData = await userDetails.findOne({
      $or: [{ email: user }, { username: user }],
    });
    return order
      .aggregate([
        {
          $match: { userId: userData._id },
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
      .then((orderData) => {
        console.log(orderData);
        res.render("user/MyOrders", { user, orderData, cartCount, userData });
      });
  } catch (error) {
    console.log(error);
    res.render("user/error404");
  }
};
// ---------------------orderReview--------------------
exports.orderReview = async (req, res) => {
  try {
    const user = req.session.user;
    const id = req.params.id;
    order.findOne({ _id: id }).then((orderData) => {
      res.render("user/orderReview", { user, orderData });
    });
  } catch (error) {
    console.log(error);
    res.render("user/error404");
  }
};
// --------------------appyCoupon-----------------------------------------------------------------------------------------------
exports.applyCoupon = async (req, res) => {
  const { couponDetails } = req.body;

  const user = req.session.user;
  if (couponDetails) {
    const couponData = await coupon.findOne({ couponName: couponDetails });
    console.log(couponData);
    if (couponData === null) {
      res.json({ err_msg: "no coupon available in that name" });
    } else {
      const couponExpiryDate = new Date(couponData.expiryDate);
      const currentDate = new Date();
      let isExpired;
      if (currentDate <= couponExpiryDate) {
        isExpired = true;
      } else {
        isExpired = false;
      }
      if (couponData == null || isExpired === false) {
        res.json({ err_msg: "coupon expired" });
      } else {
        const userData = await userDetails.findOne({ email: user });
        if (userData) {
          const cart = await carts.findOne({ userId: userData.id });
          if (cart) {
            cartCount = cart.product.length;
          }
        }
        const productData = await carts.findOne({ userId: userData.id });
        if (productData) {
          const product = await carts
            .aggregate([
              {
                $match: { userId: userData.id },
              },
              {
                $unwind: "$product",
              },
              {
                $project: {
                  productItem: "$product.productId",
                  quantity: "$product.quantity",
                },
              },
              {
                $lookup: {
                  from: "products",
                  localField: "productItem",
                  foreignField: "_id",
                  as: "productDetails",
                },
              },
              {
                $project: {
                  productItem: 1,
                  quantity: 1,
                  productDetails: { $arrayElemAt: ["$productDetails", 0] },
                },
              },
              {
                $addFields: {
                  productPrice: {
                    $sum: {
                      $multiply: ["$quantity", "$productDetails.price"],
                    },
                  },
                },
              },
            ])
            .exec();
          const amount = product.reduce((accumulator, object) => {
            return accumulator + object.productPrice;
          }, 0);
          const sum = amount - couponData.discount;
          res.json({ sum, success: true });
        } else {
          console.log("lol");
        }
      }
    }
  } else {
    console.log("loooo ");
  }

  // Send a response back to the client
};
// ----------------------userOrderStatusChange---------------------
exports.userOrderStatusChange = async (req, res) => {
  try {
    const orderId = req.params.id;
    const Data = req.body;
    await order
      .findByIdAndUpdate({ _id: orderId }, { orderStatus: "Cancelled" })
      .then(() => {
        res.redirect("/MyOrders");
      });
  } catch (error) {
    res.render("user/error404");
  }
};
// -----------------------------------
