import { Router } from "express";
import * as MS from "./message.service.js"
import { multer_local } from "../../common/middleware/multer.js";
import { multerEnum } from "../../common/enum/multer.enum.js";
import { joiValidator } from "../../common/middleware/joi.validator.js";
import { sendSchema } from "./message.schema.js";

export const messageRouter = Router({ mergeParams: true });

messageRouter.get("/", MS.getAllMessges)

messageRouter.post("/send",
    multer_local({ customPath: "messages", customType: multerEnum.image }).array("attachments", 3),
    joiValidator(sendSchema),
    MS.sendMessage
)

messageRouter.get("/userId/messages", MS.getMessges)