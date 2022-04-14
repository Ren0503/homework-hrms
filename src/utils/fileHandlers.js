const path = require('path')
const fs = require('fs');
const { encrypt, decrypt } = require('./cryptoData');

// Get path for upload or update new file
exports.newPath = (name) => {
    return path.join('./uploads/active',  `file-${Date.now()}${path.extname(name)}`)
}

// Get path for delete or update old file
exports.oldPath = (name) => {
    return path.join('./uploads/trash',  `file-${Date.now()}${path.extname(name)}`)
}

// Replace file path in encrypt or decrypt
function getEncryptedFilePath(filePath) {
    return path.join(path.dirname(filePath), path.basename(filePath, path.extname(filePath)) + "_encrypted" + path.extname(filePath))
}

// Encrypt file
exports.saveEncryptedFile = (buffer, filePath) => {
    const encrypted = encrypt(process.env.CRYPTO_ALGO, buffer);

    filePath = getEncryptedFilePath(filePath);
    if (!fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath))
    }

    fs.writeFileSync(filePath, encrypted);
}

// Decrypt file
exports.getEncryptedFile = (filePath) => {
    filePath = getEncryptedFilePath(filePath);
    const encrypted = fs.readFileSync(filePath);
    const buffer = decrypt(process.env.CRYPTO_ALGO, encrypted);
    return buffer;
}