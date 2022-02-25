import multer from 'multer';

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // const isValid = FILE_TYPE_MAP[file.mimetype]
        // let err = new Error('invalid image type')
        // if (isValid) {
        //     err = null
        // }
        const folderName = __dirname + '/../public/images/'
        cb(null, folderName)
        // const folderName = __dirname + '/../public/images/'
        // cb(err, folderName)
    },
    filename: function (req, file, cb) {
        // cb(null, file.originalname)
        const fileName = file.originalname.split(' ').join('-')
        let extension = '';
        if (file.mimetype === "image/jpg") {
            extension = 'jpg'
        } else if (file.mimetype === "image/png") {
            extension = 'png'
        } else if (file.mimetype === "image/jpeg") {
            extension = 'jpeg'
        }

        cb(null, `${fileName}-${Date.now()}.${extension}`)
    },
})

const fileFilter = (req: any, file: any, cb: any) => {
    if (file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "image/png") {

        cb(null, true);
    } else {
        cb(new Error("Image uploaded is not of type jpg/jpeg or png"), false);
    }
}

const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 }, fileFilter })

export { upload }