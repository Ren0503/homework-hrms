const path = require('path')
const cors = require('cors')
const express = require('express')
const helmet = require('helmet')
const dotenv = require('dotenv')
const morgan = require('morgan')
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('../swagger_output.json')
const { notFound, errorHandler } = require('./middleware/errorMiddleware')
const logger = require('./config/logging')
const { startPolyglot } = require('./utils/polygot')
const expressWinston = require('express-winston')
expressWinston.requestWhitelist.push('body')
expressWinston.responseWhitelist.push('body')

dotenv.config()

const connectDB = require('./config/db')
connectDB()

const app = express()

// Enable cors
// const corsOptions = {
//     origin: process.env.FRONTEND_URL,
//     credentials: true,
// }
app.use(cors())

// Helmet
app.use(helmet())

// Body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Logging
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
app.use(morgan(morganJSONFormat()));
app.use(morgan('dev'))
app.use(expressWinston.logger(logger))

// Start polyglot and set the language in the req with the phrases to be used
app.use(startPolyglot)

// Swagger UI
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

// Routes
const router = require("./routes/index")
app.use(router)

__dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

app.get('/', (req, res) => {
    res.send('API is running....')
})

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
