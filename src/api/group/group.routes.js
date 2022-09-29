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
            .get('/all-group-web', adminVerifyJWT, wrap(groupCtrl.allGroupList))            // 모든 그룹 목록
            .get('/admin-group-list', adminVerifyJWT, wrap(groupCtrl.getMyGroup))           // 관리자 그룹 목록
            .post('/create-group', adminVerifyJWT, wrap(groupCtrl.createGroup))             // 관리자 그룹 새성
            .post('/admin-group-call', adminVerifyJWT, wrap(groupCtrl.adminGroupCall))      // 관리자 그룹 신규 요청
            .get('/admin-group-call-list', adminVerifyJWT, wrap(groupCtrl.adminGroupCallList))  // 관리자 그룹 신청 리스트
            .put('/admin-group-accept', adminVerifyJWT, wrap(groupCtrl.adminGroupAccept))   // 관리자 그룹 권한 부여
            .put('/admin-group-delete', adminVerifyJWT, wrap(groupCtrl.adminGroupDelete))   // 관리자 그룹 삭제
            .delete('/delete-group', adminVerifyJWT, wrap(groupCtrl.deleteGroup))           // 그룹 삭제
            // App
            .get('/all-group-app', studentVerifyJWT, wrap(groupCtrl.allGroupList))          // 모든 그룹 목록
            .get('/user-group-list', studentVerifyJWT, wrap(groupCtrl.getMyGroup))          // 사용자 그룹 목록
            .post('/add-group', studentVerifyJWT, wrap(groupCtrl.addGroup))                 // 사용자 그룹 추가
            .delete('/delete-my-group', studentVerifyJWT, wrap(groupCtrl.deleteMyGroup))    // 사용자 그룹 제거

        this.router.use(this.path, router);
    }
}