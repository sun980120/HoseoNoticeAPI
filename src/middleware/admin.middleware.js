import { BadRequestException, ForbiddenException, UnauthorizedException } from '../common/exceptions/index.js';
import {jwtMiddleware} from '../modules/index.js';
import { groupDao } from '../api/group/DAO/group.dao.js';

export const adminVerifyJWT = async (req, res, next) => {
    const jwtToken = req.header('jwt_token');
    if (jwtToken) {
        try {
            const decoded = jwtMiddleware.jwtVerify(jwtToken);
            console.log(decoded)
            if (decoded.LEVEL !== 0 && decoded.LEVEL !== 1) throw 'Err';
            next();
        } catch (err) {
            next(new UnauthorizedException());
        }
    } else {
        next(new ForbiddenException())
    }
};