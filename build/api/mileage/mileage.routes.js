import * as express from "express";
import { Router } from 'express';
import { mileageCtrl } from './mileage.controller.js'; // import { verifyJWT } from '../../middlewares/auth.middleware'
// import { Controller } from '../../common/interfaces/controller.interface'

import wrap from '../../modules/request.handler.js';
import { adminVerifyJWT } from "../../middleware/admin.middleware.js";
import { studentVerifyJWT } from "../../middleware/auth.middleware.js";
export class MileageRoutes {
  path = '/mileage';
  router = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    const router = Router();
    router.get('/all', adminVerifyJWT, wrap(mileageCtrl.selectProgram)).get('/detail', adminVerifyJWT, wrap(mileageCtrl.detailProgramUser)).get('/all-app', studentVerifyJWT, wrap(mileageCtrl.selectMileage)).get('/mymileage', studentVerifyJWT, wrap(mileageCtrl.mymileageApp)).get('/semester_mileage', studentVerifyJWT, wrap(mileageCtrl.SemesterMileage)).post('/insert', adminVerifyJWT, wrap(mileageCtrl.insertMileageUser));
    this.router.use(this.path, router);
  }

}