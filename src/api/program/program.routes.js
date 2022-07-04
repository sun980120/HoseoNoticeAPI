import * as express from "express";
import { Router } from 'express'
import { programCtrl } from './program.controller.js'
// import { verifyJWT } from '../../middlewares/auth.middleware'
// import { Controller } from '../../common/interfaces/controller.interface'
import wrap from '../../modules/request.handler.js';

export default class ProgramRoutes {
    path = '/program';
    router = Router();

    constructor() {
        this.initializeRoutes();
    }
    initializeRoutes() {
        const router = Router();
        router
            .get('/all_program', programCtrl.programAll)
            .get('/app_program', programCtrl.programAllApp)
            .get('/myprogram', programCtrl.myprogramAll)
            .delete('/delete_program', programCtrl.deleteProgram)
            .delete('/delete_user_program', programCtrl.deleteUserProgram)
            .post('/write',programCtrl.programWrite)
            .post('/user_answer', programCtrl.programUserAnswer)
        this.router.use(this.path, router);
    }
}