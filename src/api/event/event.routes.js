import * as express from "express";
import { Router } from 'express'
import { eventCtrl } from './event.controller.js'
// import { verifyJWT } from '../../middlewares/auth.middleware'
// import { Controller } from '../../common/interfaces/controller.interface'
import wrap from '../../modules/request.handler.js';

export default class EventRoutes {
    path = '/event';
    router = Router();

    constructor() {
        this.initializeRoutes();
    }
    initializeRoutes() {
        const router = Router();
        router
            .get('/', eventCtrl.eventMain) //해당 이벤트
            .get('/all_event', eventCtrl.eventAll) //모든 이벤트
            .post('/event_write', eventCtrl.eventWrite)  //이벤트 추가
            .post('/event_update', eventCtrl.eventUpdate)  //이벤트 수정
            .post('/event_enrolled', eventCtrl.eventEnrolled)  //문제 등록 여부 수정
            .post('/event_checked', eventCtrl.eventChecked)  //상품 증정 여부 수정
            .delete('/event_delete', eventCtrl.eventDelete)  //이벤트 삭제
        this.router.use(this.path, router);
    }
}