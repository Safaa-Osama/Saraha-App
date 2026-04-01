import userModel from "../../DB/models/user.Model.js";
import * as db_services from "../../DB/db.services.js"
import { decrypt, encrypt } from "../../common/utilis/security/crypto.security.js";
import { succesRresponse } from "../../common/utilis/response.success.js";
import { providerEnum } from "../../common/enum/user.enum.js";
import { compare, hash } from "../../common/utilis/security/hash.security.js";
import { generateToken } from "../../common/utilis/token.service.js";
import { OAuth2Client } from 'google-auth-library';
import * as CS from "../../../config/config.service.js";
import cloudinary from "../../common/utilis/cloudinary/cloudinary.js";
import { generateOtp, sendMail } from "../../common/utilis/emailServices/sendMail.js";
import { eventEmitter } from "../../common/utilis/emailServices/email.event.js";
import { emailTemplete } from "../../common/utilis/emailServices/email.templete.js";
import * as redis from "../../DB/redis/redis.services.js";
import { randomUUID } from "node:crypto";
import { emailEnum } from "../../common/enum/email.enum.js";
import { globalAgent } from "node:http";


//PROFILE PICTURE
export const signUp1 = async (req, res, next) => {
    const { userName, email, password, cpassword, age, gender, phone } = req.body;

    if (password !== cpassword) {
        throw new Error("invalid password", { cause: 400 })
    }

    if (await db_services.findOne({
        model: userModel,
        filter: { email }
    })
    ) {
        throw new Error("Email already exist", { cause: 409 })
    }
    if (!req.file ) {
        throw new Error("wrong attachments");
    }

    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        use_filename: true,
        unique_filename: false
    })

    const user = await db_services.create({
        model: userModel,
        data: {
            userName, email, age, gender,
            password: hash({ text: password, salt_round: Number(CS.SALT_ROUND) }),
            phone: encrypt(phone),
            profilePicture: { secure_url, public_id },
        }
    })

    const otp = await generateOtp();
    eventEmitter.emit(emailEnum.cofirmEmail, async () => {
        await sendMail({
            to: email,
            subject: "Welcome to Saraha-App",
            html: emailTemplete(otp)
        })
    }
    )

    await redis.setValue({
        key: redis.otpKey({ email, subject: emailEnum.cofirmEmail }),
        value: hash({ text: `${otp}` }),
        ttl: 60 * 3
    });
    await redis.setValue({
        key: redis.maxOtp(email),
        value: 1,
        ttl: 60
    });

    succesRresponse({ res, status: 201, message: "success signUp", data: { user, otp } });
}

export const sendEmailOtp = async ({ email, subject }) => {

    const isBlocked = await redis.ttl(redis.blockOtp(email))
    if (isBlocked && isBlocked > 0) {
        throw new Error(`You are blocked, Try again after ${isBlocked} seconds`)
    }
    console.log(await redis.blockOtp(email))

    const ttl = await redis.ttl(redis.otpKey({ email, subject }));
    if (ttl > 0) {
        throw new Error(`can not sent OTP after ${ttl} seconds`)
    }

    const maximumOtp = await redis.getValue(redis.maxOtp(email))
    if (maximumOtp > 3) {
        await redis.setValue({ key: redis.blockOtp(email), value: 1, ttl: 60 * 3 })
        throw new Error("you have exceeded the maximum number of tries")
    }

    const otp = await generateOtp();
    eventEmitter.emit(emailEnum.cofirmEmail, async () => {
        await sendMail({
            to: email,
            subject: "Welcome to Saraha-App",
            html: emailTemplete(otp)
        })
    }
    )

    await redis.setValue({
        key: redis.otpKey({ email, subject }),
        value: hash({ text: `${otp}` }),
        ttl: 60 * 3
    });
    await redis.inc(redis.maxOtp(email))
}

export const confirmEmail = async (req, res, next) => {
    const { email, otp } = req.body
    const otpExist = await redis.getValue(redis.otpKey({ email, subject: emailEnum.cofirmEmail }))
    if (!otpExist) {
        throw new Error("Expired OTP")
    }

    if (!compare({ text: otp, cipherTxt: otpExist })) {
        throw new Error("Invalid OTP")
    }

    const user = db_services.findAndUpdate({
        model: userModel,
        filter: { email, confirmedEmail: { $exists: false }, provider: providerEnum.system },
        update: { confirmedEmail: true }
    })
    if (!user) {
        throw new Error("User is not exist")
    }
    await redis.delKey(redis.otpKey({ email, subject: emailEnum.cofirmEmail }))

    succesRresponse({ res, message: "Email confirmed", data: user })
}

export const resendOTP = async (req, res, next) => {

    const { email } = req.body

    const user = db_services.findOne({
        model: userModel,
        filter: { email, confirmedEmail: { $exists: false }, provider: providerEnum.system }
    })

    if (!user) {
        throw new Error("User is not exist or Emial is not confirmed")
    }

    await sendEmailOtp({ email, subject: emailEnum.cofirmEmail })

    succesRresponse({ res, message: "Otp send again" })
}
//COVER PICTURES
export const signUp2 = async (req, res, next) => {
    const { userName, email, password, cpassword, age, gender, phone } = req.body;

    if (password !== cpassword) {
        throw new Error("invalid password", { cause: 400 })
    }

    if (await db_services.findOne({
        model: userModel,
        filter: { email }
    })) {
        throw new Error("Email already exist", { cause: 409 })
    }

    if (!req.files || req.files.length === 0) {
        throw new Error("wrong attachments");
    }

    let paths = []
    for (const file of req.files) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
            use_filename: true,
            unique_filename: false
        });
        paths.push({ secure_url, public_id });
    }

    const user = await db_services.create({
        model: userModel,
        data: {
            userName, email, age, gender,
            password: hash({ text: password, salt_round: 10 }),
            phone: encrypt(phone),
            coverPictures: paths

        }
    });
    succesRresponse({ res, status: 201, data: user });
}


export const signUpWithGoogle = async (req, res, next) => {
    const { idToken } = req.body;

    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
        idToken,
        audience: CLIENT_ID
    });
    const payload = ticket.getPayload();
    const { email, email_verified, name, picture } = payload;

    let user = await db_services.findOne({ model: userModel, filter: { email } });

    if (!user) {
        const user_name = name.split(" ");

        const firstName = user_name[0];
        const lastName = user_name.slice(1).join(" ");
        user = await db_services.create({
            model: userModel,
            data: {
                email,
                confirmedEmail: email_verified,
                firstName, lastName,
                profilePicture: picture,
                provider: providerEnum.google
            }
        })
    }

    if (user.provider == providerEnum.system) {
        throw new Error("google")
    }

    const accessToken = generateToken({
        payload: {
            id: user._id, email: user.email
        },
        secretKey: PRIVATE_KEY,
        option: { expiresIn: '1h' }
    })

    succesRresponse({ res, data: { accessToken, user } })
}

export const signIn = async (req, res, next) => {
    const { email, password } = req.body;

    let user = await db_services.findOne({
        model: userModel,
        filter: {
            email,
            provider: providerEnum.system,
            confirmedEmail: { $exists: true }
        }
    })
    if (!user) {
        throw new Error(" user not exist or invalid provider", { cause: 400 })
    }

    if (!(compare({ text: password, cipherTxt: user.password }))) {
        throw new Error("invalid password", { cause: 400 })
    }

    const uuid = randomUUID()
    let accessToken = generateToken({
        payload: {
            id: user._id,
            email: user.email,
        },
        secretKey: CS.PRIVATE_KEY,
        option: {
            expiresIn: 60 * 10,
            jwtid: uuid
        }
    })

    let refreshToken = generateToken({
        payload: {
            id: user._id,
            email: user.email,
        },
        secretKey: CS.REFRESH_SECRET_KEY,
        option: { expiresIn: '1y', jwtid: uuid }
    })
    succesRresponse({ res, data: { accessToken, refreshToken } });

}

export const logOut = async (req, res, next) => {

    const { flag } = req.query;

    if (flag == "all") {
        req.user.changeCredential = new Date();
        req.user.save();

        await redis.delKey(await redis.keys(redis.getKey(req.user._id)))

    } else {
        await redis.setValue({
            key: redis.rewvokedKey({ userId: req.user._id, jti: req.decoded.jti }),
            value: `${req.decoded.jti}`,
            ttl: req.decoded.exp - Math.floor(Date.now() / 1000)
        })
    }

    succesRresponse({ res })
}


export const getAllUsers = async (req, res, next) => {
    const users = await db_services.findAll(userModel, "firstName lastName gender provider age")
    succesRresponse({ res, data: users });
}

export const getProfile = async (req, res, next) => {
    const key = `profile::${req.user._id}`
    const userExist = await redis.getValue(key)

    if (userExist) {
        succesRresponse({ res, data: userExist })
    }
    await redis.setValue({ key, value: req.user, ttl: 60 * 2 })

    succesRresponse({ res, data: { ...req.user._doc, phone: decrypt(req.user.phone) } })
}

export const shareProfile = async (req, res, next) => {
    const { id } = req.params;
    const user = await db_services.findById({
        model: userModel,
        id,
    })

    if (!user) {
        throw new Error("User not found")
    }

    user.phone = decrypt(user.phone)
    succesRresponse({ res, data: user })
}


export const refreshToken = async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        throw new Error("token is required")
    }
    const decoded = verifyToken({
        token: authorization.split(" ")[1],
        secretKey: REFRESH_SECRET_KEY
    })

    if (!decoded || !decoded.id) {
        throw new Error("invalid token !")
    }

    const user = await db_services.findOne({
        model: userModel,
        filter: { _id: decoded.id }
    })

    if (!user) {
        throw new Error("user not Exist !", { cause: 400 })

    }

    let accessToken = generateToken({
        payload: {
            id: user._id,
            email: user.email,
        },
        secretKey: PRIVATE_KEY,
        option: {
            expiresIn: 60 * 5
        }
    })
    succesRresponse({ res, data: accessToken });

}

// UPDATES
export const updateProfile = async (req, res, next) => {
    let { firstName, lastName, phone, gender } = req.body
    if (phone) {
        phone = encrypt(phone);
    }

    const user = await db_services.updateOne({
        model: userModel,
        filter: { _id: req.user.id },
        update: { firstName, lastName, gender, phone }
    })

    if (!user) {
        throw new Error("user is not exist")
    }


    succesRresponse({ res, data: user })
}
export const updatePassword = async (req, res, next) => {
    let { newPassword, oldPassword, confirmPassword } = req.body

    if (!compare({ text: oldPassword, cipherTxt: req.user.password })) {
        throw new Error("invalid old password")
    }

    const hashed = hash({ text: newPassword, salt_round: CS.SALT_ROUND })
    newPassword = hashed
    req.user.changeCredential = new Date()
    await req.user.save()

    succesRresponse({ res })
}

export const forgetPassword = async (req, res, next) => {
    const { email } = req.body;

    let user = await db_services.findOne({
        model: userModel,
        filter: {
            email,
            provider: providerEnum.system,
            confirmedEmail: { $exists: true }
        }
    })
    if (!user) {
        throw new Error(" user not exist or invalid provider", { cause: 400 })
    }

    await sendEmailOtp({ email, subject: emailEnum.forgetPass })



    succesRresponse({ res, data: user });
}


export const resetPassword = async (req, res, next) => {
    const { email, otp, password } = req.body;

    const otpValue = await redis.getValue(redis.otpKey({ email, subject: emailEnum.forgetPass }))
    if (!otpValue) {
        throw new Error("OTP expired")
    }
    if (!compare({ text: otp, cipherTxt: otpValue })) {

    }

    let user = await db_services.findAndUpdate({
        model: userModel,
        filter: {
            email,
            provider: providerEnum.system,
            confirmedEmail: { $exists: true }
        },
        update: {
            password: await hash({ text: password }),
            changeCredential: new Date()
        }
    })
    if (!user) {
        throw new Error(" user not exist or invalid provider", { cause: 400 })
    }

    await redis.delKey(redis.otpKey({email,subject:emailEnum.forgetPass}))

    succesRresponse({ res, data: user });
}