const twilio = require("twilio");
require("dotenv").config();

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;
const DESTINATION_PHONE_NUMBER = process.env.DESTINATION_PHONE_NUMBER;

const client = new twilio(accountSid, authToken);

let data = "hello";
let list_items = ["uh", "du", "se"];

client.messages
  .create({
    body: `current item is ${data}, compared to ${list_items} previously`,
    to: DESTINATION_PHONE_NUMBER,
    from: TWILIO_PHONE_NUMBER,
  })
  .then((message) => console.log(message.sid));
