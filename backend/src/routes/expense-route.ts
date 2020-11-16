import { Router } from "express";
import {
  addExpense,
  listUserExpenses,
} from "../controllers/expense-controller";

import authCheck from "./middlewares/authenticationCheck";

const router = Router();

router.get("/", authCheck, listUserExpenses);

router.post("/", authCheck, addExpense);

export default router;
