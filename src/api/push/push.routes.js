import { Router } from 'express';
import { adminVerifyJWT } from '../../middleware/admin.middleware.js';
import wrap from '../../modules/request.handler.js';
import { studentVerifyJWT } from '../../middleware/auth.middleware.js';
import { pushCtrl } from './push.controller.js';

export class PushRoutes {
    path = '/push';
    router = Router();

    constructor() {
        this.initializeRoutes();
    }
    initializeRoutes() {
        const router = Router();
        router
            // WEB
            .post('/write', adminVerifyJWT, wrap(pushCtrl.addPushLog))
            // APP
            .get('/my-push-log', studentVerifyJWT, wrap(pushCtrl.getMyPushLog)) // 나의 알림 목록
        this.router.use(this.path, router);
    }
}