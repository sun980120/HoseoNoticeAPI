import { Router } from 'express';
import wrap from '../../modules/request.handler.js';
import { groupController as groupCtrl } from './group.controller.js';
import { studentVerifyJWT } from '../../middleware/auth.middleware.js';
import { adminVerifyJWT } from '../../middleware/admin.middleware.js';

export class GroupRoutes {
    path = '/group';
    router = Router();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes() {
        const router = Router();
        router
            // Web
            .get('/all-group', adminVerifyJWT, wrap(groupCtrl.allGroupList))
            .post('/create-group', adminVerifyJWT, wrap(groupCtrl.createGroup))
            // App
            .get('/my-group-list', studentVerifyJWT, wrap(groupCtrl.getMyGroup))
            .post('/add-group', studentVerifyJWT, wrap(groupCtrl.addGroup))
            .delete('/delete-my-group', studentVerifyJWT, wrap(groupCtrl.deleteMyGroup))
            .get('/all-group-list', studentVerifyJWT, wrap(groupCtrl.allGroupList))

        this.router.use(this.path, router);
    }
}