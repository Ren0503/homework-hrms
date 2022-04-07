const redis = require('redis');
const { promisify } = require('util');

const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.setex).bind(client);

client.on('error', err => {
    console.log('Error' + err);
});

async function save(key, value, ttlSeconds = 60) {
    return await setAsync(key, ttlSeconds, JSON.stringify(value));
};

async function get(key) {
    const jsonString = await getAsync(key);

    if (jsonString) {
        return JSON.parse(jsonString);
    }
}

module.exports = {
    save,
    get,
}