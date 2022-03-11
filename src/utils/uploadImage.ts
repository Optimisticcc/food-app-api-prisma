import multer from 'multer';

const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
};

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    // cb(null, file.originalname)
    const fileName = file.originalname.split(' ').join('-');
    let extension = '';
    if (file.mimetype === 'image/jpg') {
      extension = 'jpg';
    } else if (file.mimetype === 'image/png') {
      extension = 'png';
    } else if (file.mimetype === 'image/jpeg') {
      extension = 'jpeg';
    }

    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const upload = multer({
  storage: storage,
});

export { upload };
