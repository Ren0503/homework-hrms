const crypto = require("crypto");
const path = require("path");
const fs = require("fs");

const CryptoAlgorithm = "aes-256-cbc";

// Encrypt and decrypt any data
function encrypt(algorithm, buffer, key, iv) {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
    return encrypted;
};

function decrypt(algorithm, buffer, key, iv) {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    const decrypted = Buffer.concat([decipher.update(buffer), decipher.final()]);
    return decrypted;
}

// Replace file path in encrypt or descrypt
function getEncryptedFilePath(filePath) {
    return path.join(path.dirname(filePath), path.basename(filePath, path.extname(filePath)) + "_encrypted" + path.extname(filePath))
}

// Encrypt and descrypt file
function saveEncryptedFile(buffer, filePath, key, iv) {
    const encrypted = encrypt(CryptoAlgorithm, buffer, key, iv);

    filePath = getEncryptedFilePath(filePath);
    if (!fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath))
    }

    fs.writeFileSync(filePath, encrypted);
}

function getEncryptedFile(filePath, key, iv) {
    filePath = getEncryptedFilePath(filePath);
    const encrypted = fs.readFileSync(filePath);
    const buffer = decrypt(CryptoAlgorithm, encrypted, key, iv);
    return buffer;
}

module.exports = {
    encrypt,
    decrypt,
    getEncryptedFile,
    saveEncryptedFile,
}