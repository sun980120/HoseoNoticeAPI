import { noticeDao } from './DAO/notice.dao.js';
import { BadRequestException } from '../../common/exceptions/index.js';
import path from 'path';
import fs from 'fs';

export const noticeCtrl = {
    async allGroupNoticeApp(req) {
        let parameter = {
            'group_id': req.body.group_id
        };
        const db_data = await noticeDao.allGroupNotice(parameter).catch(e => {
            throw new BadRequestException(e);
        });
        let result = [];
        for (const i of db_data) {
            result.push({
                notice_id: i.notice_id,
                title: i.title,
                create_time: i.create_time,
                // file_count: i.file_count, //파일다운횟수 ???
            });
        }
    },
    async detailNotice(req){
        let parameter = {
            'group_id': req.body.group_id,
            'notice_id': req.params.notice_id
        };
        const result = await noticeDao.detailNotice(parameter).catch(e=>{
            throw new BadRequestException(e)
        })
        return result
    },
    async downloadFile(req, res) {
        let parameter = {
            'file_name': req.query.file_name
        };
        const file = path.join(__dirname, `/../../public/upload/${parameter.file_name}`);
        const filestream = fs.createReadStream(file);
        // await noticeDao.downloadCount(parameter).catch(e=>{
        //     throw new BadRequestException(e)
        // })
        filestream.pipe(res);
    },
};