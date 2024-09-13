import Joi from "joi";

export const roomSchema = Joi.object({
  firstName: Joi.string().min(3).required().empty("").messages({
    "string.base": "First name should only contain letters.",
    "string.min": "First name must be longer than 3 characters.",
    "any.required": "First name is required.",
    "any.empty": "First name cannot be an empty field.",
  }),
  surname: Joi.string().min(3).required().empty("").messages({
    "string.base": "Surname should only contain letters.",
    "string.min": "Surname must be longer than 3 characters.",
    "any.required": "Surname is required.",
    "any.empty": "Surname cannot be an empty field.",
  }),
  email: Joi.string().email().required().empty("").messages({
    "string.base": "Email is not valid.",
    "string.email": "Please enter a valid email address.",
    "any.required": "Email is required.",
    "any.empty": "Email cannot be an empty field.",
  }),
  checkInDate: Joi.date().min("now").iso().required().empty("").messages({
    "date.format": "Check-in date must be in ISO format (YYYY-MM-DD).",
    "date.base": "Date is not valid.",
    "date.min": "Check-in date must be current date or a later date.",
    "any.required": "Check-in date is required.",
    "any.empty": "Check-in date cannot be an empty field.",
  }),
  checkOutDate: Joi.date()
    .greater(Joi.ref("checkInDate"))
    .iso()
    .required()
    .empty("")
    .messages({
      "date.format": "Check out date must be in ISO format (YYYY-MM-DD).",
      "date.base": "Date is not valid.",
      "date.greater": "Check out date must be later than check-in date.",
      "any.required": "Check out date is required.",
      "any.empty": "Check out date cannot be an empty field.",
    }),
  guests: Joi.number().integer().min(1).required().empty("").messages({
    "number.base": "Guests should be a number.",
    "number.min": "Number of guests can not be less than 1.",
    "any.required": "Guests are required.",
    "any.empty": "Guests cannot be an empty field.",
  }),
  roomType: Joi.object({
    Enkelrum: Joi.number().integer().min(1).empty("").messages({
      "number.base": "Enkelrum must be a valid number.",
      "number.min": "Enkelrum cannot be less than 1.",
    }),
    Dubbelrum: Joi.number().integer().min(1).empty("").messages({
      "number.base": "Dubbelrum must be a valid number.",
      "number.min": "Dubbelrum cannot be less than 1.",
    }),
    Svit: Joi.number().integer().min(1).empty("").messages({
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
