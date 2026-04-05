import { Router } from "express"
import * as US from "./user.services.js"
import { authontication } from "../../common/middleware/authontication.js";
import { joiValidator } from "../../common/middleware/joi.validator.js";
import * as UV from "./user.schema.js";
import { multer_cloud, multer_local } from "../../common/middleware/multer.js";
import { multerEnum } from "../../common/enum/multer.enum.js";
import { messageRouter } from "../message/message.controller.js";


export const userRouter = Router({
    caseSensitive: true,
    strict: true,
});

userRouter.use("/:userId/messages", messageRouter)
userRouter.get("/", US.getAllUsers);


userRouter.post("/sign-up",
    multer_cloud(multerEnum.image).single("attachment"),
    joiValidator(UV.signUpSchema),
    US.signUp1);

userRouter.post('/sign-up2',
    multer_local({ customPath: "users", customType: multerEnum.image }).array("attachments", 3),
    joiValidator(UV.signUpSchema),
    US.signUp2);


userRouter.post('/signup/gmail',
    // joiValidator(UV.signUpGoogleSchema),
    US.signUpWithGoogle);


userRouter.post('/sign-in',
    joiValidator(UV.signInSchema),
    US.signIn);

userRouter.get("/confirm",
    joiValidator(UV.otpSchema),
    US.confirmEmail)

userRouter.get("/resend",
    joiValidator(UV.mailSchema),
    US.resendOTP)

userRouter.get("/logOut", authontication, US.logOut);

userRouter.get("/profile", authontication, US.getProfile);
userRouter.patch("/profile",
    joiValidator(UV.updateProfileSchema)
    , authontication,
    US.updateProfile);

userRouter.patch("/profile/password",
    joiValidator(UV.updatePasswordSchema)
    , authontication,
    US.updatePassword);

userRouter.patch("/profile/forget",
    joiValidator(UV.mailSchema)
    , US.forgetPassword);

userRouter.patch("/profile/reset",
    joiValidator(UV.resetPassSchema)
    , US.resetPassword);

userRouter.get("/profile/:id",
    joiValidator(UV.shareProfileSchema),
    US.shareProfile);


userRouter.get("/refreshToken", US.refreshToken);





