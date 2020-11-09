import { Router } from "express";
import { authCheck } from './middleware';

const router = Router();

router.get("/", authCheck, (req: any, res) => {
    res.status(200).json(
      req.user,
    );
  });


export default router;
