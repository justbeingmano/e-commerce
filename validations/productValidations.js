 import Joi from "joi";

 //-->for verfing correct project and this only for admin
 export const createProductValidation = Joi.object({
  name: Joi.string().trim().required(),
  description: Joi.string().trim().required(),
  price: Joi.number().min(0).required(),
  category: Joi.string().trim().required(),

  image: Joi.string().uri().optional(),

  stock: Joi.number().min(0).default(0),
  isActive: Joi.boolean().default(true),


  averageRating: Joi.number().default(0),
  totalReviews: Joi.number().default(0)



});

export{createProductValidation};
