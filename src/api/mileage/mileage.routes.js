import * as express from "express";
import { Router } from 'express'
import { mileageCtrl } from './mileage.controller.js'
// import { verifyJWT } from '../../middlewares/auth.middleware'
// import { Controller } from '../../common/interfaces/controller.interface'
import wrap from '../../modules/request.handler.js';

export default class MileageRoutes {
    path = '/mileage';
    router = Router();

    constructor() {
        this.initializeRoutes();
    }
    initializeRoutes() {
        const router = Router();
        router
            .get('/all', mileageCtrl.selectProgram)
            .get('/detail', mileageCtrl.detailProgramUser)
            .get('/all-app', mileageCtrl.selectMileage)
            .get('/mymileage', mileageCtrl.mymileageApp)
            .get('/semester_mileage', mileageCtrl.SemesterMileage)
            .post('/insert', mileageCtrl.insertMileageUser)
        this.router.use(this.path, router);
    }
}