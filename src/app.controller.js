import express from 'express';
import { testDBConnection } from './DB/connection.js';
import { userRouter } from './Modules/user/user.controller.js';
import { PORT } from "../config/config.service.js";
import { messageRouter } from './Modules/message/message.controller.js';
import cors from "cors";
import { redisConnect } from './DB/redis/redis.connect.js';
import helmet from "helmet";
import { rateLimit } from 'express-rate-limit'

const app = express();


const bootstrap = async () => {

    if (!PORT) {
        throw new Error("PORT is not defined in .env");
    }

    const corsOption = {
        origin: function (ORIGINS, callback) {
            if ([...ORIGINS, undefined].includes(origin)) {
                callback(null, true)
            } else {
                callback(new Error("Not Allowed by core"))
            }
        }
    }
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 10,
        message: "too many request, come back after 15 min",
        legacyHeaders: false,
    })
    app.use(
        cors(corsOption),
        helmet(),
        limiter,
        express.json()
    );

    app.get('/', (req, res, next) => {
        res.json({ message: 'Welcome to Saraha App .....' });
    });

    testDBConnection();
    redisConnect();

    app.use("/uploads", express.static("uploads"))

    app.use('/users', userRouter);
    app.use('/messages', messageRouter);

    app.use('{/*demo}', (req, res, next) => {
        throw new Error(`URL "${req.originalUrl}" NOT FOUND`)
    });

    app.use((err, req, res, next) => {
        return res.status(err.cause || 500).json({
            message: err.message,
            srack: err.stack
            //      stack: envPath == development? err.stack : null
        });
    });

    app.listen(PORT, () =>
        console.log(`Your app listening at ${PORT}`)
    );
};


export default bootstrap;
