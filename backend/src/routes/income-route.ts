import { Router } from "express";
import { addIncome, listUserIncomes } from "../controllers/income-controller";
import {
  deleteTransaction,
  getTransaction,
} from "../controllers/transaction-controller";

import authCheck from "./middlewares/authenticationCheck";

const router = Router();

router.get("/", authCheck, listUserIncomes);

router.post("/", authCheck, addIncome);

router.get("/:id", authCheck, getTransaction);

router.delete("/:id", authCheck, deleteTransaction);

export default router;
