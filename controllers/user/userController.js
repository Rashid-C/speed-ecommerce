const userDetails = require('../../model/userModel')
const bcryptjs = require("bcryptjs");
const { render } = require('ejs');
const products = require('../../model/products');
const securePassword = async (password)=>{
    try {
        console.log('hash successfuly');
        const passwordhash = await bcryptjs.hash(password,10);
        return passwordhash;
    } catch (error) {
      console.log(error);  
    }
}
exports.login_page = (req,res)=>{
    try {
       if (req.session.user) {
           res.redirect('/')
       } else {
        res.render("user/login")
       }
    } catch (error) {
       console.log(error); 
    }
}

exports.signup_page=(req,res)=>{
    try {
        res.render("user/signup")
    } catch (error) {
        console.log(error);
    }
}
exports.userPost=async(req,res)=>{
    try {
        let {name,email,passwrod,confirmpassword} = req.body
        const password = await securePassword(passwrod)
        let userInsert = new userDetails({
            username:name,
            email:email,
            password:password,
        })
       await userInsert.save();
       req.session.user = email
       res.redirect('/login')
    } catch (error) {
        console.log(error);
    }
}

exports.user_verification=async(req,res)=>{
    try {
        let{Email,password}=req.body
        const userData = await userDetails.findOne({email:Email})
        if(userData){
            bcryptjs.compare(password,userData.password).then((result) => {
              if (result) {
                req.session.user = Email
                res.redirect("/")
              }else{
                res.render("user/login",{ 
                    err_msg: "invalid user...!",
                })
              }
            })
        
        }else{
            res.render("user/login",{ 
                err_msg: "invalid user...!",
            })
        }
    } catch (error) {
        console.log(error);
    }
}
exports.get_home = (req,res)=>{
   let user = req.session.user
    products.find().then((productData)=>{
       console.log(productData);
        res.render('user/index',{productData , user})
    }) 
   
}
exports.getshop=(req,res)=>{
    products.find().then((productData)=>{
        console.log(productData);
         res.render('user/shop',{productData})
     })
}
exports.logOut=(req,res)=>{
    req.session.destroy();
    res.redirect("/");
}

exports.addToCart=(req,res)=>{
    let user = req.session.user
    res.render("user/addToCart",{user})
}