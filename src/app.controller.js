import express from 'express';
import { testDBConnection } from './DB/connection.js';
import { userRouter } from './Modules/user/user.controller.js';
import { PORT } from "../config/config.service.js";
import { messageRouter } from './Modules/message/message.controller.js';
import cors from "cors";
import { redisConnect } from './DB/redis/redis.connect.js';

const app = express();
const bootstrap = () => {

    if (!PORT) {
        throw new Error("PORT is not defined in .env");
    }

    app.use(cors(), express.json());

    app.get('/', (req, res, next) => {
        res.json({ message: 'Hello on Saraha App .....' });
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
