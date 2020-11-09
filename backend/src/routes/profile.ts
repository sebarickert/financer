import { Router } from "express";
import { authCheck } from './middleware';

const router = Router();

router.get("/", authCheck, (req: any, res) => {
    res.status(200).json({
      authenticated: true,
      message: "user successfully authenticated",
      user: req.user,
      cookies: req.cookies,
    });
  });


export default router;
