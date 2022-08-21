import { resultJwt } from "../../modules/index.js";
import { surveyDao } from "./DAO/survey.dao.js";
import { groupDao } from '../group/DAO/group.dao.js';
import { BadRequestException } from '../../common/exceptions/index.js';
import dayjs from 'dayjs';

export const surveyCtrl = {
    async surveyDetail(req) {
        let parameter = {
            survey_id: req.query.survey_id
        }
        const db_data = await surveyDao.getSurvey(parameter)
        let result = []
        for (const i of db_data) {
            let choice_content_data = await surveyDao.getChoiceContent(i.question_type_id)
            let choice_content = []
            for(const j of choice_content_data){
                choice_content.push(j.choice_content)
            }
            result.push({
                question: i.question,
                type_name: i.type_name,
                choice_content: choice_content
            })
        }
        return result
    },
    async addSurvey(req) {
        let { title, group_id, end_time } = req.body;
        let jwt_token = req.header('jwt_token');
        let parameter = await resultJwt(jwt_token)
        parameter.group_id = group_id;
        parameter.title = title;
        parameter.end_time = end_time;
        parameter.create_time = new dayjs().format('YYYY-MM-DD HH:mm:ss');
        await groupDao.AdminGroupCheck(parameter).catch(e => { throw new BadRequestException(e) })
        const survey_id = await surveyDao.addSurvey(parameter).catch(e => { throw new BadRequestException(e) })
        for (let i of req.body.question_data) {
            let question_type_id = await surveyDao.insertQuestionType(i)
            let survey_question_id = await surveyDao.insertSurveyQuestion(i.question, survey_id, question_type_id)
            if (i.type_name > 1) {
                for (let j of i.choice_content) {
                    await surveyDao.insertQuestionMultiSelect(survey_question_id, question_type_id, j)
                }
            }
        }
        return '설문조사 추가에 성공하였습니다.'
    },
    async allSurveyWeb(req) {
        let jwt_token = req.header('jwt_token');
        let parameter = await resultJwt(jwt_token)
        parameter.group_id = req.query.group_id;
        try {
            await groupDao.AdminGroupCheck(parameter)
            const result = await surveyDao.allSurvey(parameter.group_id)
            return result
        } catch (e) {
            throw new BadRequestException(e)
        }
    },
    async allSurveyApp(req) {
        let jwt_token = req.header('jwt_token');
        let parameter = await resultJwt(jwt_token)
        parameter.group_id = req.query.group_id;
        try {
            await groupDao.UserGroupCheck(parameter)
            const result = await surveyDao.allSurvey(parameter.group_id)
            return result
        } catch (e) {
            throw new BadRequestException(e)
        }
    }
}