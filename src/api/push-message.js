import admin from "firebase-admin";

import serviceAccount from "../hoseo-notice-firebase-adminsdk-oi7j5-c873f8a265.json" assert {type: "json"};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

export const sendMessage = (DeviceToken, pushMessage) => {
    return new Promise((resolve, reject)=>{
        console.log(DeviceToken)
        const message = {
            notification :{
                title:pushMessage.title,
                body: pushMessage.content
            },
        };
        admin.messaging().sendToDevice(DeviceToken, message).then((res) => {
            console.log(res)
            console.log('Successfully sent message: ', res)
            resolve(true)
        })
            .catch((error) => {
                console.log(error)
                console.log('Error sending message:', error)
                reject('메세지 전송 실패')
            })
    })
}


// module.exports = {
//   pushMessage: (디바이스토큰값, 푸시메시지) => {
//     console.log(1)
//     console.log(디바이스토큰값)
//     return new Promise(function (resolve, reject) {
//       let message = {
//         notification: {
//           title: 푸시메시지.title,
//           body: 푸시메시지.content
//         },
//         token: 디바이스토큰값
//       }
//       admin.messaging().sendMulticast(message).then((response) => {
//         console.log('Successfully sent message: ', response)
//         resolve(response)
//       })
//         .catch((error) => {
//           console.log('Error sending message:', error)
//           reject(error)
//         })
//     })
// }
//   }