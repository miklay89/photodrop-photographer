"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const auth_1 = __importDefault(require("./routes/auth"));
const album_1 = __importDefault(require("./routes/album"));
const user_1 = __importDefault(require("./routes/user"));
const error_handler_1 = __importDefault(require("./utils/error_handler"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: [
        "https://photodrop-photographers.vercel.app",
        "http://192.168.0.157:3000",
        "http://213.111.67.182:5173",
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    methods: ["POST", "GET"],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Uppy-Versions",
        "Accept",
        "x-requested-with",
        "Access-Control-Allow-Origin",
    ],
    exposedHeaders: [
        "Access-Control-Allow-Headers",
        "Access-Control-Allow-Origin",
    ],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use("/auth", auth_1.default);
app.use("/album", album_1.default);
app.use("/user", user_1.default);
app.use(error_handler_1.default);
app.listen(process.env.PORT || 5000, () => {
    console.log(`Server has been started on port ${process.env.PORT || 5000}...`);
});
