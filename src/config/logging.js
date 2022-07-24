const winston = require('winston')
const { ElasticsearchTransport } = require('winston-elasticsearch');
const ecsFormat = require('@elastic/ecs-winston-format')
const client = require('./elsClient')
const fs = require('fs')
const path = require('path')
require('winston-daily-rotate-file')

const logDir = 'logs'
// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir)
}

const name = 'Backend'

const fileTransport = (level) => {
     const fileRotateTransport = new winston.transports.DailyRotateFile({
      filename: path.join(logDir, `/${level}-%DATE%.log`),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      level,
    })

    return fileRotateTransport
}

console.log(client)
const elasticTransport = (level) => {
    const esTransport = new ElasticsearchTransport({
      client,
      level,
      indexPrefix: process.env.NODE_ENV || 'logs',
      source: name,
    })

    return esTransport
}

const level = ['info', 'warn', 'error', 'debug']
const transports=[]
for (const l of level) {
    transports.push(fileTransport(l))
    transports.push(elasticTransport(l))
}

const logger = winston.createLogger({
    transports,
    json: false,
    format: ecsFormat(),
    meta: true,
    msg: 'HTTP {{req.method}} {{req.url}} {{req.body}} {{res.responseTime}}ms',
    expressFormat: true, 
    colorize: false,
})

module.exports = logger
