import { Router } from "express";
import { addTransaction } from "../controllers/transaction-controller";
import authCheck from "./middlewares/authenticationCheck";

const router = Router();

router.post("/", authCheck, addTransaction);

export default router;
