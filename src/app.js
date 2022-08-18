import express from 'express';
import { Router } from 'express';
import session from 'express-session';
import { errorMiddleware } from './middleware/error.middleware.js';
import 'dotenv/config';
import { Server_Port } from './configENV.js';
import cookieParser from 'cookie-parser';

export default class App {
    app;
    constructor(routes) {
        this.app = express();

        this.initializeMiddlewares();
        this.initializeControllers(routes);
        this.initializeErrorHandling();
    }

    listen() {
        this.app.listen(Server_Port, () => {
            console.log("DB CONNECTION SUCCESS")
            console.log(`SERVER RUN TO ${Server_Port}`);
        });
    }

    getServer() {
        return this.app;
    }

    initializeMiddlewares() {
        this.app.use(express.json());
        this.app.use(
            session({
                name: 'prgrms.sid',
                secret: 'keyboard cat',
                resave: false,
                saveUninitialized: true,
            }),
        );
        this.app.use(cookieParser());
        // this.app.use(csrf());
        // this.app.use(verifyJWT);
    }

    initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }

    initializeControllers(routes) {
        const router = Router();

        router.get('/', (req, res) => {res.send('Sever Is Running !!!')});

        routes.forEach((route) => {
            router.use(route.router);
        });

        this.app.use('/api', router);
    }
}