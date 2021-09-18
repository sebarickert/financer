import { Router } from "express";
import {
  addTransactionCategoryMapping,
  getAllUserTransactionCategoryMappings,
  getTransactionCategoryMapping,
  getTransactionCategoryMappingsByTransactionId,
} from "../controllers/transaction-category-mapping-controller";

const router = Router();

router.get("/", getAllUserTransactionCategoryMappings);

router.post("/", addTransactionCategoryMapping);

router.get(
  "/by-transaction/:transactionId",
  getTransactionCategoryMappingsByTransactionId
);

router.get("/:id", getTransactionCategoryMapping);

export default router;
