import * as express from "express";
import { Router } from 'express'
import { agreementCtrl } from './agreement.controller.js'
// import { verifyJWT } from '../../middlewares/auth.middleware'
// import { Controller } from '../../common/interfaces/controller.interface'
import wrap from '../../modules/request.handler.js';

export default class AgreementRoutes {
    path = '/agreement';
    router = Router();

    constructor() {
        this.initializeRoutes();
    }
    initializeRoutes() {
        const router = Router();
        router
            .get('/write', function(req, res, next) {
                res.render('agreement', { title: 'agreement' });
            })
            .get('/read_one', wrap(agreementCtrl.read_agreement))
            .post('/write', wrap(agreementCtrl.make_agreement))
        this.router.use(this.path, router);
    }
}