const adminDetails = require("../../model/adminModel");
const products = require("../../model/products");

exports.loginadmin = (req, res) => {
  try {
    if (req.session.admin) {
      res.render("admin/home");
    } else {
      res.render("admin/Login");
    }
  } catch (error) {
    console.log(error);
  }
};
exports.getDash = (req, res) => {
  res.render("admin/home");
};

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
exports.adminProduct = async (req, res) => {
  try {
    let productData = await products.find();

    res.render("admin/product", { productData });
  } catch (error) {
    console.log(error);
  }
};
exports.addProduct = (req, res) => {
  try {
    res.render("admin/addProduct");
  } catch (error) {
    console.log(error);
  }
};
exports.postProduct = async (req, res) => {
 
  try {
  
    console.log(req);
    
    let { name, brand, description, stock, category, price, size } = req.body;

    
    

    let productInsert = new products({
      name: name,
      brand: brand,
      description: description,
      stock: stock,
      category: category,
      price: price,
      size: size,
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

exports.logOut = (req, res) => {
  req.session.destroy();
  res.redirect("/admin");
};
exports.deleteProduct = (req, res) => {
  // console.log(req.params);
  const productId = req.params.id;
  products
    .findByIdAndUpdate({ _id: productId }, { isDeleted: true })
    .then((productData) => {
      res.redirect("/admin/product");
    });
};
exports.restoreProduct = (req, res) => {
  const productId = req.params.id;

  products
    .findByIdAndUpdate({ _id: productId }, { isDeleted: false })
    .then((productData) => {
      res.redirect("/admin/product");
    });
};
exports.editProduct = (req, res) => {
  const id = req.params.id;
  products.findOne({ _id: id }).then((productE) => {
    res.render("admin/editProduct", { productE });
  });
};
exports.postEdit = (req, res) => {
  const id = req.params.id;
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
      }
    )
    .then((productE) => {
      res.redirect("/admin/product");
    });
};
