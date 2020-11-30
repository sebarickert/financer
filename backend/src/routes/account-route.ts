import { Router } from "express";

import {
  addAccount,
  deleteAccount,
  getAccount,
  getAllAccountTransactions,
  listAccounts,
  updateAccount,
} from "../controllers/account-controller";
import authCheck from "./middlewares/authenticationCheck";

const router = Router();

router.get("/", authCheck, listAccounts);

router.get("/:id", authCheck, getAccount);

router.post("/", authCheck, addAccount);

router.delete("/:id", authCheck, deleteAccount);

router.put("/:id", authCheck, updateAccount);

router.get("/:id/transactions", authCheck, getAllAccountTransactions);

export default router;
