import userModel from "../../DB/models/user.Model.js";
import { authontication } from "./authontication.js";
import * as db_service from "../../DB/db.services.js"



export const authorization = function (role) {
    async (req, res, next) => {

        if (!role.includes(req.user.role)) {
            throw new error("UnAuthorized");
        }
        next();
    }
}
