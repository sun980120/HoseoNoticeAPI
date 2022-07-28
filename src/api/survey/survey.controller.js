import {resultJwt} from "../../modules/index.js";
import {surveyDao} from "./DAO/survey.dao.js";

export const surveyCtrl = {
    async surveyDetail(req){
        let parameter = {
            survey_id:req.params.survey_id
        };
        const db_data = await surveyDao.getSurvey(parameter)
        let result = []
        for(const i of db_data){
            result.push({
                question_type_id:i.question_type_id,
                question:i.question
            })
        }
        return result;
    },
    async addSurvey(req){

    }
}