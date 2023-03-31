function editProductValidation(form) {
  productName = document.getElementById("name2");
  brand = document.getElementById("brand");
  description = document.getElementById("description");
  stock = document.getElementById("stock");
  price = document.getElementById("price");
  size = document.getElementById("size");
  // -----------------------------------------------------------------
  if (name2.value == "") {
    document.getElementById("ProductNameError").innerHTML =
      "Please Enter poduct Name...!";
    name2.focus();
    return false;
  }
  var regexproductname = /^(?!.*([a-zA-Z])\1\1)[a-zA-Z]{3,10}$/;
  if (regexproductname.test(name2.value) === false) {
    document.getElementById("ProductNameError").innerHTML =
      "Name Should Not Contain Numbers & Special Characters..!\n OR Invalid Data Formate (XXX) OR Atleast 3 Letters Max:10  ";
    name2.focus();
    return false;
  }
  // ----------------------------------------------------------
  if (brand.value == "") {
    document.getElementById("brandNameError").innerHTML =
      "Please Enter poduct Name...!";
    brand.focus();
    return false;
  }
  var regexbrandname = /^(?!.*([a-zA-Z])\1\1)[a-zA-Z]{3,10}$/;
  if (regexbrandname.test(brand.value) === false) {
    document.getElementById("brandNameError").innerHTML =
      "Brand Should Not Contain Numbers & Special Characters..!\n OR Invalid Data Formate (XXX) OR Atleast 3 Letters Max:10";
    brand.focus();
    return false;
  }
  // --------------------------------------------------------
  if (description.value == "") {
    document.getElementById("descriptionNameError").innerHTML =
      "Please Enter description Name...! ";
    description.focus();
    return false;
  }

  var regexdescriptionname = /^[a-zA-Z]{3,5}[a-zA-Z\s]*$/;
  if (regexdescriptionname.test(description.value) === false) {
    document.getElementById("descriptionNameError").innerHTML =
      "Description Should Not Contain Numbers & Special Characters..! \n First 5 letters Not Empty \n Min:3 Letters ";
    description.focus();
    return false;
  }
  // -------------------------------------------------------------------------
  if (stock.value == "") {
    document.getElementById("stockNameError").innerHTML =
      "Please Enter stock number...! ";
    stock.focus();
    return false;
  }
  var regexstockname = /^[1-9][0-9]?$|^100$/;
  if (regexstockname.test(stock.value) === false) {
    document.getElementById("stockNameError").innerHTML =
      "Stock Should Not Contain Zero ,Negative Numbers & Special Characters..!\n Max: Limit 100 ";
    stock.focus();
    return false;
  }
  // ------------------------------------------------------------------------
  if (price.value == "") {
    document.getElementById("priceNameError").innerHTML =
      "Please Enter price ...! ";
    price.focus();
    return false;
  }
  var regexpricename = /^(?!0)[1-9]\d{3,4}$|^100000$/;
  if (regexpricename.test(price.value) === false) {
    document.getElementById("priceNameError").innerHTML =
      "Price Should Not Contain Zero ,Negative Numbers & Special Characters..!/nMin:1K, Max:Limit 1 Lakh";
    price.focus();
    return false;
  }
  // -----------------------------------------------------
  if (size.value == "") {
    document.getElementById("sizeNameError").innerHTML =
      "Please Enter Size...! ";
    size.focus();
    return false;
  }
  var regexsizename = /^[1-6][0-9]{0,5}$/;
  if (regexsizename.test(size.value) === false) {
    document.getElementById("sizeNameError").innerHTML =
      "Size Should Not Contain Zero ,Negative Numbers & Special Characters..!\n only Allow 1 to 6  ";
    size.focus();
    return false;
  }
  return true;
}
