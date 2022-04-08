const { createClient } = require("redis")
let redisClient = createClient({ url: process.env.REDIS_URL, legacyMode: true })
const { promisify } = require('util')

redisClient.connect().catch(console.error)

const getAsync = promisify(redisClient.get).bind(redisClient)
const setAsync = promisify(redisClient.setex).bind(redisClient)

async function save(key, value, ttlSeconds = 60) {
    return await setAsync(key, ttlSeconds, JSON.stringify(value))
}

async function get(key) {
    const jsonString = await getAsync(key)

    if (jsonString) {
        return JSON.parse(jsonString)
    }
}

module.exports = {
    save,
    get,
}