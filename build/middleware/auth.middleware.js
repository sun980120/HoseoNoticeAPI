import { ForbiddenException, UnauthorizedException } from '../common/exceptions/index.js';
import { jwtMiddleware } from '../modules/index.js';
export const studentVerifyJWT = (req, res, next) => {
  const jwtToken = req.header('jwt_token');

  if (jwtToken) {
    try {
      const decoded = jwtMiddleware.jwtVerify(jwtToken);
      next();
    } catch (err) {
      next(new UnauthorizedException());
    }
  } else {
    next(new ForbiddenException());
  }
};