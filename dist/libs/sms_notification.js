"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const twilio_1 = require("twilio");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio_1.Twilio(accountSid, authToken);
async function sendSmsToClients(phone) {
    await client.messages.create({
        body: "PhotoDrop: Your photos have dropped 🔥 \nCheck them out here: \nhttps://photodrop-clients.vercel.app/hello",
        from: "+447403933647",
        to: phone,
    });
}
exports.default = sendSmsToClients;
