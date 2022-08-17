import {Router} from "express";
import {studentVerifyJWT} from "../../middleware/auth.middleware.js";
import {surveyCtrl} from "./survey.controller.js";
import { adminVerifyJWT } from '../../middleware/admin.middleware.js';

export class SurveyRoutes {
    path = '/survey';
    router = Router();

    constructor() {
        this.initializeRoutes();
    }
    initializeRoutes(){
        const router = Router();
        router
            // WEB
            .get('/all', adminVerifyJWT, wrap(surveyCtrl.allSurvey))
            // APP
            .get('/', studentVerifyJWT, wrap(surveyCtrl.surveyDetail))
            .post('/add-survey', studentVerifyJWT, wrap(surveyCtrl.addSurvey))
        this.router.use(this.path, router);
    }
}