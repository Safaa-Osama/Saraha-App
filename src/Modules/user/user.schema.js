import joi from "joi";
import { genderEnum, providerEnum } from "../../common/enum/user.enum.js";
import { generalRules } from "../../common/utilis/generalRules.js";

export const signUpSchema = {
    body: joi.object({
        userName: generalRules.userName.required(),
        email: generalRules.email.required(),
        password: generalRules.password.required(),
        cpassword: generalRules.cpassword,
        age: joi.number().min(20).max(60),
        phone: generalRules.phone,
        provider: joi.string().valid(providerEnum.system, providerEnum.google),
        gender: joi.string().valid(...Object.values(genderEnum)),
        profilePicture: joi.string()
    }).required(),
    file: generalRules.file
}

export const signInSchema = {
    body: joi.object({
        email: generalRules.email.required(),
        password: generalRules.password.required(),
    })
}

export const signUpGoogleSchema = {
    body: joi.object({
        userName: generalRules.userName.required(),
        email: generalRules.email.required(),
        provider: joi.string().valid(providerEnum.google)
    })
}

export const shareProfileSchema = {
    params: joi.object(
        { id: generalRules.id.required() }
    ).required()
}

export const updateProfileSchema = {
    body: joi.object({
        firstName: generalRules.firstName,
        lastName: generalRules.lastName,
        phone: generalRules.phone,
        gender: joi.string().valid(...Object.values(genderEnum)),
    }).required()
}

export const updatePasswordSchema = {
    body: joi.object({
        oldPassword: generalRules.password.required(),
        newPassword: generalRules.password.required(),
        confirmPassword: joi.string().valid(joi.ref("newPassword"))
    }).required()
}

export const mailSchema = {
    body: joi.object({
        email: generalRules.email.required(),
    }).required()
}

export const otpSchema = {
    body: joi.object({
        email: generalRules.email.required(),
        otp: generalRules.otp.required(),
    }).required()
}

export const resetPassSchema = {
    body: joi.object({
        email: generalRules.email.required(),
        otp: generalRules.otp.required(),
        password:generalRules.password.required(),
        cpassword:generalRules.cpassword.required()
    }).required()
}
