import * as express from "express";
import { Router } from 'express'
// import { verifyJWT } from '../../middlewares/auth.middleware'
// import { Controller } from '../../common/interfaces/controller.interface'
import wrap from '../../modules/request.handler.js';
import {qnaCtrl} from "./qna.controller.js";

export default class QnaRoutes {
    path = '/qna';
    router = Router();

    constructor() {
        this.initializeRoutes();
    }
    initializeRoutes() {
        const router = Router();
        router
            .get('/', qnaCtrl.qnaMain)
        this.router.use(this.path, router);
    }
}