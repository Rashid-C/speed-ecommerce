const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const db = require("./config/connection");
const userRouter = require("./routes/userRouter");
const adminRouter = require("./routes/adminRouter");
require('dotenv').config()


 

const path = require("path");
const { preventCache } = require("./middleware/cache");

//database(moongoose)
db.dbConnect();
const app = express();
//ejs
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//session
const oneDay = 1000 * 60 * 60 * 24;
app.use(
  session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);

app.use(preventCache);


app.use(express.static(path.join(__dirname, "public")));
//routers
app.use("/", userRouter);
app.use("/admin", adminRouter);

app.listen(process.env.PORT, () => {
  console.log("http://localhost:3000");
});
