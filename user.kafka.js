const { findSchemaBySubjectAndVersion, sendMessageTopic, readMessageFromTopic } = require('./kafka');

const topic = 'user_information_electiva2';
const version = 1;
const subject = 'user_information_electiva2-value';

const writeUserInfoToKafka = async (payload) => {
  try {
    const encodedPayloadId = await findSchemaBySubjectAndVersion({ version, subject });

    console.log(`Topic ${topic}; subject: ${subject}; id: ${encodedPayloadId}`);

    await sendMessageTopic({ payload, topic, encodedPayloadId });
  } catch (error) {
    console.error(error);
  }
}

const readMessages = () => {
  readMessageFromTopic(topic, (data) => {
    console.log('[readMessage()] Data comming from kafka --> ', data);
  })
}

module.exports = {
  writeUserInfoToKafka,
  readMessages
}