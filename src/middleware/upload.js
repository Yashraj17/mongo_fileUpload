const util = require('util')
const multer = require('multer')
const {GridFsStorage }  = require('multer-gridfs-storage')
const dbConfig = require("../config/db")


const storage = new GridFsStorage({
    url : dbConfig.url + dbConfig.database,
    options: {useNewUrlParser : true, useUnifiedTopology:true},
    file : (req, file) => {
        const match = ["image/png", "image/jpeg"];
        if(match.indexOf(file.mimetype) === -1){
            const filename = `${Date.now()}-cws-${file.originalname}`;
            return filename;
        }
        return {
            bucketName : dbConfig.imgBucket,
            filename: `${Date.now()}-cws-${file.originalname}`
        }
    }
}) 
 
var uploadFiles = multer({storage: storage}).single("file")
var uploadfilesMiddleware = util.promisify(uploadFiles)
module.exports = uploadfilesMiddleware;