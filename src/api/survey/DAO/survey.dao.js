import db from "../../../config/db.js";
import logger from "../../../config/logger.js";

export const surveyDao = {
    getSurvey(parameter) {
        return new Promise((resolve, reject) => {
            const queryData = `SELECT sq.question, qt.type_name, qt.question_type_id 
            FROM survey AS s JOIN survey_question AS sq ON s.survey_id = sq.survey_id 
            JOIN question_type AS qt ON sq.question_type_id = qt.question_type_id WHERE s.survey_id = ?;`;
            db.query(queryData, [parameter.survey_id], (error, db_data) => {
                if (error) {
                    logger.error(
                        "DB error [survey_question]" +
                        "\n \t" + queryData +
                        "\n \t" + error);
                    reject('DB ERR');
                }
                resolve(db_data)
            })
        })
    },
    addSurvey(parameter) {
        return new Promise((resolve, reject) => {
            const queryData = `INSERT INTO survey (group_id, title, create_time, end_time) VALUE (?,?,?,?)`;
            db.query(queryData, [parameter.group_id, parameter.title, parameter.create_time, parameter.end_time], (error, db_data) => {
                if (error) {
                    logger.error(
                        "DB error [survey]" +
                        "\n \t" + queryData +
                        "\n \t" + error);
                    reject('DB ERR');
                }
                resolve(db_data.insertId)
            })
        })
    },
    insertQuestionType(parameter) {
        return new Promise((resolve, reject) => {
            let queryData
            if (parameter.type_name === 2) {
                queryData = `INSERT INTO question_type (type_name, is_multi_select) VALUE('라디오', 1)`;
            } else if (parameter.type_name === 3) {
                queryData = `INSERT INTO question_type (type_name, is_multi_select) VALUE('체크박스', 1)`;
            } else if (parameter.type_name === 1) {
                queryData = `INSERT INTO question_type (type_name, is_multi_select) VALUE('단답형', 0)`;
            } else if (parameter.type_name === 0) {
                queryData = `INSERT INTO question_type (type_name, is_multi_select) VALUE('서술형', 0)`;
            }
            db.query(queryData, (error, db_data) => {
                if (error) {
                    logger.error(
                        "DB error [question_type]" +
                        "\n \t" + queryData +
                        "\n \t" + error);
                    reject('DB ERR');
                }
                resolve(db_data.insertId)
            })
        })
    },
    insertSurveyQuestion(question, survey_id, question_type_id) {
        return new Promise((resolve, reject) => {
            const queryData = `INSERT INTO survey_question (survey_id, question_type_id, question) VALUE (?,?,?)`;
            db.query(queryData, [survey_id, question_type_id, question], (error, db_data) => {
                if (error) {
                    logger.error(
                        "DB error [survey_question]" +
                        "\n \t" + queryData +
                        "\n \t" + error);
                    reject('DB ERR');
                }
                resolve(db_data.insertId)
            })
        })
    },
    insertQuestionMultiSelect(survey_question_id, question_type_id, choice_content) {
        return new Promise((resolve, reject) => {
            const queryData = `INSERT INTO question_multi_select (survey_question_id, question_type_id, choice_content) VALUE (?,?,?)`;
            db.query(queryData, [survey_question_id, question_type_id, choice_content], (error, db_data) => {
                if (error) {
                    logger.error(
                        "DB error [survey_question]" +
                        "\n \t" + queryData +
                        "\n \t" + error);
                    reject('DB ERR');
                }
                resolve('추가성공 !!!');
            })
        })
    },
    allSurvey(group_id) {
        return new Promise((resolve, reject) => {
            const queryData = `SELECT survey_id, title, create_time, end_time FROM survey WHERE group_id = ? AND is_del = 0`;
            db.query(queryData, [group_id], (error, db_data) => {
                if (error) {
                    logger.error(
                        "DB error [survey]" +
                        "\n \t" + queryData +
                        "\n \t" + error);
                    reject('DB ERR');
                }
                resolve(db_data)
            })
        })
    },
    getChoiceContent(question_type_id){
        return new Promise((resolve, reject)=>{
            const queryData = `SELECT choice_content FROM question_multi_select WHERE question_type_id = ?`;
            db.query(queryData, question_type_id, (error, db_data)=>{
                if (error) {
                    logger.error(
                        "DB error [question_multi_select]" +
                        "\n \t" + queryData +
                        "\n \t" + error);
                    reject('DB ERR');
                }
                resolve(db_data)
            })
        })
    },
    insertAnswer(parameter){
        console.log('123123')
        console.log(parameter)
        return new Promise((resolve, reject) => {
            const queryData =`INSERT INTO answer (survey_id, user_id, create_time) VALUE (?,?,?)`;
            db.query(queryData, [parameter.survey_id, parameter.user_id, parameter.create_time], (error, db_data)=>{
                if (error) {
                    logger.error(
                        "DB error [answer]" +
                        "\n \t" + queryData +
                        "\n \t" + error);
                    reject('DB ERR');
                }
                resolve(db_data.insertId)
            })
        })
    },
    insertSurveyAnswer(answer_id, parameter){
        return new Promise((resolve, reject) => {
            const queryData = `INSERT INTO survey_answer (survey_question_id, answer_id, answer) VALUE (?,?,?)`;
            db.query(queryData, [parameter.survey_question_id, answer_id, parameter.answer], (error, db_data)=>{
                if (error) {
                    logger.error(
                        "DB error [survey_answer]" +
                        "\n \t" + queryData +
                        "\n \t" + error);
                    reject('DB ERR');
                }
                resolve('추가성공 !!!')
            })
        })
    },
}