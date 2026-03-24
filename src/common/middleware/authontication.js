import { PRIVATE_KEY } from "../../../config/config.service.js";
import { verifyToken } from "../utilis/token.service.js";
import * as db_services from "../../DB/db.services.js"
import userModel from "../../DB/models/user.Model.js";
import invokeTokenModel from "../../DB/models/invoke.Model.js";


export const authontication = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        throw new Error("invalid authorization");
    }

    const decoded = verifyToken({
        token: authorization.split(" ")[1],
        secretKey: PRIVATE_KEY
    })

    if (!decoded) {
        throw new Error("invalid authorization !")
    }

    const user = await db_services.findOneSelect({
        model: userModel,
        filter: { _id: decoded.id },
        fields: "-password"
    });


    if (!user) {
        throw new Error("user not found", { cause: 400 })
    }
    req.user = user
    req.decoded = decoded


    if (user?.changeCredential?.getTime > decoded.iat * 1000) {
        throw new Error("Invalid Token")
    }

    const revoked = await db_services.findOne({
        model: invokeTokenModel,
        filter: { tokenId: decoded.jti }
    })

    if (revoked) {
        throw new Error("Invalid Token")
    }

    next();
}