const path = require('path')
const multer = require('multer')
const fs = require('fs')

// For upload file
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename(req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        )
    },
})

// Validate type
function checkFileType(file, cb) {
    const filetypes = /pdf|doc|docx/
    const extname = filetypes.test(path.extname(file.originalname).toLocaleLowerCase())

    if (extname) {
        return cb(null, true)
    } else {
        cb('Doc only!')
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
})

// For delete file
const deleteFile = (url) => {
    const exitFile = fs.existsSync(url)

    if (exitFile) {
        fs.unlinkSync(url)
        console.log({
            status: "200",
            responseType: "string",
            response: "success"
        })
    } else {
        console.log('Not found file')
    }
}

module.exports = {
    uploadFile,
    deleteFile,
}