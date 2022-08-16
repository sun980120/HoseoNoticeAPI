import { Router } from 'express';
import { adminVerifyJWT } from '../../middleware/admin.middleware.js';
import wrap from '../../modules/request.handler.js';
import { studentVerifyJWT } from '../../middleware/auth.middleware.js';
import { pushController } from './push.controller.js';

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
            // APP
            .get('/my-push-log', studentVerifyJWT, wrap(pushController.getMyPushLog)) // 나의 알림 목록
        this.router.use(this.path, router);
    }
}