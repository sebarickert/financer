import { Router } from "express";
import {
  addTransaction,
  getTransfers,
} from "../controllers/transaction-controller";
import authCheck from "./middlewares/authenticationCheck";

const router = Router();

router.post("/", authCheck, addTransaction);

router.get("/transfers", authCheck, getTransfers);

export default router;
