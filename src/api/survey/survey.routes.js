import {Router} from "express";
import {studentVerifyJWT} from "../../middleware/auth.middleware.js";
import {surveyCtrl} from "./survey.controller.js";

export class SurveyRoutes {
    path = '/survey';
    router = Router();

    constructor() {
        this.initializeRoutes();
    }
    initializeRoutes(){
        const router = Router();
        router
            //APP
            .get('/:id', studentVerifyJWT, wrap(surveyCtrl.surveyDetail))
            .post('/add-survey', studentVerifyJWT, wrap(surveyCtrl.addSurvey))
        this.router.use(this.path, router);
    }
}