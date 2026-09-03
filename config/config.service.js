import { config } from "dotenv";
import { resolve } from "node:path";

let envPath = {
    development: resolve("config/.env.development"),
    production: resolve("config/.env.production")
}
config({
    path: envPath[process.env.NODE_ENV]
});

let PORT = process.env.PORT;
// let PRIVATE_KEY = process.env.PRIVATE_KEY;
// let PREFIX = process.env.PREFIX
let DB_URI = process.env.DB_URI;
// let DB_URI_ONLINE = process.env.DB_URI_ONLINE
// let CLIENT_ID = process.env.CLIENT_ID
// let SALT_ROUND = process.env.SALT_ROUND
// let CLOUD_KEY = process.env.CLOUD_KEY
// let CLOUD_NAME = process.env.CLOUD_NAME
// let CLOUD_SECRET = process.env.CLOUD_SECRET
// let REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY
// let REDIS_URI = process.env.REDIS_URI
// let EMAIL = process.env.EMAIL
// let PASS = process.env.PASS
// let TOEMAIL = process.env.TOEMAIL
// let ORIGINS = process.env.ORIGINS.split(",") || []

export {
PORT,
DB_URI
};
