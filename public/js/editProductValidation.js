const products = require("../../model/products");

function editProductValidation(form){
    productName=document.getElementById("name2")
    brand=document.getElementById("brand")
    description=document.getElementById("description")
    stock=document.getElementById("stock")
    price=document.getElementById("price")
    size=document.getElementById("size")
    // -----------------------------------------------------------------
if(name2.value==""){
    document.getElementById("ProductNameError").innerHTML="Please Enter poduct Name...!"
    name2.focus();
    return false;
}
var regexproductname = /^[a-zA-Z\-]+$/ ;
if(regexproductname.test(name2.value)===false){
    document.getElementById('ProductNameError').innerHTML="Name Should Not Contain Numbers & Special Characters..! "
    name2.focus();
    return false
}
// ----------------------------------------------------------
if(brand.value==""){
    document.getElementById("brandNameError").innerHTML="Please Enter poduct Name...!";
    brand.focus()
    return false
}
var regexbrandname = /^[a-zA-Z\-]+$/ ;
if(regexbrandname.test(brand.value)===false){
    document.getElementById('brandNameError').innerHTML="Name Should Not Contain Numbers & Special Characters..! "
    brand.focus();
    return false
}
// --------------------------------------------------------
if(description.value==""){
    document.getElementById("descriptionNameError").innerHTML="Please Enter description Name...! ";
    description.focus()
    return false
}

var regexdescriptionname = /^[a-zA-Z]{1,5}[a-zA-Z\s]*$/ ;
if(regexdescriptionname.test(description.value)===false){
    document.getElementById('descriptionNameError').innerHTML="Name Should Not Contain Numbers & Special Characters..! "
    description.focus();
    return false
}
// -------------------------------------------------------------------------
if(stock.value==""){
    document.getElementById("stockNameError").innerHTML="Please Enter stock number...! ";
    stock.focus();
    return false
}
var regexstockname= /^0*[1-9]\d*$/;
if(regexstockname.test(stock.value)===false){
    document.getElementById('stockNameError').innerHTML="Stock Should Not Contain Zero ,Negative Numbers & Special Characters..! "
    stock.focus()
    return false
}
// ------------------------------------------------------------------------
if(price.value==""){
    document.getElementById("priceNameError").innerHTML="Please Enter price ...! ";
    price.focus();
    return false
}
var regexpricename= /^0*[1-9]\d*$/;
if(regexpricename.test(price.value)===false){
    document.getElementById('priceNameError').innerHTML="Price Should Not Contain Zero ,Negative Numbers & Special Characters..! "
    price.focus()
    return false
}
// -----------------------------------------------------
if(size.value==""){
    document.getElementById("sizeNameError").innerHTML="Please Enter Size...! ";
    size.focus();
    return false
}
var regexsizename= /^0*[1-9]\d*$/;
if(regexsizename.test(size.value)===false){
    document.getElementById('sizeNameError').innerHTML="Size Should Not Contain Zero ,Negative Numbers & Special Characters..! "
    size.focus()
    return false
}
return true;


}