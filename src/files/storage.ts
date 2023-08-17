import { diskStorage } from 'multer';

const normalizeFileName = (req, file, callback) => {
  callback(null, `${Date.now()}.zip`);
};

export const fileStorage = diskStorage({
  destination: './uploads/zips',
  filename: normalizeFileName,
});
