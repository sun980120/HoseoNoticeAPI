import * as express from "express";
import { Router } from 'express'
import { noticeCtrl } from './notice.controller.js'
import wrap from '../../modules/request.handler.js';
import {uploads} from'../../modules/index.js'
import {studentVerifyJWT} from "../../middleware/auth.middleware.js";
import {adminVerifyJWT} from "../../middleware/admin.middleware.js";

export class NoticeRoutes {
    path = '/notice';
    router = Router();

    constructor() {
        this.initializeRoutes();
    }
    initializeRoutes() {
        const router = Router();
        router
            //APP
            .get('/all-app', studentVerifyJWT, wrap(noticeCtrl.allGroupNoticeApp))
        this.router.use(this.path, router);
    }
}