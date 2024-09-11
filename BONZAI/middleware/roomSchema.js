import Joi from "joi";

export const roomSchema = Joi.object({
  firstName: Joi.string().min(3).required().messages({
    "string.base": "First name should only contain letters.",
    "string.min": "First name must be longer than 3 characters.",
    "any.required": "First name is required.",
  }),
  surname: Joi.string().min(3).required().messages({
    "string.base": "Surname should only contain letters.",
    "string.min": "Surname must be longer than 3 characters.",
    "any.required": "Surname is required.",
  }),
  email: Joi.string().email().required().messages({
    // proper email error message fix
    "string.base": "Email is not valid.",
    "any.required": "Email is required.",
  }),
  checkInDate: Joi.date().iso().required().messages({
    // proper date error message fix
    "date.base": "Date is not valid.",
    "any.required": "Check-in date is required.",
  }),
  checkOutDate: Joi.date().iso().required().messages({
    // proper date error message fix
    "date.base": "Date is not valid.",
    "any.required": "Check out date is required.",
  }),
  guests: Joi.number().integer().min(1).required().messages({
    "number.base": "Guests should be a number.",
    "number.min": "Number of guests can not be less than 0.",
    "any.required": "Guests are required.",
  }),
  roomType: Joi.object.required()({
    //At least one room type must be included, also must fit guest requirement
    Enkelrum: Joi.number().integer().min(0).required(), // Should not be required but if included must be integer
    Dubbelrum: Joi.number().integer().min(0).required(), // Should not be required but if included must be integer
    Svit: Joi.number().integer().min(0).required(), // Should not be required but if included must be integer
  }),
});
