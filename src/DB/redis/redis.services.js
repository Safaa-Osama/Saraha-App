import { redisClient } from "./redis.connect.js"

export const set = async ({ key, value, ttl }) => {
    try {
        const data = typeof value == "string" ? value : JSON.stringify(value);
        return ttl ? await redisClient.set(key.value, ttl) : await redisClient.set(key, value)
    } catch (error) {
        console.log("error to set")
    }
}

export const get = async ({ key = {} }) => {
    try {
        return JSON.parse(await redisClient.get({ key }))
    } catch (error) {
        console.log("error to get")
    }
}

export const exist = async (key) => {
    try {

        return await redisClient.exist(key)
    } catch (error) {
        console.log("error on exist")
    }
}

export const expire = async ({ key, ttl }) => {
    try {

        return await redisClient.exist({ key, ttl })
    } catch (error) {
        console.log("error on expire")
    }
}