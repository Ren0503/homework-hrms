const winston = require('winston')
const fs = require('fs')
const logDirectory = 'logs'
const { combine, timestamp, json } = winston.format

// Create the log directory if it does not exist
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory)
}

const errorFilter = winston.format((info, opts) => {
    return info.level === 'error' ? info : false
})

const infoFilter = winston.format((info, opts) => {
    return info.level === 'info' ? info : false
})

/** Logging Configurations */
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(timestamp(), json()),
    transports: [
        new winston.transports.File({
            filename: `${logDirectory}/combined.log`,
            maxsize: 5242880, 
        }),
        new winston.transports.File({
            filename: `${logDirectory}/app-error.log`,
            level: 'error',
            format: combine(errorFilter(), timestamp(), json()),
            maxsize: 5242880, 
        }),
        new winston.transports.File({
            filename: `${logDirectory}/app-info.log`,
            level: 'info',
            format: combine(infoFilter(), timestamp(), json()),
            maxsize: 5242880, 
        }),
    ],
})

module.exports = { logger }