import multer from 'multer' // 1
import fs from 'fs';
fs.readdir("uploads", (error) => {
    if (error) {
        console.error("uploads폴더가 없어 uploads폴더를 생성합니다.");
        fs.mkdirSync('src/public/uploads');
    }
});
const storageNotice = multer.diskStorage({ // 2
    destination(req, file, cb) {
        cb(null, 'src/public/uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${file.originalname}`);
    },
});

export const uploads = multer({ storage: storageNotice });
