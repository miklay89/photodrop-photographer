import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const tokenSecret = process.env.TOKEN_SECRET as string;

const getUserIdFromToken = (token: string): string => {
  const decode = jwt.verify(token, tokenSecret);
  return (decode as any).userId;
};

export default getUserIdFromToken;
