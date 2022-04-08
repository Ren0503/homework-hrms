const mongoose = require('mongoose')
const { logger } = require('./logging');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)

        console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch(error) {
        logger.error(error);
        console.error(`Error: ${error.message}`)
        process.exit(1)
    }
}

module.exports = connectDB