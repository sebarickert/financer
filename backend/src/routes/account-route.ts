import { Router } from "express";

import {
  addAccount,
  getAccount,
  listAccounts,
} from "../controllers/account-controller";
import authCheck from "./middlewares/authenticationCheck";

const router = Router();

router.get("/", authCheck, listAccounts);

router.get("/:id", authCheck, getAccount);

router.post("/", authCheck, addAccount);

export default router;
