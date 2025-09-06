const Joi = require("joi");

const createDoctorValidation = Joi.object({
  fullname: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required(),
  specialization: Joi.string().min(2).max(50).required(),
  availableDays: Joi.array().items(Joi.string()),
  availableTimes: Joi.array().items(Joi.string()),
  notes: Joi.string().allow(""),
  image: Joi.string().uri().allow(""),
});

const updateDoctorValidation = Joi.object({
  fullname: Joi.string().min(3).max(100),
  email: Joi.string().email(),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/),
  specialization: Joi.string().min(2).max(50),
  availableDays: Joi.array().items(Joi.string()),
  availableTimes: Joi.array().items(Joi.string()),
  notes: Joi.string().allow(""),
  image: Joi.string().uri().allow(""),
  isActive: Joi.boolean(),
});

module.exports = {
  createDoctorValidation,
  updateDoctorValidation,
};
