const crypto = require("crypto")

const secret = {
    iv: Buffer.from(process.env.SECRET_IV_BUFFER, 'hex'),
    key: Buffer.from(process.env.SECRET_KEY_BUFFER, 'hex')
}

// Encrypt and decrypt any data
exports.encrypt = (algorithm, buffer) => {
    const cipher = crypto.createCipheriv(algorithm, secret.key, secret.iv)
    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()])
    return encrypted
}

exports.decrypt = (algorithm, buffer) => {
    const decipher = crypto.createDecipheriv(algorithm, secret.key, secret.iv)
    const decrypted = Buffer.concat([decipher.update(buffer), decipher.final()])
    return decrypted
}