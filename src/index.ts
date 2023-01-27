import dotenv from "dotenv";
import express from "express";
// eslint-disable-next-line import/no-extraneous-dependencies
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth";
import albumRoutes from "./routes/album";
import userRoutes from "./routes/user";

dotenv.config();

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/album", albumRoutes);
app.use("/user", userRoutes);

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server has been started on port ${process.env.PORT || 5000}...`);
});
// shift + opt + f
