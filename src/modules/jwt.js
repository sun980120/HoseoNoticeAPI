'use strict';

import jwt from 'jsonwebtoken';

function jwtCreate(userData) {
    return new Promise(function(resolve, reject) {
        jwt.sign({
            STUDENT_ID: userData.STUDENT_ID,
            NM: userData.NM,
            LEVEL: userData.LEVEL,
            DEPT_NM: userData.DEPT_NM,
            SCHYR: userData.SCHYR,
        }, process.env.JWT_SECRET, {
            expiresIn: '30m',
            issuer: 'HOSEONOTICE',
        }, function(err, token) {
            if (err) reject(err);
            else resolve(token);
        });
    });
}

function jwtCerti(token) {
    return new Promise(function(resolve, reject) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                reject('토큰이 만료되었습니다.'); // 토큰이 만료되었습니다.
            }
            if (decoded) {
                resolve(decoded);
            } else {
                resolve('토큰이 존재하지 않습니다.'); // 토큰이 존재하지 않습니다.
            }
        });
    });
}

function jwtCreateApp(userData) {
    return new Promise(function(resolve, reject) {
        jwt.sign({
            STUDENT_ID: userData.STUDENT_ID,
            NM: userData.NM,
            LEVEL: userData.LEVEL,
            DEPT_NM: userData.DEPT_NM,
            SCHYR: userData.SCHYR,
        }, process.env.JWT_SECRET, {
            expiresIn: '14d',
            issuer: 'HOSEONOTICE',
        }, function(err, token) {
            if (err) reject(err);
            else resolve(token);
        });
    });
}

function jwtVerify(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
}

export const jwtMiddleware = {
    jwtCreate,
    jwtCerti,
    jwtCreateApp,
    jwtVerify,
};