const express = require("express");
const ownerModel = require("../models/owner-model");

const router = express.Router();


if(process.env.NODE_ENV === "development")
    {
        router.post("/create", async function(req, res){
            let owners = await ownerModel.find();

            if(owners.length >0)
                {
                    return res
                    .send(503)
                    .send("you dont have permission to create a new owners")
                }


               let createowner= await ownerModel.create({
                })
                res.send("we can create a new owner");

        })
    }


router.get("/admin", function(req, res){
    let success= req.flash("success");
    res.render("createproducts", {success});
});

module.exports = router;