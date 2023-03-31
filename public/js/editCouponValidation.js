function editCouponValidation(modal) {
  couponName = document.getElementById("coupon");
  discountAmount = document.getElementById("discount");
  exDate = document.getElementById("eexpirydate");

  if (couponName.value == "") {
    document.getElementById("ecoupon_name_error").innerHTML =
      "Please Enter Coupon Name";
    couponName.focus();
    return false;
  }
  var regexCouponName = /^(?!.*([a-zA-Z])\1\1)[a-zA-Z]{3,10}$/;
  if (regexCouponName.test(couponName.value) === false) {
    document.getElementById("ecoupon_name_error").innerHTML =
      "Name Should Not Contain Numbers & Special Characters..! OR Invalid Data Formate (XXX) OR Atleast 3 Letters";
    couponName.focus();
    return false;
  }
  // ---------------------------------
  if (discountAmount.value == "") {
    document.getElementById("ediscound_error").innerHTML =
      "Please Enter Discount Amount";
    discountAmount.focus();
    return false;
  }
  var regexDiscountValue = /^(?:[1-9]\d{0,2}|1000)$/;
  if (regexDiscountValue.test(discountAmount.value) === false) {
    document.getElementById("ediscound_error").innerHTML =
      "Discount Amount only allow Positive Numbers and Max:Amount Is 1000";
    discountAmount.focus();
    return false;
  }
  // ------------------------------
  if (exDate.value == "") {
    document.getElementById("exp_name_error").innerHTML =
      "Please Enter Discount Amount";
    exDate.focus();
    return false;
  }
  var regexExpDate = /^\d{4}-(0[1-9]|1[0-2])-([0-2][1-9]|3[0-1])$/;
  if (regexExpDate.test(exDate.value) === false) {
    document.getElementById("exp_name_error").innerHTML =
      "Discount Amount only allow Positive Numbers and Max:Amount Is 1000";
    exDate.focus();
    return false;
  }
  return true;
}
