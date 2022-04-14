const path = require('path')
const multer = require('multer')
const fs = require('fs')
const { logger } = require('../config/logging')

// For upload file
const storage = multer.memoryStorage()

// Validate type
function checkFileType(file, cb) {
    const filetypes = /pdf|doc|docx/
    const extname = filetypes.test(path.extname(file.originalname).toLocaleLowerCase())

    if (extname) {
        return cb(null, true)
    } else {
        cb(new Error('Invalid file type'))
    }
}

// Maximum size
const maxSize = 10 * 1000 * 1000       // 10 MB

const uploadFile = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb)
    },
    limits: { fileSize: maxSize }
});

// For delete file
const deleteFile = (url) => {
    const exitFile = fs.existsSync(url)

    if (exitFile) {
        fs.unlinkSync(url)
        logger.info('Delete success')
    } else {
        logger.error('Not found file')
    }
}

module.exports = {
    uploadFile,
    deleteFile,
}
