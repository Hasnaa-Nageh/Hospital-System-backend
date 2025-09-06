const Joi = require("joi");
const mongoose = require("mongoose");

const objectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message("Invalid ObjectId");
  }
  return value;
};

const createAppointmentSchema = Joi.object({
  patient: Joi.string().custom(objectId).required().messages({
    "any.required": "Patient is required",
  }),
  doctor: Joi.string().custom(objectId).required().messages({
    "any.required": "Doctor is required",
  }),
  date: Joi.date().greater("now").required().messages({
    "date.base": "Date must be a valid date",
    "date.greater": "Date must be in the future",
    "any.required": "Date is required",
  }),
  notes: Joi.string().allow("", null),
});

const updateAppointmentSchema = Joi.object({
  date: Joi.date().greater("now").messages({
    "date.base": "Date must be a valid date",
    "date.greater": "Date must be in the future",
  }),
  notes: Joi.string().allow("", null),
});

module.exports = {
  createAppointmentSchema,
  updateAppointmentSchema,
};
