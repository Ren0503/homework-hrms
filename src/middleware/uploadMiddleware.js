const path = require('path')
const multer = require('multer')

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

exports.uploadFile = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb)
    },
    limits: { fileSize: maxSize }
})