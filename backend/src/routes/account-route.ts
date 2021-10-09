import { Router } from "express";

import {
  addAccount,
  deleteAccount,
  getAccount,
  getAllAccountTransactions,
  listAccounts,
  updateAccount,
  verifyAccountOwnership,
} from "../controllers/account-controller";

const router = Router();

router.get("/", listAccounts);

router.get("/:id", verifyAccountOwnership, getAccount);

router.post("/", addAccount);

router.delete("/:id", verifyAccountOwnership, deleteAccount);

router.put("/:id", verifyAccountOwnership, updateAccount);

router.get(
  "/:id/transactions",
  verifyAccountOwnership,
  getAllAccountTransactions
);

export default router;
