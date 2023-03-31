function userAddressValidation(form) {
  firstname = document.getElementById("firstName");
  lastname = document.getElementById("lastName");
  housename = document.getElementById("houseName");
  streetname = document.getElementById("streetName");
  city = document.getElementById("cityName");
  district = document.getElementById("districtName");
  state = document.getElementById("stateName");
  pin = document.getElementById("pin");
  mobile = document.getElementById("mobile");
  //  --------------------First Name----------------------------

  if (firstName.value == "") {
    document.getElementById("Name_Error").innerHTML =
      "Please Enter Firsrt Name Currectly...! ";
    firstName.focus();
    return false;
  }
  var regexFirstName = /^(?!.*([a-zA-Z])\1\1)[a-zA-Z]{3,10}$/;
  if (regexFirstName.test(firstName.value) === false) {
    document.getElementById("Name_Error").innerHTML =
      "Name Should Not Contain Numbers & Special Characters..! OR Invalid Data Formate (XXX) OR Atleast 3 Letters ";
    firstName.focus();
    return false;
  }
  // ------------------Last Name-----------------------
  if (lastName.value == "") {
    document.getElementById("Last_Name_Error").innerHTML =
      "Please Enter Last Name Currectly...! ";
    lastName.focus();
    return false;
  }
  var regexLastName = /^(?!.*([a-zA-Z])\1\1)[a-zA-Z]{1,10}$/;
  if (regexLastName.test(lastName.value) === false) {
    document.getElementById("Last_Name_Error").innerHTML =
      "Last Name Should Not Contain Numbers & Special Characters..! OR Invalid Data Formate (XXX)";
    lastName.focus();
    return false;
  }
  // ---------------House----------------------------
  if (houseName.value == "") {
    document.getElementById("House_Name_Error").innerHTML =
      "Please Enter House Name Currectly...! ";
    houseName.focus();
    return false;
  }
  var regexHouseName = /^(?!.*([a-zA-Z])\1\1)[a-zA-Z]{3,15}$/;
  if (regexHouseName.test(houseName.value) === false) {
    document.getElementById("House_Name_Error").innerHTML =
      "House Name Should Not Contain Numbers & Special Characters..! OR Invalid Data Formate (XXX) OR Atleast 3 Letters";
    houseName.focus();
    return false;
  }
  // -----------------------street------------------
  if (streetName.value == "") {
    document.getElementById("Street_Name_Error").innerHTML =
      "Please Enter Street Name Currectly...! ";
    streetName.focus();
    return false;
  }
  var regexStreetName = /^(?!.*([a-zA-Z])\1\1)[a-zA-Z]{3,15}$/;
  if (regexStreetName.test(streetName.value) === false) {
    document.getElementById("Street_Name_Error").innerHTML =
      "Street Name Should Not Contain Numbers & Special Characters..! OR Invalid Data Formate (XXX) OR Atleast 3 Letters";
    streetName.focus();
    return false;
  }
  // ---------------------city----------------------------------
  if (cityName.value == "") {
    document.getElementById("City_Name_Error").innerHTML =
      "Please Enter City Name Currectly...! ";
    cityName.focus();
    return false;
  }
  var regexCityName = /^(?!.*([a-zA-Z])\1\1)[a-zA-Z]{3,15}$/;
  if (regexCityName.test(cityName.value) === false) {
    document.getElementById("City_Name_Error").innerHTML =
      "CityName Should Not Contain Numbers & Special Characters..! OR Invalid Data Formate (XXX) OR Atleast 3 Letters";
    cityName.focus();
    return false;
  }
  // ------------district-------------------------------
  if (districtName.value == "") {
    document.getElementById("District_Name_Error").innerHTML =
      "Please Enter District Name Currectly...! ";
    districtName.focus();
    return false;
  }
  var regexDistrictName = /^(?!.*([a-zA-Z])\1\1)[a-zA-Z]{3,15}$/;
  if (regexDistrictName.test(districtName.value) === false) {
    document.getElementById("District_Name_Error").innerHTML =
      " District Name Should Not Contain Numbers & Special Characters..! OR Invalid Data Formate (XXX) OR Atleast 3 Letters";
    districtName.focus();
    return false;
  }
  // ------------------state-------------------------------------
  if (stateName.value == "") {
    document.getElementById("State_Name_Error").innerHTML =
      "Please Enter State Name Currectly...! ";
    stateName.focus();
    return false;
  }
  var regexStateName = /^(?!.*([a-zA-Z])\1\1)[a-zA-Z]{3,15}$/;
  if (regexStateName.test(stateName.value) === false) {
    document.getElementById("State_Name_Error").innerHTML =
      "State Name Should Not Contain Numbers & Special Characters..! OR Invalid Data Formate (XXX) OR Atleast 3 Letters";
    stateName.focus();
    return false;
  }
  // --------------pin--------------------------------------
  if (pin.value == "") {
    document.getElementById("PIN_Code_Error").innerHTML =
      "Please Enter PIN Code Currectly...! ";
    pin.focus();
    return false;
  }
  var regexPINCode = /^[1-9]\d{5}$/;
  if (regexPINCode.test(pin.value) === false) {
    document.getElementById("PIN_Code_Error").innerHTML =
      "PIN Code Should Contain Six Valid Numbers..!";
    pin.focus();
    return false;
  }
  // ------Mobile-----------------------------------
  if (mobile.value == "") {
    document.getElementById("Mobile_Number_Error").innerHTML =
      "Please Enter Mobile Number Currectly...! ";
    mobile.focus();
    return false;
  }
  var regexMobileNumber = /^(0|[1-9]\d{9})$/;
  if (regexMobileNumber.test(mobile.value) === false) {
    document.getElementById("Mobile_Number_Error").innerHTML =
      "Mobile Number Should  Contain Ten Valid Numbers ";
    mobile.focus();
    return false;
  }
  // ---------------------------
  return true;
}
