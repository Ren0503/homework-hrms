const path = require('path')
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const helmet = require('helmet')
const dotenv = require('dotenv')
const morgan = require('morgan')
const { Server } = require('socket.io')
const { createServer } = require('http')
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('../swagger_output.json')
const { notFound, errorHandler } = require('./middleware/errorMiddleware')
const { logger } = require('./config/logging')
const { startPolyglot } = require('./utils/polygot')

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

// Socket IO
const httpServer = createServer(app);
const io = new Server(httpServer, { pingTimeout: 60000 });

io.on('connection', (socket) => {
    console.log('Connected to socket.io');
    socket.on('setup', (userData) => {
        socket.join(userData._id);
        socket.emit('connected');
    });

    socket.off('setup', () => {
        console.log('USER DISCONNECTED');
        socket.leave(userData._id);
    });
});

httpServer.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
