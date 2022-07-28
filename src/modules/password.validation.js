'use strict';

import passwordComplexity from 'joi-password-complexity';

const complexityOptions = {
    min:8,
    max:30,
    lowerCase:1,
    number:1,
    symbol:1,
    requirementCount:3,
}
export const passwordValidation = (user_pw,pw_check) => {
    if(pw_check != user_pw) return "비밀번호가 일치하지 않습니다."
    if(passwordComplexity(complexityOptions).validate(user_pw).error !== undefined) return "비밀번호가 유효하지 않습니다."
    return true
}
