const winston = require('winston')
const { ElasticsearchTransport } = require('winston-elasticsearch');
const ecsFormat = require('@elastic/ecs-winston-format')
const { Client } = require('@elastic/elasticsearch')

const client = new Client({
    cloud: {
        id: "MyDev:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvOjQ0MyQ2NTAxOGNkNTEzZGE0MDAwOWExYzM4ZTQ3ODQ2ZGIyZCRkZWU1ODU1NjE1NzE0YjcwODU2NzU5ZGYwYmExYzE5Nw==",
    },
    auth: {
        username: "elastic",
        password: "djiwSrbnSrSVRqSSOgS6WPJJ",
    }
})

client.info()
    .then((response) => console.log(response))
    .catch((error) => console.log(error))

const esTransportOpts = {
    level: 'info',
    client,
};
const esTransport = new ElasticsearchTransport(esTransportOpts);
esTransport.on('error', (error) => {
  console.error('Error in logger caught', error);
});
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
        esTransport,
    ],
    format: ecsFormat(),
})

module.exports = logger
