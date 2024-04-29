const { Kafka } = require('kafkajs');
const { SchemaRegistry } = require('@kafkajs/confluent-schema-registry')  
const { Observable } = require('rxjs');

const kafka = new Kafka({
  clientId: 'my-consumer',
  brokers: ['localhost:9092'] 
});

const host = 'http://localhost:8081';

const registry = new SchemaRegistry({ host })

const consumer = kafka.consumer({ groupId: 'my-group' });


function kafkaStreamObservable(topic) {
  return new Observable((observer) => {
    const run = async () => {
      await consumer.connect();
      await consumer.subscribe({ topic, fromBeginning: true });

      await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          const decodedMessage = {
            ...message,
            value: await registry.decode(message.value) 
          }
          observer.next(decodedMessage);
        },
      });
    };

    run().catch((error) => observer.error(error));

    return () => consumer.disconnect();
  });
}

const kafkaTopic = 'user_information_electiva2';
const kafkaObservable = kafkaStreamObservable(kafkaTopic);

kafkaObservable.subscribe({
  next: (message) => console.log('Message Receive:', message),
  error: (error) => console.error('Error:', error),
  complete: () => console.log('Complete')
});