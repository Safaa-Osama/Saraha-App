import jwt from "jsonwebtoken"


export const generateToken = ({ payload, secretKey, option = {} }) => {
    return jwt.sign(payload, secretKey, option)
}
export const verifyToken = ({ acsessToken, secretKey, option = {} }) => {
    return jwt.verify(acsessToken, secretKey, option)
}




