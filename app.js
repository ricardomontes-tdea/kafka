const express = require('express');
const { writeUserInfoToKafka, readMessages } = require('./user.kafka');
const app = express();

const APP_PORT = 5000

app.use(express.json());

readMessages();

app.get('/send_message', async (req, res) => {

  await writeUserInfoToKafka({ email: 'rina@plata.com', isNew: true, message: "No te duermas" })

  res.send('Hello there!');
});

app.listen(APP_PORT, () => {
 console.log('[INFO] Server running at port: ', APP_PORT); 
})