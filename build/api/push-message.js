import admin from "firebase-admin";
import serviceAccount from "../hoseo-notice-firebase-adminsdk-oi7j5-c873f8a265.json";
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

exports.sendMessage = function (디바이스토큰값, 푸시메시지) {
  return new Promise(function (resolve, reject) {
    console.log(디바이스토큰값[0]);
    const message = {
      notification: {
        title: 푸시메시지.title,
        body: 푸시메시지.content
      }
    };
    console.log(message);
    admin.messaging().sendToDevice(디바이스토큰값, message).then(res => {
      console.log(res);
      console.log('Successfully sent message: ', res);
      resolve(res);
    }).catch(error => {
      console.log(error);
      console.log('Error sending message:', error);
      reject(error);
    });
  });
}; // module.exports = {
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