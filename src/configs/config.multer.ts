import fs from 'fs';
import multer from 'multer';

const UPLOAD_FOLDER = 'uploads';

const diskStorage = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      if (!fs.existsSync(UPLOAD_FOLDER)) {
        fs.mkdirSync(UPLOAD_FOLDER);
      }
      cb(null, UPLOAD_FOLDER);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});

const memoryStorage = multer({
  storage: multer.memoryStorage(),
});

export { diskStorage, memoryStorage };
