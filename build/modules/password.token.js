'use strict';

import crypto from 'crypto';
export const password_token = () => {
  return crypto.randomBytes(3).toString('hex');
};