import * as express from "express";
import { Router } from 'express'
import { noticeCtrl } from './notice.controller.js'
// import { verifyJWT } from '../../middlewares/auth.middleware'
// import { Controller } from '../../common/interfaces/controller.interface'
import wrap from '../../modules/request.handler.js';

export default class NoticeRoutes {
    path = '/notice';
    router = Router();

    constructor() {
        this.initializeRoutes();
    }
    initializeRoutes() {
        const router = Router();
        router
            /* Admin-WEB Back-End*/
            .get('/all', noticeCtrl.noticeMain)
            .get('/all/detail', noticeCtrl.noticeDetailweb)
            .get('/all_watch', noticeCtrl.noticeWatch)
            .delete('/delete', noticeCtrl.noticeDelete)
            .get('/write', function(req ,res ,next) {
                res.render('fileupload');
            })
            .post('/write', multer.uploads.array('FILE'), noticeCtrl.noticeWrite)
            /* APP Back-End */
            .get('/all_app', noticeCtrl.noticeMainApp)
            .get('/all_app/detail', noticeCtrl.noticeDetailApp)
            .get('/download', noticeCtrl.downloadFile)
        this.router.use(this.path, router);
    }
}