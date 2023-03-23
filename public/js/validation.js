function validatingForm(form){
  
    username =document.getElementById("name1");
    email =document.getElementById("email");
    password =document.getElementById("password");
    conformPassword =document.getElementById("conformpassword");
       
     if(name1.value == ""){
        document.getElementById("userNameError").innerHTML="Please Enter Your Name..! "
        name1.focus();
        return false;
    }
     var regexname = /^[a-zA-Z\-]+$/ ;
    
     if(regexname.test(name1.value)=== false){
      document.getElementById('userNameError').innerHTML="Name Should Not Contain Numbers & Special Characters..! "
      name1.focus();
      return false;
     }
    //  ------------------------------------------------------------------------------------------------------------

  
    //  ------------------------------------------------------------------------------------------------

     if(email.value === ""){
        document.getElementById('emailError').innerHTML="please enter your mail id..! "
        email.focus();
        return false;
    }
      const re =
       /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
     if(re.test(email.value)=== false){
        document.getElementById('emailError').innerHTML="please enter valid email..! "
        email.focus();
        return false;
    }
    // ----------------------------------------------------------------------------------------------------------

   var regexpass =  /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
   if(regexpass.test(password.value)=== false){
    document.getElementById('passwordError').innerHTML="password should have min 8 letter password, with at least a symbol, upper and lower case letters and a number..! "
    password.focus();
    return false;
   }

    if(password.value == ""){
        document.getElementById('passwordError').innerHTML="please enter your password..! "
        password.focus();
        return false;
    }
    


// -----------------------------------------------------------------------------------------------------------------

if(conformpassword.value == "" ){
    document.getElementById("conformPasswordError").innerHTML="please enter your Conform password number..! "
    conformpassword.focus();
    return false;

}

var regexconfpass =  /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
 if(regexconfpass.test(conformpassword.value)=== false ){
  document.getElementById("conformPasswordError").innerHTML="conform password must be same as password "
  conformpassword.focus();
    return false;
 }
 return true;


}
// ----------------------close--------------------------------------------