import { emailEnum } from "../../common/enum/email.enum.js";
import { redisClient } from "./redis.connect.js"

export const setValue = async ({ key, value, ttl }) => {
    try {
        const data = typeof value === "string" ? value : JSON.stringify(value);
        ttl ? await redisClient.set(key, data, { EX: ttl } ) : await redisClient.set(key, data, )
    } catch (error) {
        console.log("error to set operation")
    }
}

export const getValue = async (key) => {
    try {
        try {
            return JSON.parse(await redisClient.get(key))
        } catch (error) {
            return await redisClient.get(key)
        }
    } catch (error) {
        console.log("error to get operation")
    }
}

export const update = async (key) => {
    try {
        if (!await redisClient.exists(key)) { return 0 }
        return await setValue({ key, value, ttl })
    } catch (error) {
        console.log("error to update operation")
    }
}

export const ttl = async (key) => {
    try {
        return await redisClient.ttl(key)
    } catch (error) {
        console.log("error to get ttl operation")
    }
}

export const exist = async (key) => {
    try {

        return await redisClient.exists(key)
    } catch (error) {
        console.log("error on exist operation")
    }
}

export const expire = async ({ key, ttl }) => {
    try {

        return await redisClient.exist({ key, ttl })
    } catch (error) {
        console.log("error on expire operation")
    }
}

export const delKey = async (key) => {
    try {
        if (!key.length || !key) { return 0 }
        return JSON.parse(await redisClient.del(key))
    } catch (error) {
        console.log("error on delete operation")
    }
}

export const keys = async (pattern) => {
    try {
        return await redisClient.keys(`${pattern}*`)
    } catch (error) {
        console.log("error to get")
    }
}

export const rewvokedKey = ({ userId, jti }) => {
    return `revoke-token::${userId}::${jti}`
}

export const getKey = (userId) => {
    return `revoke-token::${userId}`
}

export const otpKey = ({ email, subject = emailEnum.cofirmEmail }) => {
    return `otp::${email}::${subject}`
}

export const maxOtp = (email) => {
    return `otp::${email}::max_tries`
}

export const blockOtp = (email) => {
    return `otp::${email}::blocked`
}

export const inc = async (key) => {
    try {
        return await redisClient.incr(key)
    } catch (error) {
        console.log("error to increament")
    }
}
