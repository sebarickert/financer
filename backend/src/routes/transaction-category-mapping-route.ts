import { Router } from "express";
import {
  addTransactionCategoryMapping,
  getAllUserTransactionCategoryMappings,
} from "../controllers/transaction-category-mapping-controller";

const router = Router();

router.get("/", getAllUserTransactionCategoryMappings);

router.post("/", addTransactionCategoryMapping);

// router.get("/:id", getTransactionCategory);

// router.delete("/:id", deleteTransactionCategory);

// router.put("/:id", updateTransactionCategory);

export default router;
