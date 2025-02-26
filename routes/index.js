const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");
const productModel = require("../models/product-model");
const userModel = require("../models/user-model");

router.get("/", function (req, res) {
    let error = req.flash("error");
    res.render("index", { error, loggedin: false });
});

router.get("/shop", isLoggedIn, async function (req, res) {
    let products = await productModel.find();
    let success = req.flash("success");
    res.render("shop", { products, success });
});

router.get("/cart", isLoggedIn, async function (req, res) {
    let user = await userModel
        .findOne({ email: req.user.email })
        .populate("cart");
    res.render("cart", { user });
});

router.get("/addtocart/:productid", isLoggedIn, async function (req, res) {
    console.log(`Adding product with ID: ${req.params.productid}`);
    let user = await userModel.findOne({ email: req.user.email });
    const product = await productModel.findById(req.params.productid);


    if (!product) {
        req.flash("error", "Product not found");
        return res.redirect("/shop");
    }

    user.cart.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1 // Default quantity
    });

    await user.save();
    req.flash("success", "Added to cart");
    res.redirect("/shop");
});

// Route to remove a product from the cart
router.get("/removefromcart/:productid", isLoggedIn, async function (req, res) {
    console.log(`Removing product with ID: ${req.params.productid}`);
    let user = await userModel.findOne({ email: req.user.email });
    user.cart = user.cart.filter(item => item.productId.toString() !== req.params.productid);

    await user.save();
    req.flash("success", "Product removed from cart");
    res.redirect("/cart");
});

router.get("/updatequantity/:productid", isLoggedIn, async function (req, res) {
    const { productid } = req.params;
    const { action } = req.query;

    try {
        let user = await userModel.findOne({ email: req.user.email });
        let cartItem = user.cart.find(item => item.productId.toString() === productid.toString());

        if (!cartItem) {
            req.flash("error", "Product not found in cart.");
            return res.redirect("/cart");
        }

        if (action === 'increase') {
            cartItem.quantity += 1;
        } else if (action === 'decrease') {
            if (cartItem.quantity > 1) {
                cartItem.quantity -= 1;
            } else {
                user.cart = user.cart.filter(item => item.productId.toString() !== productid.toString());
            }
        }

        await user.save();
        req.flash("success", "Quantity updated successfully.");
        res.redirect("/cart");
    } catch (err) {
        console.error("Error updating quantity:", err);
        req.flash("error", "Something went wrong while updating quantity.");
        res.redirect("/cart");
    }
});

module.exports = router;
