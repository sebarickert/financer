import { Router } from "express";
import {
  addTransaction,
  getTransfers,
} from "../controllers/transaction-controller";

const router = Router();

router.post("/", addTransaction);

router.get("/transfers", getTransfers);

export default router;
