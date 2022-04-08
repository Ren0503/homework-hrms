const path = require('path')
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const helmet = require('helmet')
const dotenv = require('dotenv')
const morgan = require('morgan')
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger-output.json')
const { notFound, errorHandler } = require('./middleware/errorMiddleware')
const { logger } = require('./config/logging')

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
if (process.env.NODE_ENV === 'development') {
    logger.stream = {
        write: function (message, encoding) {
            logger.info(message)
        }
    }

    app.use(morgan("combined", { "stream": logger.stream }))
    app.use(morgan('dev'))
}

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
)
