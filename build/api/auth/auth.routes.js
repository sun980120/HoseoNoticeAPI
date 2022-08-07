import * as express from "express";
import { Router } from 'express';
import { authCtrl } from './auth.controller.js'; // import { verifyJWT } from '../../middlewares/auth.middleware'
// import { Controller } from '../../common/interfaces/controller.interface'

import wrap from '../../modules/request.handler.js';
import { studentVerifyJWT } from "../../middleware/auth.middleware.js";
export class AuthRoutes {
  path = '/auth';
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    const router = Router();
    router.get('/logout', studentVerifyJWT, wrap(authCtrl.logout)).put('/push-message', studentVerifyJWT, wrap(authCtrl.AppPush)).post('/login', wrap(authCtrl.loginP)) //학교DB 아닌 임시 DB로 로그인
    .post('/loginOracle', wrap(authCtrl.loginOracle)) //학교 oracleDB연동한 로그인 (237서버에서만 접근가능)
    .post('/check_accept', wrap(authCtrl.acceptP));
    this.router.use(this.path, router);
  }

}