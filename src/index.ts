import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import albumRoutes from "./routes/album";

dotenv.config();

const PORT = (process.env.PORT as string) || 8080;
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/album", albumRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${+PORT}`);
});
// shift + opt + f
