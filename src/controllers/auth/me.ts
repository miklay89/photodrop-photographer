import { RequestHandler } from "express";

// me controller
const meController: RequestHandler = async (req, res) => {
  return res.json({ message: "ok" });
};

export default meController;
