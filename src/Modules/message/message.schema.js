import joi from "joi";
import { generalRules } from "../../common/utilis/generalRules.js";


export const sendSchema = {
    body: joi.object({
       content:joi.string().required(),
       userId: generalRules.id.required()
    }).required(),

    files: joi.array().items(generalRules.file)
}