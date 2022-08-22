import admin from "firebase-admin";

import serviceAccount from "../smart-campus-5eccd-firebase-adminsdk-imzqm-d534319aa8.json" assert {type: "json"};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

export const sendMessage = (DeviceToken, pushMessage) => {
    return new Promise((resolve, reject)=>{
        const message = {
            notification :{
                title:pushMessage.push_title,
                body: pushMessage.push_content
            },
        };
        admin.messaging().sendToDevice(DeviceToken, message).then((res) => {
            console.log('Successfully sent message: ', res)
            resolve(true)
        })
            .catch((error) => {
                console.log('Error sending message:', error)
                reject('메세지 전송 실패')
            })
    })
}