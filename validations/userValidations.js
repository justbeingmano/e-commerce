
const joi = require('joi');

// body ={    email, name, passord , phone number,}
const validationR = joi.object({
    email:joi.string().email.require(),
    password:joi.string.require().min(6).uppercase(1),
    name:joi.string.require(),
    phonenumber:joi.number().min(10).max(11).require()

})


const validationLogin=joi.object({
    email:joi.string().email.require(),
    password:joi.string.require().min(6).uppercase(1),
    
})

module.exports={validationLogin, validationR}