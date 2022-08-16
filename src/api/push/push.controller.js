import { resultJwt } from '../../modules/index.js';
import { pushDao } from './DAO/push.dao.js';
import { BadRequestException } from '../../common/exceptions/index.js';

export const pushController = {
    async getMyPushLog(req){
        let jwt_token = req.header('jwt_token')
        let parameter = await resultJwt(jwt_token)
        console.log(parameter)
        const result = await pushDao.getMyPushLog(parameter).catch(e=>{
            throw new BadRequestException(e)
        })
        return result;
    }
}