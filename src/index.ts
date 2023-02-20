import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth";
import albumRoutes from "./routes/album";
import userRoutes from "./routes/user";
import errorHandler from "./utils/error_handler";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "https://photodrop-photographers.vercel.app",
      "http://192.168.0.157:3000",
      "http://213.111.67.182:5173",
      "http://localhost:5173",
      "http://localhost:3000",
    ],
    methods: ["HEAD", "OPTIONS", "POST", "GET", "PUT", "PATCH", "DELETE"],
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
  }),
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/album", albumRoutes);
app.use("/user", userRoutes);

app.use(errorHandler);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server has been started on port ${process.env.PORT || 5000}...`);
});
