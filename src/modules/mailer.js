import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';

// const sendMailService = async () => {
//     let transporter = nodemailer.createTransport({
//         // 사용하고자 하는 서비스, gmail계정으로 전송할 예정이기에 'gmail'
//         service: 'gmail',
//         // host를 gmail로 설정
//         host: 'smtp.gmail.com',
//         port: 465,
//         secure: false,
//         auth: {
//             // Gmail 주소 입력, 'testmail@gmail.com'
//             user: process.env.NODEMAILER_USER,
//             // Gmail 패스워드 입력
//             pass: process.env.NODEMAILER_PASS,
//         },
//     });
//     let info = await transporter.sendMail({
//         // 보내는 곳의 이름과, 메일 주소를 입력
//         from: `"WDMA Team" <${process.env.NODEMAILER_USER}>`,
//         // 받는 곳의 메일 주소를 입력
//         to: email,
//         // 보내는 메일의 제목을 입력
//         subject: 'WDMA Auth Number',
//         // 보내는 메일의 내용을 입력
//         // text: 일반 text로 작성된 내용
//         // html: html로 작성된 내용
//         text: generatedAuthNumber,
//         html: `<b>${generatedAuthNumber}</b>`,
//     });
// }



export const sendMailService = async(parameters) =>{
    const transporter = nodemailer.createTransport(smtpTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth:{
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_PASS
        }
    }));
    const info = await transporter.sendMail({
        from: `"INTIN Team" <${process.env.NODEMAILER_USER}>`,
        to: parameters.user_email,
        subject: 'INTIN Auth Password',
        html: `<b>내용입니다.</b><br/><b>인증번호 발급 : ${parameters.authentication_key}</b><br/><b>인증번호 입력후 비밀번호 변경해주세요.</b>`
    });
    console.log('Message sent : %s', info.messageId);
    return true
}
sendMailService().catch(err => {
    return '메일 전송에 실패하였습니다.'
})

