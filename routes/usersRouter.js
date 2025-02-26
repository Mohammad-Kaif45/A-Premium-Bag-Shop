const express = require("express");
const { registerUser, loginUser, logout } = require("../controllers/authController");
const router = express.Router();

router.get("/", function (req, res) {
    // res.send("User route working");
    res.redirect("/index");
});

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/logout", logout);

module.exports = router;

