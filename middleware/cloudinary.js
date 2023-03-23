const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: "dytfqycdz",
  api_key: "466314465262893",
  api_secret: "s8b5a--1-f-cUnl8Yvf_G7ZO40g",
});

const storage = new CloudinaryStorage({
  cloudinary,

  params: {
    folder: "speed",
    allowedFormats: ["jpeg", "png", "jpg"],
  },
});
module.exports = { storage, cloudinary };
