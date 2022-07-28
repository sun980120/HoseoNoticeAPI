'use strict';

import dayjs from 'dayjs';

export const checkValidation = async(authentication_key, serverData) => {
    const nowDatetime = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const changeDate = dayjs(serverData.changePwAt).format('YYYY-MM-DD HH:mm:ss')
    const AddchangeDate = dayjs(serverData.changePwAt).add(5,'minute').format('YYYY-MM-DD HH:mm:ss')
    const checkBool = nowDatetime >= changeDate && nowDatetime <= AddchangeDate

    if(!checkBool) throw "인증번호 유효시간이 지났습니다."
    if(authentication_key !== serverData.authentication_key) throw "인증번호가 일치하지 않습니다."

    return true
}
checkValidation().catch(err => {
    return err
})