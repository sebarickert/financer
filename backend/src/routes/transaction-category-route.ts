import { Router } from "express";
import {
  addTransactionCategory,
  getAllUserTransactionCategories,
} from "../controllers/transaction-category-controller";

const router = Router();

router.get("/", getAllUserTransactionCategories);

router.post("/", addTransactionCategory);

export default router;
