const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');




cloudinary.config({
    cloud_name:"dytfqycdz",
    api_key:"466314465262893",
    api_secret:"s8b5a--1-f-cUnl8Yvf_G7ZO40g",
})


module.exports = {
    cloudinary: cloudinary,
    storage : new CloudinaryStorage({
        cloudinary: cloudinary,

        params:{
            folder:"speed",
            allowedFormats:['jpeg','png','jpg']
        }
    }),
};