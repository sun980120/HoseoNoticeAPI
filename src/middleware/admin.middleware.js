import { ForbiddenException, UnauthorizedException } from '../common/exceptions/index.js';
import {jwtMiddleware} from '../modules/index.js';

export const adminVerifyJWT = (req, res, next) => {
    const jwtToken = req.header('jwt_token');
    if (jwtToken) {
        try {
            const decoded = jwtMiddleware.jwtVerify(jwtToken);
            if (decoded.LEVEL !== 0 && decoded.LEVEL !== 1) throw "Err"
            next();
        } catch (err) {
            next(new UnauthorizedException());
        }
    } else {
        next(new ForbiddenException())
    }
};