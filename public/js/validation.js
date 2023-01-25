function validatingForm(form){
  
    userName =document.getElementById("username");
    email =document.getElementById("email");
    password =document.getElementById("password");
    conformPassword =document.getElementById("confirmpassword");

    


    if(userName.value == ""){
        document.getElementById('userNameError').innerHTML="please enter your Name..! "
        userName.focus();
        return false;
    }
     var regexname = /^[a-zA-Z\-]+$/ ;
    
     if(regexname.test(userName.value)=== false){
      document.getElementById('userNameError').innerHTML="Name should not contain  special characters..! "
      userName.focus();
      return false;
     }
    





     if(conformPassword.value == "" ){
        document.getElementById('conformPasswordrError').innerHTML="please enter your Conform password number..! "
        conformPassword.focus();
        return false;

    }

    var regexconfpass =  /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
     if(regexconfpass.test(conformPassword.value)=== false ||conformPassword !== password){
      document.getElementById('phoneNumberError').innerHTML="conform password must be same as password "
        conformPassword.focus();
        return false;
     }




     if(email.value == ""){
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
    return true;

}