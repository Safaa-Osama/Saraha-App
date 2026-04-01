import { PREFIX, PRIVATE_KEY } from "../../../config/config.service.js";
import { verifyToken } from "../utilis/token.service.js";
import * as db_services from "../../DB/db.services.js"
import userModel from "../../DB/models/user.Model.js";
import { getValue, rewvokedKey } from "../../DB/redis/redis.services.js";


export const authontication = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        throw new Error("invalid authorization");
    }

    const decoded = verifyToken({
        token: authorization.split(" ")[1],
        secretKey: PRIVATE_KEY
    })

    if (!decoded || !decoded?.id) {
        throw new Error("invalid authorization !")
    }

    const user = await db_services.findOneSelect({
        model: userModel,
        filter: { _id: decoded.id },
    });

    if (!user) {
        throw new Error("user not found", { cause: 400 })
    }
    req.user = user
    req.decoded = decoded

    if (user?.changeCredential?.getTime() > decoded.iat * 1000) {
        throw new Error("Invalid Token")
    }

    const revokeToken = await getValue(rewvokedKey({userId:user._id, jti:decoded.jti}))
    if (revokeToken) {
        throw new Error("Invalid Token revoked")
    }

    next();
}

