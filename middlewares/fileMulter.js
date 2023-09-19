const multer = require('multer');
const fs = require('fs');
const path = require('path')


const UPLOAD_DIRECTORY = './public/uploads';
function toSafeFileName(fileName) {
    const fileInfo = path.parse(fileName);
  
    const safeFileName = fileInfo.name.replace(/[^a-z0-9]/gi, '-').toLowerCase() + fileInfo.ext;
    return `${Date.now()}-${safeFileName}`;
  }
const upload = multer({
  storage: multer.diskStorage({
    contentType: multer.AUTO_CONTENT_TYPE,
    destination: function (req, file, callback) {
      // const { id, collectionName } = req.params;
      const PATH = `${UPLOAD_DIRECTORY}/media/`;
      // console.log('PATH', PATH);
      if (!fs.existsSync(PATH)) {
        // Create a directory
        fs.mkdirSync(PATH, { recursive: true });
      }
      callback(null, PATH);
    },
    filename: function (req, file, callback) {
      const safeFileName = toSafeFileName(file.originalname);
      callback(null, safeFileName);
    },
  }),
});

module.exports = upload;