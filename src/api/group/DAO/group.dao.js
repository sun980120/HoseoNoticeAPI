import logger from "../../../config/logger.js";
import db from "../../../config/db.js";

export const groupDao = {
    allGroup(){
        return new Promise((resolve, reject)=>{
            const queryData = `SELECT group_id, group_name, intro, group_image FROM univ_group`;
            db.query(queryData, (error, db_data)=>{
                if (error) {
                    logger.error(
                        "DB error [univ_group]" +
                        "\n \t" + queryData +
                        "\n \t" + error);
                    reject('DB ERR');
                }
                resolve(db_data)
            })
        })
    },
    createGroup(){
        return new Promise((resolve, reject)=>{
            // const queryData = `INSERT INTO univ_group (group_name, intro, group_image, user_id) VALUES ('${}')`
        })
    }
}