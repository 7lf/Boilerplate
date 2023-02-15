#!/usr/bin/env node
import sanitizedConfig from './config';

import express from 'express';
import bodyParser from 'body-parser';

import process from 'node:process';

import { logger } from './logger';
//-------------------------------------------------------------------
const app = express();
app.disable('x-powered-by'); // disable dark side of this service :)
app.use(express.json()); // support json encoded bodies
// app.use(express.urlencoded()); // support encoded bodies
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

//-------------------------------------------------------------------
import cors from 'cors'; // https://expressjs.com/en/resources/middleware/cors.html
const corsOptions = {
    origin: sanitizedConfig.CORS_ORIGIN, // change this to your domain !
};
app.use(cors(corsOptions));
//-------------------------------------------------------------------
import helmet from 'helmet';
app.use(helmet());
//-------------------------------------------------------------------
import connect from './db';
//-------------------------------------------------------------------
import userRouter from './routes/users';
app.use('/users', userRouter);
//-------------------------------------------------------------------
// Main code
(async () => {
    const DB = await connect();
    if (DB.status !== 'ok') {
        logger.error("Can't connect ro database!: ");
        process.exit(1);
    }
    const server = app
        .listen(sanitizedConfig.APP_PORT)
        .on('listening', () => {
            logger.info('App started at:' + sanitizedConfig.APP_PORT);
        })
        .on('error', error => {
            logger.error(error);
        });

    process.on('SIGTERM', () => {
        logger.info('SIGTERM signal received: closing HTTP server');
        server.close(() => {
            logger.info('HTTP server closed');
        });
    });
})();
//-------------------------------------------------------------------
// process.on('uncaughtException', (err, origin) => {
//     // TODO: write to log
//     // fs.writeSync(process.stderr.fd, `Caught exception: ${err}\n` + `Exception origin: ${origin}`);
// });
// process.on('unhandledRejection', (reason, promise) => {
//     // console.log('Unhandled Rejection at:', promise, 'reason:', reason);
//     // Application specific logging, throwing an error, or other logic here
// });
// server.close(function () {
//     console.log('Doh :(');
// });

// export const delayMillis = (delayMs: number): Promise<void> => new Promise(resolve => setTimeout(resolve, delayMs));

// export const greet = (name: string): string => `Hello ${name}`

// export const foo = async (): Promise<boolean> => {
//   console.log(greet('World'))
//   await delayMillis(1000)
//   console.log('done')
//   return true
// }
