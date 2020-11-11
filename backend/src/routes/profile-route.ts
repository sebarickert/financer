import { Router } from "express";
import authCheck from "./middlewares/authenticationCheck";

const router = Router();

router.get("/", authCheck, (req, res) => {
  res.status(200).json(req.user);
});

export default router;
