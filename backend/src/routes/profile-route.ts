import { Router } from "express";
import { getMyData, overrideMyData } from "../controllers/profile-controller";

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json(req.user);
});

router.get("/my-data", getMyData);

router.post("/my-data", overrideMyData);

export default router;
