import { Router } from "express"
import * as US from "./user.services.js"
import { authontication } from "../../common/middleware/authontication.js";
import { joiValidator } from "../../common/middleware/joi.validator.js";
import * as UV from "./user.schema.js";
import { multer_cloud, multer_local } from "../../common/middleware/multer.js";
import { multerEnum } from "../../common/enum/multer.enum.js";


export const userRouter = Router();

userRouter.get("/", US.getAllUsers);

//single + cloudinary
userRouter.post('/sign-up1', multer_cloud(multerEnum.image).single("attachment"), joiValidator(UV.signUpSchema),US.signUp1);

//array
userRouter.post('/sign-up2', multer_local({ customPath: "useers", customType: multerEnum.image }).array("attachments", 3), US.signUp2);

//fields
userRouter.post('/sign-up3', multer_local({ customPath: "useers", customType: multerEnum.image })
    .fields([
        { name: "attachments", maxCount: 3 },
        { name: "attachment", maxCount: 1 }
    ]), US.signUp3);

userRouter.post('/signup/gmail', US.signUpWithGoogle);

userRouter.post('/sign-in', joiValidator(UV.signInSchema), US.signIn);


userRouter.get("/profile", authontication, US.getProfile);
userRouter.get("/logOut", authontication, US.logOut);




