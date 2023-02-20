import { Twilio } from "twilio";
import dotenv from "dotenv";

dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID as string;
const authToken = process.env.TWILIO_AUTH_TOKEN as string;
const client = new Twilio(accountSid, authToken);

async function sendSmsToClients(phone: string) {
  await client.messages.create({
    body: "PhotoDrop: Your photos have dropped 🔥 \nCheck them out here: \nhttps://photodrop-clients.vercel.app/hello",
    messagingServiceSid: "MG47af43ea8390bc8433cd1d8f00c2145d",
    to: phone,
  });
}

export default sendSmsToClients;
