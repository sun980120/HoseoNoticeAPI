import multer from 'multer' // 1
import dayjs from 'dayjs';
const storageNotice = multer.diskStorage({ // 2
    destination(req, file, cb) {
        cb(null, 'src/public/uploads/');
    },
    filename(req, file, cb) {
        let datetime = new dayjs().format('YYYY-MM-DD_HH:mm:ss');
        cb(null, `${datetime}`+'_'+`${file.originalname}`);
    },
});

export const uploads = multer({ storage: storageNotice });
