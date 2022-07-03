const { Client } = require('@elastic/elasticsearch')
const {
    ElasticsearchTransport,
    ElasticsearchTransformer,
} = require('winston-elasticsearch')
// Add this to the VERY top of the first file loaded in your app

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

const apm = require('elastic-apm-node').start({
    // Override the service name from package.json
    // Allowed characters: a-z, A-Z, 0-9, -, _, and space
    serviceName: 'ENVIRONMENT_ALL',

    // Use if APM Server requires a secret token
    secretToken: 'em9vdpOruURTPaZJ9t',
    
    apiKey: "U21rZXc0RUJ4UTBaSndEVGhqb2M6alVCV09nMWRUOVdWbnUzNi0wVm1SUQ==",

    // Set the custom APM Server URL (default: http://localhost:8200)
    serverUrl: 'https://f0ef2851a0c84afe86f5ebc25483131c.apm.us-central1.gcp.cloud.es.io:443',

    // Set the service environment
    environment: 'all'
})

const esTransportOpts = {
    apm,
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
