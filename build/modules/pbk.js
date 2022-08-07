'use strict';

import pbk from 'pbkdf2-password';
const hasher = pbk();
const PBKDF2 = {
  encryption(password) {
    return new Promise((resolve, reject) => {
      hasher({
        password: password
      }, (err, pass, salt, hash) => {
        const result = {
          salt,
          hash
        };

        if (err) {
          reject(er);
        }

        resolve(result);
      });
    });
  },

  nameEncryption(user_nickname, savedSalt) {
    return new Promise((resolve, reject) => {
      hasher({
        salt: savedSalt,
        password: user_nickname
      }, (err, pass, salt, hash) => {
        if (err) {
          reject(er);
        }

        resolve(hash);
      });
    });
  },

  changeEncryption(password, savedSalt) {
    return new Promise((resolve, reject) => {
      hasher({
        salt: savedSalt,
        password: password
      }, (err, pass, salt, hash) => {
        if (err) {
          reject(err);
        }

        resolve(hash);
      });
    });
  },

  decryption(password, savedSalt, savedHash) {
    return new Promise((resolve, reject) => {
      hasher({
        password: password,
        salt: savedSalt
      }, (err, pass, salt, hash) => {
        if (savedHash === hash) {
          resolve(true);
        } else {
          reject(false);
        }
      });
    });
  }

};
export default PBKDF2;