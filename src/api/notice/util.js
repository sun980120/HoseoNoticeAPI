import { noticeDao } from './DAO/notice.dao.js';
import { BadRequestException } from '../../common/exceptions/index.js';
import { sendMessage } from '../push-message.js';
import { pushDao } from '../push/DAO/push.dao.js';

export const sendAndPush = async(parameter, files) =>{
    for(let i of files){
        await noticeDao.insertFile(parameter, i).catch(e=>{
            throw new BadRequestException(e)
        })
    }
    let deviceToken = await noticeDao.pushMessageDT(parameter.group_id).catch(e=>{
        throw new BadRequestException(e)
    })
    let push_id = await pushDao.insertPushLog(parameter)
    for(let j of deviceToken) {
        await sendMessage(j.device_token, parameter).catch(e=> {throw new BadRequestException(e)})
        await pushDao.insertPushUser(j.user_id, push_id).catch(e=>{throw new BadRequestException(e)})
    }
    return '성공하였습니다.'
}