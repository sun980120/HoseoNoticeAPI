import * as express from "express";
import { Router } from 'express';
import { programCtrl } from './program.controller.js'; // import { verifyJWT } from '../../middlewares/auth.middleware'
// import { Controller } from '../../common/interfaces/controller.interface'

import wrap from '../../modules/request.handler.js';
import { adminVerifyJWT } from "../../middleware/admin.middleware.js";
import { studentVerifyJWT } from "../../middleware/auth.middleware.js";
export class ProgramRoutes {
  path = '/program';
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    const router = Router();
    router.get('/all_program', adminVerifyJWT, wrap(programCtrl.programAll)).get('/app_program', studentVerifyJWT, wrap(programCtrl.programAllApp)).get('/myprogram', studentVerifyJWT, wrap(programCtrl.myprogramAll)).delete('/delete_program', adminVerifyJWT, wrap(programCtrl.deleteProgram)).delete('/delete_user_program', studentVerifyJWT, wrap(programCtrl.deleteUserProgram)).post('/write', adminVerifyJWT, wrap(programCtrl.programWrite)).post('/user_answer', studentVerifyJWT, wrap(programCtrl.programUserAnswer));
    this.router.use(this.path, router);
  }

}