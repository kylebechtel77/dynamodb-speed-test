const aws = require('aws-sdk')
const https = require('https')
const sslAgent = new https.Agent({
    keepAlive: true,
    maxSockets: 50, 
    rejectUnauthorized: true
})
aws.config.update({
    httpOptions: {
        agent: sslAgent
    }   
})
const dynamoDb = new aws.DynamoDB.DocumentClient()

exports.handler = async (event, context) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    switch (event.type) {
        case 'read':
            return await read();
        case 'write':
            return await write();
        default:
            return 'done'
    }
};

async function read(){
    console.time('read')
    const params = {
    TableName: 'test',
    Key: {
      test: 'how fast can we read an object?'
    },
  };

  // fetch subscription from the database
  let result = await dynamoDb.get(params).promise()
    console.timeEnd('read')
    return `Successfully read records.`;
}


async function write(){
    console.time('write')
    const params = {
        TableName: 'test',
        Item: {
          test: makeid(20)
        }
    }
    await dynamoDb.put(params).promise()
    console.timeEnd('write')

    return `Successfully written  records.`;
}

function makeid(length) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}
