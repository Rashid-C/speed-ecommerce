
const nodemailer=require('nodemailer')


module.exports={
     mailTransporter : nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "jsoanu@gmail.com",
          pass: "tzjnlllnuuavzgzl" ,
        },
      }),

      OTP  : `${Math.floor(1000 + Math.random() * 9000)}` ,
      
}