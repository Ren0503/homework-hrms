const { Client } = require('@elastic/elasticsearch')
const {
    ElasticsearchTransport,
    ElasticsearchTransformer,
} = require('winston-elasticsearch')

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
    transformer: (logData) => {
       console.log('logData', logData)
       const transformed = ElasticsearchTransformer(logData);
       transformed.fields.customField = 'customValue'
       return transformed;
    }
};
const esTransport = new ElasticsearchTransport(esTransportOpts);
esTransport.on('error', (error) => {
    console.error('Error in logger caught', error);
});
module.exports = esTransport
