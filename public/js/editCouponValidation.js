function editCouponValidation(e) {
  const formData = new FormData(e.target); // create a new FormData object with the form data
  const name = formData.get('coupon'); // get the value of the 'name' field
  const discount = formData.get('discount'); 
  const exDate = formData.get('expirydate');
  

 

  if (name == "") {
    document.getElementById("ecoupon_name_error").innerHTML =
      "Please Enter Coupon Name";
    return false;
  }
  var regexCouponName = /^(?!.*([a-zA-Z])\1\1)[a-zA-Z]{3,10}$/;
  if (regexCouponName.test(name) === false) {
    document.getElementById("ecoupon_name_error").innerHTML =
      "Name Should Not Contain Numbers & Special Characters..! OR Invalid Data Formate (XXX) OR Atleast 3 Letters\n Max: 10 Letters";
    return false;
  }
  // ---------------------------------
  if (discount == "") {
    document.getElementById("ediscound_error").innerHTML =
      "Please Enter Discount Amount";
    return false;
  }
  var regexDiscountValue = /^(?:[1-9]\d{0,2}|1000)$/;
  if (regexDiscountValue.test(discount) === false) {
    document.getElementById("ediscound_error").innerHTML =
      "Discount Amount only allow Positive Numbers and Max:Amount Is 1000";
    return false;
  }
  // ------------------------------
  if (exDate == "") {
    document.getElementById("exp_name_error").innerHTML =
      "Please Enter Discount Amount";
    return false;
  }
  var regexExpDate = /^(?!0000)[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
  if (regexExpDate.test(exDate) === false) {
    document.getElementById("exp_name_error").innerHTML =
      "Discount Amount only allow Positive Numbers and Max:Amount Is 1000";
    return false;
  }
  return true;
}
