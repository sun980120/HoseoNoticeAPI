import * as express from "express";
import { Router } from 'express'
import { noticeCtrl } from './old_notice.controller.js'
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
        /* Admin-WEB Back-End*/
        // .get('/all', adminVerifyJWT, wrap(noticeCtrl.noticeMain))
        // .get('/all/detail', adminVerifyJWT, wrap(noticeCtrl.noticeDetailweb))
        // .get('/all-watch', adminVerifyJWT, wrap(noticeCtrl.noticeWatch))
        // .delete('/delete', adminVerifyJWT, wrap(noticeCtrl.noticeDelete))
        // .get('/write', function(req ,res ,next) {
        //     res.render('fileupload');
        // })
        // .post('/write', adminVerifyJWT, uploads.array('FILE'), wrap(noticeCtrl.noticeWrite))
        // /* APP Back-End */
        // .get('/app-all', studentVerifyJWT, wrap(noticeCtrl.noticeMainApp))
        // .get('/app-all/detail', studentVerifyJWT, wrap(noticeCtrl.noticeDetailApp))
        // .get('/download', wrap(noticeCtrl.downloadFile))
        this.router.use(this.path, router);
    }
}