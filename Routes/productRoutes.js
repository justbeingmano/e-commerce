
const router= require("express").Router()
const {product}=require("../models/productModel")


router.get("/",async(req,res)=>{
    res.json(message("hello"))
})
router.get("/:id",async(req,res)=>{})
router.post("/",async(req,res)=>{})
router.put("/:id",async(req,res)=>{})
router.delete("/:id",async(req,res)=>{})
router.patch("/:id",async(req,res)=>{})
module.exports=router