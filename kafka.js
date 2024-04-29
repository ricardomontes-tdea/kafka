const { Kafka } = require('kafkajs');
const { SchemaRegistry } = require('@kafkajs/confluent-schema-registry')  
const { Observable } = require('rxjs');

const username = '';
const password = '';

const brokers = ['localhost:9092']
const host = 'http://localhost:8081';

const clientId = 'client-id-example';
const groupId = 'app-example'


const sasl = username && password ? { username, password, mechanism: 'plan' } : null
const ssl = !!sasl

const registry = new SchemaRegistry({ host })
const kafka = new Kafka({ clientId, brokers }) 


const producer = kafka.producer()
const consumer = kafka.consumer({ groupId });


const findSchemaBySubjectAndVersion = ({ version, subject}) => registry.getRegistryId(subject, version);

const sendMessageTopic = async ({ key, topic, encodedPayloadId, payload }) => {
  try {
    await producer.connect(); // connect to kafka

    console.log('encodedPayloadID: ', encodedPayloadId);
    // search a schema in kafka, and pass our if to encode in order to save in a topic
    const encodedPayload = await registry.encode(encodedPayloadId, payload)

    // sending info to kafka, passing topic
    const responses = await producer.send({
      topic: topic,
      messages: [{ key, value: encodedPayload}] // sending our matached data with or schema with avro format
    });

    console.log('[INFO]  Successful operation, writing data to Kafka');
    console.log(responses);

  } catch (error) {
    console.log('[ERROR]',error);
  }
};

const readMessageFromTopic = async (topic, callback) => {
  await consumer.connect();
  await consumer.subscribe({ topic });
  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const decodedMessage = {
          ...message,
          value: await registry.decode(message.value) 
        }

        callback(decodedMessage)
      } catch (error) {
        console.log(error);
      }
    }
  })
}

module.exports = {
  findSchemaBySubjectAndVersion,
  sendMessageTopic,
  readMessageFromTopic
}

