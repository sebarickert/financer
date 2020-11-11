import { Router } from "express";

import { addAccount, listAccounts } from "../controllers/account-controller";
import authCheck from "./middlewares/authenticationCheck";

const router = Router();

router.get("/", authCheck, listAccounts);

router.post("/", authCheck, addAccount);

export default router;
