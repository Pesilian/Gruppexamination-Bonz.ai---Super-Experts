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
    "string.base": "Email is not valid.",
    "string.email": "Please enter a valid email address.",
    "any.required": "Email is required.",
  }),
  checkInDate: Joi.date().min("now").iso().required().messages({
    "date.format": "Check-in date must be in ISO format (YYYY-MM-DD).",
    "date.base": "Date is not valid.",
    "date.min": "Check-in date must be current date or a later date.",
    "any.required": "Check-in date is required.",
  }),
  checkOutDate: Joi.date()
    .greater(Joi.ref("checkInDate"))
    .iso()
    .required()
    .messages({
      "date.format": "Check-in date must be in ISO format (YYYY-MM-DD).",
      "date.base": "Date is not valid.",
      "date.greater": "Check-out date must be later than check-in date.",
      "any.required": "Check out date is required.",
    }),
  guests: Joi.number().integer().min(1).required().messages({
    "number.base": "Guests should be a number.",
    "number.min": "Number of guests can not be less than 1.",
    "any.required": "Guests are required.",
  }),
  roomType: Joi.object({
    Enkelrum: Joi.number().integer().min(1).messages({
      "number.base": "Enkelrum must be a valid number.",
      "number.min": "Enkelrum cannot be less than 1.",
    }),
    Dubbelrum: Joi.number().integer().min(1).messages({
      "number.base": "Dubbelrum must be a valid number.",
      "number.min": "Dubbelrum cannot be less than 1.",
    }),
    Svit: Joi.number().integer().min(1).messages({
      "number.base": "Svit must be a valid number.",
      "number.min": "Svit cannot be less than 1.",
    }),
  })
    .required()
    .min(1)
    .messages({
      "object.min": "At least one room type must be included.",
      "object.unknown": "Accepted room types are Enkelrum, Dubbelrum, or Svit.",
    }),
});
