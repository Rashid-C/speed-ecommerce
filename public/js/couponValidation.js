function couponValidation(form) {
  couponName = document.getElementById("code");
  discountAmount = document.getElementById("discount");

  if (couponName.value == "") {
    document.getElementById("coupon_name_error").innerHTML =
      "Please Enter Coupon Name";
    couponName.focus();
    return false;
  }
  var regexCouponName = /^(?!.*([a-zA-Z])\1\1)[a-zA-Z]{3,10}$/;
  if (regexCouponName.test(couponName.value) === false) {
    document.getElementById("coupon_name_error").innerHTML =
      "Name Should Not Contain Numbers & Special Characters..! OR Invalid Data Formate (XXX) OR Atleast 3 Letters\n Max: 10 Letters";
    couponName.focus();
    return false;
  }
  // ---------------------------------
  if (discountAmount.value == "") {
    document.getElementById("discound_error").innerHTML =
      "Please Enter Discount Amount";
    discountAmount.focus();
    return false;
  }
  var regexDiscountValue = /^(?:[1-9]\d{0,2}|1000)$/;
  if (regexDiscountValue.test(discountAmount.value) === false) {
    document.getElementById("discound_error").innerHTML =
      "Discount Amount only allow Positive Numbers and Max:Amount Is 1000";
    discountAmount.focus();
    return false;
  }
  return true;
}
