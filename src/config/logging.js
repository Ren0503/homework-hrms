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
const morganJSONFormat = () => JSON.stringify({
    method: ':method',
    url: ':url',
    http_version: ':http-version',
    remote_addr: ':remote-addr',
    remote_addr_forwarded: ':req[x-forwarded-for]', //Get a specific header
    response_time: ':response-time',
    status: ':status',
    content_length: ':res[content-length]',
    timestamp: ':date[iso]',
    user_agent: ':user-agent',
});

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
      indexPrefix: process.env.NODE_ENV || 'dev',
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
    format: morganJSONFormat(),
    meta: true,
    msg: 'HTTP {{req.method}} {{req.url}} {{req.body}} {{res.responseTime}}ms',
    expressFormat: true, 
    colorize: false,
})

module.exports = logger
