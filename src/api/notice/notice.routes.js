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
            // WEB
            .get('/write', adminVerifyJWT, uploads.array('img'), wrap(noticeCtrl.writeNotice))  // 그룹에 공지사항 작성
            // APP
            .get('/all-app', studentVerifyJWT, wrap(noticeCtrl.allGroupNoticeApp))  // 그룹의 모든 공지사항
            .get('/detail', studentVerifyJWT, wrap(noticeCtrl.detailNotice))        // 그룹의 공지사항 상세보기
        this.router.use(this.path, router);
    }
}