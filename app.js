const express = require('express');
const { writeUserInfoToKafka } = require('./user.kafka');
const app = express();

const APP_PORT = 5000

app.use(express.json());

app.get('/send_message', async (req, res) => {

  await writeUserInfoToKafka({ email: 'mayerli@giraldo.com', isNew: true, message: "Mayer lies" })

  res.send('Sending message to kafka');
});

app.listen(APP_PORT, () => {
 console.log('[INFO] Server running at port: ', APP_PORT); 
})