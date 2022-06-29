
import multer from 'multer'

export const storage = multer.diskStorage({
    destination(req, file, cb){
        cb(null, `load/${file.fieldname}`);
    },
    filename(req, file, cb){
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

export const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'fileBook'){
        if (file.originalname.match(/\.(pdf|txt|doc|docx)$/)){
            cb(null, true);
        } else {
            cb(null, false);
        }
    } else {
        if (file.originalname.match(/\.(png|jpg|jpeg|gif)$/)){
            cb(null, true);
        } else {
            cb(null, false);
        }
    }
};

