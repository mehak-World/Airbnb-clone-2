const Joi = require("joi");

const schema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required().min(1),
    country: Joi.string().required(),
    city: Joi.string().required()
})


module.exports = schema
