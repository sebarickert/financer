import { Router } from "express";

import {
  addAccount,
  deleteAccount,
  getAccount,
  getAllAccountTransactions,
  listAccounts,
  updateAccount,
} from "../controllers/account-controller";

const router = Router();

router.get("/", listAccounts);

router.get("/:id", getAccount);

router.post("/", addAccount);

router.delete("/:id", deleteAccount);

router.put("/:id", updateAccount);

router.get("/:id/transactions", getAllAccountTransactions);

export default router;
