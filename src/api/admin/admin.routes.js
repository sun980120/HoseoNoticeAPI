import * as express from "express";
import { Router } from 'express'
// import { verifyJWT } from '../../middlewares/auth.middleware'
// import { Controller } from '../../common/interfaces/controller.interface'
import wrap from '../../modules/request.handler.js';
// const adminController = require('../controllers/adminController');
import {adminCtrl} from './admin.controller.js'
import {adminVerifyJWT} from "../../middleware/admin.middleware.js";

export class AdminRoutes {
    path = '/admin';
    router = Router();

    constructor() {
        this.initializeRoutes();
    }
    initializeRoutes() {
        const router = Router();
        router
            .get('/logout',adminVerifyJWT, wrap(adminCtrl.logout))
            .get('/list',adminVerifyJWT,wrap(adminCtrl.adminList))
            .post('/login', wrap(adminCtrl.adminLogin))// 임시 DB 로그인
            .post('/loginOracle', wrap(adminCtrl.adminLoginOracle))// 학교 DB 로그인
            .post('/update_level',adminVerifyJWT, wrap(adminCtrl.adminLevelUpdate))

        this.router.use(this.path, router);
    }
}