import { Router } from "express";
import {
  addTransaction,
  addTransfer,
  getTransfers,
} from "../controllers/transaction-controller";

const router = Router();

router.post("/", addTransfer, addTransaction);

router.get("/transfers", getTransfers);

export default router;
