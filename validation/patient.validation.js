// validations/patient.validation.js
const Joi = require("joi");

const createPatientValidation = Joi.object({
  fullname: Joi.string().min(3).max(100).required(),
  phone: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required(),
  dateOfBirth: Joi.date().iso().required(),
  gender: Joi.string().valid("male", "female").required(),
  address: Joi.string().allow(""),
  notes: Joi.string().allow(""),
});

const updatePatientValidation = Joi.object({
  fullname: Joi.string().min(3).max(100),
  phone: Joi.string().pattern(/^[0-9]{10,15}$/),
  dateOfBirth: Joi.date().iso(),
  gender: Joi.string().valid("male", "female"),
  address: Joi.string().allow(""),
  notes: Joi.string().allow(""),
  isActive: Joi.boolean(),
});

module.exports = {
  createPatientValidation,
  updatePatientValidation,
};
