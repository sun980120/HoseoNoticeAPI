import db from "../../../config/db.js";
import logger from "../../../config/logger.js";

export const surveyDao = {
    getSurvey(parameter){
       return new Promise((resolve, reject)=>{
           const queryData = `SELECT question_type_id, question FROM survey_question WHERE survey_id = ?`;
           db.query(queryData, [parameter.survey_id], (error, db_data)=>{
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
    addSurvey(parameter){
        return new Promise((resolve, reject)=>{
            const queryData = `INSERT INTO survey (group_id, title, create_time, end_time) VALUE (?,?,?,?)`;
            db.query(queryData, [parameter.group_id, parameter.title, parameter.create_time, parameter.end_time], (error, db_data)=>{
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
    }
}