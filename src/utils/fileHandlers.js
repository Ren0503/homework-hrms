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
            `${file.originalname}`
        )
    },
})

function checkFileType(file, cb) {
    const filetypes = /pdf|msword|x-pdf/
    const mimetype = filetypes.test(file.mimetype)

    if (mimetype) {
        return cb(null, true)
    } else {
        cb('Doc only!')
    }
}

const uploadFile = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb)
    },
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