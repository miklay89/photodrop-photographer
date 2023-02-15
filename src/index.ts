import dotenv from "dotenv";
import express from "express";
// eslint-disable-next-line import/no-extraneous-dependencies
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth";
import albumRoutes from "./routes/album";
import userRoutes from "./routes/user";
import errorHandler from "./utils/error_handler";

dotenv.config();

const app = express();

// const corsOptions = {
//   origin: [
//     "https://photodrop-photographers.vercel.app/",
//     "http://192.168.0.157:3000",
//     "http://213.111.67.182:5173",
//     "http://localhost:5173",
//     "http://localhost:3000",
//     "https://pd-photographer.onrender.com",
//   ],
//   credentials: true,
// };

app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/album", albumRoutes);
app.use("/user", userRoutes);

// handle errors
app.use(errorHandler);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server has been started on port ${process.env.PORT || 5000}...`);
});
