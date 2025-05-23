const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");
const feedbackModel = require("../models/feedback-model");

router.get("/", isLoggedIn, async (req, res) => {
    const feedbacks = await feedbackModel.find().populate('userId', 'fullname');
    res.render("feedback", { feedbacks });
});

router.post("/submit", isLoggedIn, async (req, res) => {
    try {
        const { rating, comment } = req.body;
        await feedbackModel.create({
            userId: req.user._id,
            rating,
            comment
        });
        req.flash("success", "Feedback submitted successfully");
        res.redirect("/feedback");
    } catch (error) {
        req.flash("error", "Error submitting feedback");
        res.redirect("/feedback");
    }
});

module.exports = router;