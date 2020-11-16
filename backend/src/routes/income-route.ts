import { Router } from "express";
import { addIncome, listUserIncomes } from "../controllers/income-controller";

import authCheck from "./middlewares/authenticationCheck";

const router = Router();

router.get("/", authCheck, listUserIncomes);

router.post("/", authCheck, addIncome);

export default router;
