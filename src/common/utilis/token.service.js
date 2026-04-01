import jwt from "jsonwebtoken"


export const generateToken = ({ payload, secretKey, option = {} }) => {
    return jwt.sign(payload, secretKey, option)
}
export const verifyToken = ({ token, secretKey, option = {} }) => {
    return jwt.verify(token, secretKey, option)
}




