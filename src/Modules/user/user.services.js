import userModel from "../../DB/models/user.Model.js";
import * as db_services from "../../DB/db.services.js"
import { decrypt, encrypt } from "../../common/utilis/security/crypto.security.js";
import { succesRresponse } from "../../common/utilis/response.success.js";
import { providerEnum } from "../../common/enum/user.enum.js";
import { compare, hash } from "../../common/utilis/security/hash.security.js";
import { generateToken } from "../../common/utilis/token.service.js";
import { OAuth2Client } from 'google-auth-library';
import { CLIENT_ID, PRIVATE_KEY, REFRESH_SECRET_KEY, SALT_ROUND } from "../../../config/config.service.js";
import cloudinary from "../../common/utilis/cloudinary/cloudinary.js";
import rondomuid from "crypto"
import invokeTokenModel from "../../DB/models/invoke.Model.js";
import { generateOtp, sendMail } from "../../common/utilis/sendMail.js";

//profile picture
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

    if (!req.file) {
        throw new Error("wrong attachments")
    }

    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
        use_filename: true,
        unique_filename: false
    })
    const user = await db_services.create({
        model: userModel,
        data: {
            userName, email, age, gender,
            password: hash({ text: password, salt_round: SALT_ROUND}),
            phone: encrypt(phone),
            profilePicture: { secure_url, public_id }

        }
    });

    const otp = await generateOtp();
    await sendMail({
        to: email,
        subject:"Welcome to Saraha-App",
        html:`<h1>Hello ${userName}<h1>
        <p>welcome to saraha app your otp is ${otp}<p>`
    })
    succesRresponse({ res, status: 201, message:"success signUp",data: user });
}

//cover pictures
export const signUp2 = async (req, res, next) => {
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

    if (!req.files.length > 0) {
        throw new Error("wrong attachments")
    }

    let paths = []
    for (const file of req.files) {
        paths.push(file.path)
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

export const signUp3 = async (req, res, next) => {
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

    if (!req.files) {
        throw new Error("wrong attachments")
    }

    let paths = []
    for (const file of req.files.attachments) {
        paths.push(file.path)
    }

    const user = await db_services.create({
        model: userModel,
        data: {
            userName, email, age, gender,
            password: hash({ text: password, salt_round: 10 }),
            phone: encrypt(phone),
            profilePicture: req.files.attachment[0].path,
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
        filter: { email, provider: providerEnum.system }
    })
    if (!user) {
        throw new Error(" user not exist ", { cause: 400 })
    }

    if (!(compare({ text: password, cipherTxt: user.password }))) {
        throw new Error("invalid password", { cause: 400 })
    }

    user = await db_services.updateOne({
        model: userModel,
        filter: { _id: user._id },
        options:
            { $inc: { profileViews: 1 } },

    })

    const uuid = rondomuid();
    let accessToken = generateToken({
        payload: {
            id: user._id,
            email: user.email,
        },
        secretKey: PRIVATE_KEY,
        option: {
            expiresIn: '1h', jwtid:uuid
        }
    })

    let refreshToken = generateToken({
        payload: {
            id: user._id,
            email: user.email,
        },
        secretKey: REFRESH_SECRET_KEY,
        option: { expiresIn: '1y' , jwtid:uuid}
    })
    succesRresponse({ res, data: { userToken: accessToken, userdata: user, refreshToken } });

}



export const getAllUsers = async (req, res, next) => {
    const users = await db_services.findAll(userModel, "firstName lastName gender provider age")
    succesRresponse({ res, data: users });
}

export const getProfile = async (req, res, next) => {

    succesRresponse({ res, data: { ...req.user._doc, phone: decrypt(req.user.phone) } })
}

// export const refreshToken = async (req, res, next) => {
//     const { authorization } = req.headers;
//     if (!authorization) {
//         throw new Error("token is required")
//     }
//     const decoded = verifyToken({
//         token: authorization.split(" ")[1],
//         secretKey: REFRESH_SECRET_KEY
//     })

//     if (!decoded || !decoded.id) {
//         throw new Error("invalid token !")
//     }

//     const user = await db_services.updateOne({
//         model: userModel,
//         filter: { _id: decoded.id }
//     })

//     if (!user) {
//         throw new Error("user not Exist !", {cause:400})

//     }

//     const accessToken = generateToken({
//         payload: {
//             id: user._id,
//             email: user.email,
//         },
//         secretKey: PRIVATE_KEY,
//         option: { expiresIn: 60*5 }
//     })
//        const refreshToken = generateRefreshToken({
//         payload: {
//             id: user._id,
//             email: user.email,
//         },
//         secretKey: REFRESH_SECRET_KEY,
//         option: { expiresIn: 60*5 }
//     })
//     generateRefreshToken

//     succesRresponse({ res, data: { userToken: accessToken, refreshToken: refreshToken } });

// }

export const logOut = async (req, res, next) => {

    const { flag } = req.query;

    //ALL DEVICES
    if (flag == "all") {
        req.user.changeCredential = new Date();
        req.user.save();

        await db_services.deleteMany({
            model:userModel,
            filter: {userId:req.user._id}
        })

    } else { //ONE DEVICE
        await db_services.create({
            model:invokeTokenModel,
            data:{
                tokenId:req.decoded.jwt,
                userId:req.user._id,
                expireAt: new Date(req.decoded.exp * 1000)
            }
        })
    }

    succesRresponse({ res })
}
