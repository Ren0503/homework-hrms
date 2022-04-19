const jwt = require('jsonwebtoken')

exports.generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: `${process.env.JWT_EXPIRE}`,
    })
}

exports.verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET)
}