const express = require("express");
const router = express.Router();
const upload = require("../config/multer-config");
const productModel = require("../models/product-model");

router.post("/create", upload.single("image"), async function(req, res) {
    try {
        const { name, price, discount, bgcolor, panelcolor, textcolor } = req.body;

        const product = await productModel.create({
            image: req.file.buffer,
            name,
            price,
            discount,
            bgcolor,
            panelcolor,
            textcolor
        });

        req.flash("success", "Product created successfully.");
        res.redirect("/owners/admin");
        
    } catch (error) {
        console.error("Error creating product:", error);
        req.flash("error", "Error creating product.");
        res.redirect("/owners/admin");
    }
});

module.exports = router;
