import { succesRresponse } from "../../common/utilis/response.success.js";
import * as db_service from "../../DB/db.services.js";
import messageModel from "../../DB/models/message.model.js";
import userModel from "../../DB/models/user.Model.js"

export const getAllMessges = async (req, res, next) => {
    const messages = await db_service.findAll({model:messageModel})
    succesRresponse({ res, data: messages })
}

export const sendMessage = async (req, res, next) => {
    const { content, userId } = req.body

    const user = await db_service.findById({
        model: userModel,
        id: userId
    })

    if (!user) {
        throw new Error("User is not exist")
    }

    let paths = []
    if (req.files.length > 0) {
        for (const file of req.files) {
            paths.push(file.path)
        }
    }

    const message = db_service.create({
        model: messageModel,
        data: {
            content, userId: user.id, attachments: paths
        }
    })

    succesRresponse({ res, status: 201, data: message })
}

export const getMessges = async (req, res, next) => {
    const messages = await db_service.findAll({
        model: messageModel,
        filter: { userId: req.params.userId }
    })
    succesRresponse({ res, status: 200, data: messages })
}
