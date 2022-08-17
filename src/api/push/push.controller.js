import { resultJwt } from '../../modules/index.js';
import { pushDao } from './DAO/push.dao.js';
import { BadRequestException } from '../../common/exceptions/index.js';
import { groupDao } from '../group/DAO/group.dao.js';
import dayjs from 'dayjs';
import { sendMessage } from '../push-message.js';

export const pushCtrl = {
    async getMyPushLog(req){
        let jwt_token = req.header('jwt_token')
        let parameter = await resultJwt(jwt_token)
        console.log(parameter)
        const result = await pushDao.getMyPushLog(parameter).catch(e=>{
            throw new BadRequestException(e)
        })
        return result;
    },
    async addPushLog(req){
        let jwt_token = req.header('jwt_token');
        let push_date = new dayjs().format('YYYY-MM-DD HH:mm:ss');
        let {push_title, push_content,group_id} = req.body;
        let parameter = await resultJwt(jwt_token);
        parameter.group_id = group_id
        parameter.push_date = push_date;
        parameter.push_title = push_title;
        parameter.push_content = push_content;
        await groupDao.adminGroupCheck(parameter).catch(e=>{throw new BadRequestException(e)})
        let deviceToken = await pushDao.pushMessageDT(parameter.group_id).catch(e=>{
            throw new BadRequestException(e)
        })
        let push_id = await pushDao.insertPushLog(parameter)
        for(let j of deviceToken){
            await sendMessage(j.device_token, parameter).catch(e=>{throw new BadRequestException(e)})
            await pushDao.insertPushUser(j.user_id, push_id).catch(e=>{throw new BadRequestException(e)})
        }
        return '성공하였습니다.'
    }
}