var express = require("express");
const User = require("../models/userSchema");
var router = express.Router();
const multer = require("multer");
const userController = require("../controller/userController");
const bookController = require("../controller/bookController");

/* GET home page. */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/signup", upload.single("image"), userController.register);

router.post("/login", userController.login);

router.post("/book", userController.secure, bookController.addBook);

router.get("/book/:id", userController.secure, bookController.getBook);

module.exports = router;
