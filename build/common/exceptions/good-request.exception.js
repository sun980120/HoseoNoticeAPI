import { HttpException } from './http.exception.js';
export class GoodRequestException extends HttpException {
  constructor(message = '잠시만 기다려주세요.') {
    super(200, message);
  }

}