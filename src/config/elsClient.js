const { Client } = require('@elastic/elasticsearch')
const {
    ElasticsearchTransport,
    ElasticsearchTransformer,
} = require('winston-elasticsearch')
// Add this to the VERY top of the first file loaded in your app

const client = new Client({
    node: "https://test-0ee57e.es.us-central1.gcp.cloud.es.io",
    auth: {
        username: "elastic",
        password: "refAtG1RenaQKZpfG7PnB49R",
    }
})

client.info()
    .then((response) => console.log(response))
    .catch((error) => console.log(error))

module.exports = client
