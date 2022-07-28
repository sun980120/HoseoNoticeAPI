// const ErrorRequestHandler = require('express');
// const ErrorResponseHandler = require('../common/exceptions/http.exception')

export const errorMiddleware = (
  err,
  req,
  res,
  next,
) => {
  const status = err.status || 500;
  const message = err.message;

  res.status(status).json({
    "success":false,
    "response":null,
    "error":{"status":status,"message":message}
  });
  next();
};