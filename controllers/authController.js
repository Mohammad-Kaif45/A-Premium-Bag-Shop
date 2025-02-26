const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require("../models/user-model");
const { generateToken } = require("../utils/generateToken");

module.exports.registerUser = async function (req, res) {
    try {
        let { email, password, fullname } = req.body;
        let user = await userModel.findOne({ email: email });

        if (user) return res.status(401).send("You already have an account, please login.");

        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, async function (err, hash) {
                if (err) return res.send(err.message);

                let user = await userModel.create({ email, password: hash, fullname });
                let token = generateToken(user);
                res.cookie("token", token, { httpOnly: true });

                req.flash('success', 'Register successful.');
                res.redirect('/shop');
            });
        });
    } catch (err) {
        console.log(err.message);
    }
};

module.exports.loginUser = async function (req, res) {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            req.flash('error', 'Invalid email or password.');
            return res.redirect('/');
        }

        const token = generateToken(user);
        res.cookie("token", token, { httpOnly: true });

        req.flash('success', 'Login successful.');
        res.redirect('/shop');
    } catch (error) {
        console.error('Login error:', error);
        req.flash('error', 'Something went wrong.');
        res.redirect('/');
    }
};

module.exports.logout = function (req, res) {
    res.clearCookie("token");
    req.flash('success', 'Logged out successfully.');
    res.redirect('/');
};
