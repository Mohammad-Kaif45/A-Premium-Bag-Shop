const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");
const orderModel = require("../models/order-model");
const userModel = require("../models/user-model");

router.get("/", isLoggedIn, async (req, res) => {
    const orders = await orderModel.find({ userId: req.user._id }).populate('products.productId');
    res.render("orders", { orders });
});

router.post("/create", isLoggedIn, async (req, res) => {
    try {
        const { shippingAddress } = req.body;
        const user = await userModel.findById(req.user._id).populate('cart');
        
        if (!user.cart.length) {
            req.flash("error", "Cart is empty");
            return res.redirect("/cart");
        }

        const totalAmount = user.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        
        const order = await orderModel.create({
            userId: user._id,
            products: user.cart.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price
            })),
            totalAmount,
            shippingAddress
        });

        // Clear cart after order creation
        user.cart = [];
        await user.save();

        req.flash("success", "Order placed successfully");
        res.redirect("/orders");
    } catch (error) {
        req.flash("error", "Error placing order");
        res.redirect("/cart");
    }
});

module.exports = router;