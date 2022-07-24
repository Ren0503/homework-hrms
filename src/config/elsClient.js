const { Client } = require('@elastic/elasticsearch')
const {
    ElasticsearchTransport,
    ElasticsearchTransformer,
} = require('winston-elasticsearch')
// Add this to the VERY top of the first file loaded in your app

const client = new Client({
    node: "https://mine-5e002d.es.us-central1.gcp.cloud.es.io",
    auth: {
        username: "elastic",
        password: "F7TyIRxrQxmolEwvUL2NGm8L",
    }
})

client.info()
    .then((response) => console.log(response))
    .catch((error) => console.log(error))

module.exports = client
