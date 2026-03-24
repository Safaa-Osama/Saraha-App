import joi from "joi";
import { genderEnum, providerEnum } from "../../common/enum/user.enum.js";


export const signUpSchema = {
    body: joi.object({
        userName: joi.string().min(3).max(30).required(),
     
        email: joi.string().email().required(),
        password: joi.string().min(6).required(),
        cpassword: joi.string().valid(joi.ref("password")),
        age: joi.number().min(20).max(60),
        phone: joi.string(),
        provider: joi.string().valid(providerEnum.system, providerEnum.google),
        gender: joi.string().valid(...Object.values(genderEnum)).required(),
        profilePicture: joi.string()
    }).required(),
    files: joi.object({
        attachment: joi.array().items(
            joi.object({
                fieldname: joi.string().required(),
                originalName: joi.string().required(),
                encoding: joi.string().required(),
                mimetype: joi.string().required(),
                distination: joi.string().required(),
                filename: joi.string().required(),
                path:joi.string().required(),
                size:joi.number().required(),
            })
        ),
        attachments: joi.array().items(
            joi.object({
fieldname: joi.string().required(),
                originalName: joi.string().required(),
                encoding: joi.string().required(),
                mimetype: joi.string().required(),
                distination: joi.string().required(),
                filename: joi.string().required(),
                path:joi.string().required(),
                size:joi.number().required(),
            })
        )
    })
}

export const signInSchema = {
    body: joi.object({
        email: joi.string().email().required(),
        password: joi.string().min(6).required()
    })
}