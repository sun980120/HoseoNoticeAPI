import {resultJwt} from "../../modules/index.js";
import {surveyDao} from "./DAO/survey.dao.js";
import { groupDao } from '../group/DAO/group.dao.js';
import { BadRequestException } from '../../common/exceptions/index.js';
import dayjs from 'dayjs';

export const surveyCtrl = {
    async surveyDetail(req){
        let parameter = {
            survey_id:req.query.survey_id
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
        let {title, group_id, end_time} = req.body;
        let jwt_token = req.header('jwt_token');
        let parameter = await resultJwt(jwt_token)
        parameter.group_id = group_id;
        parameter.title = title;
        parameter.end_time = end_time;
        parameter.create_time = new dayjs().format('YYYY-MM-DD HH:mm:ss');
        await groupDao.GroupCheck(parameter).catch(e=>{throw new BadRequestException(e)})
        const survey_id = await surveyDao.addSurvey(parameter).catch(e=>{throw new BadRequestException(e)})
        // console.log(req.body.question_data)
        // for(let i of req.body.question_data){
        //     console.log(i)
        // }
    },
    async allSurveyWeb(req){

    },
    async allSurveyApp(req){
        let jwt_token = req.header('jwt_token');
        let parameter = await resultJwt(jwt_token)
        parameter.group_id = req.query.group_id;
        await groupDao.GroupCheck(parameter).catch(e=>{throw new BadRequestException(e)})
    }
}