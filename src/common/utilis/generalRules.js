import joi from "joi";
import { Types } from "mongoose";


export const generalRules = {
    email: joi.string().email().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
    password: joi.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/),
    cpassword: joi.string().valid(joi.ref("password")),
    phone: joi.string().regex(/^(?:\+20|0020|0)1[0125]\d{8}$/),
    userName: joi.string().min(3).max(30),
    firstName: joi.string().min(3).max(30),
      otp: joi.string().regex(/^\d{6}$/).required(),
    lastName: joi.string().min(3).max(30),
    id: joi.string().custom((value, helper) => {
        const isValid = Types.ObjectId.isValid(value)
        return isValid ? value : helper.message("invalid id")
    }),

    file: joi.object({
        fieldname: joi.string().required(),
        originalname: joi.string().required(),
        destination: joi.string().required(),
        encoding: joi.string().required(),
        mimetype: joi.string().required(),
        filename: joi.string().required(),
        path: joi.string().required(),
        size: joi.number().required(),
    }).messages({
        "any-required": "file is required"
    })
}