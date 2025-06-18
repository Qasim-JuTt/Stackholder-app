import express from "express";
import {
  addTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} from "../controllers/financeController.js";

const router = express.Router();

router.post("/create", addTransaction);
router.get("/getAll", getAllTransactions);
router.get("/get/:id", getTransactionById);
router.put("/update/:id", updateTransaction);
router.delete("/delete/:id", deleteTransaction);

export default router;
