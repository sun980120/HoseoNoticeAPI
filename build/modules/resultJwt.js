import { jwtMiddleware } from "./jwt.js";
import { BadRequestException } from "../common/exceptions/index.js";
export const resultJwt = async jwt_token => {
  const permission = await jwtMiddleware.jwtCerti(jwt_token).catch(e => {
    throw new BadRequestException(e);
  });
  let parameter = {
    "user_id": permission.STUDENT_ID,
    "user_name": permission.NM,
    "user_level": permission.LEVEL,
    "user_dept": permission.DEPT_NM,
    "user_grade": permission.SCHYR
  };
  return parameter;
};