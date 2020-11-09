import { Router } from "express";
import authCheck from "./authenticationCheck";

const router = Router();

router.get("/", authCheck, (req, res) => {
  res.status(200).json(req.user);
});

export default router;
