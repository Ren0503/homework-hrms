const path = require('path')
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const session = require('express-session')
const passport = require('passport')
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger-output.json')
const { notFound, errorHandler } = require('./middleware/errorMiddleware')

dotenv.config()

require('./config/passport')(passport)

const connectDB = require('./config/db')
connectDB()

const app = express()

// Enable cors
// const corsOptions = {
//     origin: process.env.FRONTEND_URL,
//     credentials: true,
// }
app.use(cors())

// Body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Swagger UI
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

// Sessions
app.use(
    session({
        secret: 'keyboard',
        resave: false,
        saveUninitialized: false,
    })
)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Routes
const router = require("./routes/index");
app.use(router);

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
