const router= require("express").Router();
const {User}=require("../models/userModel");
const { validationR } = require("../validations/uservalidations");

router.post("/register",async   (req,res)=>{

    try {

        const {error,value}=validationR.validate(req.body);
        if (error)
        {
             res.status(400).json({ message: error.message });
        }
    
    // User => Email
    const userExist = await User.findByEmail(value.email);
    if (userExist) {
      res.status(400).json({ message: "invalid data" });
    }

    const user = await User.create(value);

    // Generate Token
    const token = user.generateToken();
    res.status(201).json({ message: "user created...", data: { token } });
  } catch (error) {}

})
router.post("/login",(req,res)=>{})



module.exports=router;