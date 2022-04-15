const path = require('path')
const fs = require('fs')
const { logger } = require('../config/logging')
const { encrypt, decrypt } = require('./cryptoData')

// Get path for upload or update new file
exports.generatePath = (name) => {
    return path.join('./uploads', `file-${Date.now()}${path.extname(name)}`)
}

// Replace file path in encrypt or decrypt
const getTrashFilePath = (filePath) => {
    return path.join(`${path.dirname(filePath)}/trash`, `${path.basename(filePath, path.extname(filePath))}_encrypted${path.extname(filePath)}`)
}

// Replace file path in encrypt or decrypt
const getEncryptedFilePath = (filePath) => {
    return path.join(path.dirname(filePath), `${path.basename(filePath, path.extname(filePath))}_encrypted${path.extname(filePath)}`)
}

exports.removeToTrash = (filePath) => {
    oldPath = getEncryptedFilePath(filePath)
    newPath = getTrashFilePath(filePath)

    if (!fs.existsSync(path.dirname(newPath))) {
        fs.mkdirSync(path.dirname(newPath))
    }

    fs.renameSync(oldPath, newPath)
}

exports.restoreFromTrash = (filePath) => {
    oldPath = getTrashFilePath(filePath)
    newPath = getEncryptedFilePath(filePath)

    fs.renameSync(oldPath, newPath)
}

// Encrypt file
exports.saveEncryptedFile = (buffer, filePath) => {
    const encrypted = encrypt(process.env.CRYPTO_ALGO, buffer)

    filePath = getEncryptedFilePath(filePath)
    if (!fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath))
    }

    fs.writeFileSync(filePath, encrypted)
}

// Decrypt file
exports.getEncryptedFile = (filePath) => {
    filePath = getEncryptedFilePath(filePath)
    const encrypted = fs.readFileSync(filePath)
    const buffer = decrypt(process.env.CRYPTO_ALGO, encrypted)
    return buffer
}