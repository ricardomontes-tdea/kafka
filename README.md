## Setup

- Run `docker compose up -d --build`
- Run `npm install`
- In a web browser go to localhost:8081
- Into Schema-registry server create a new topic, and set it a new schema (AVRO format)

#### Check Schema Registry api to create new topics or schemas from the terminal
https://github.com/confluentinc/schema-registry?tab=readme-ov-file#quickstart-api-usage-examples

### Additonal setup
- Go to `user.kafka.js`, set this variables
``` javascript
  const topic = '[CREATED_TOPIC_NAME]';
  const version = 1; // topic version, verify on schema-registry server
  const subject = '[TOPIC - SUBJECT]';
```
