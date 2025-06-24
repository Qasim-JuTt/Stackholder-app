import Finance from '../models/ProjectFinance.js';
import { logChange } from '../utils/logChange.js';

export const addTransaction = async (req, res) => {
  try {
    const newTransaction = new Finance(req.body); // user field should be included in body
    const saved = await newTransaction.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


export const getAllTransactions = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "Missing userId in query" });
  }

  try {
    // Directly find all transactions for the given user
    const transactions = await Finance.find({ user: userId })
      .populate("project") // Optional: only if you want project info
      .sort({ createdAt: -1 });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch transactions",
      error: error.message,
    });
  }
};

// Get a single transaction by ID
export const getTransactionById = async (req, res) => {
  try {
    const transaction = await Finance.findById(req.params.id).populate('project');
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ Update Transaction with logging
export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const oldTransaction = await Finance.findById(id);
    if (!oldTransaction) return res.status(404).json({ message: 'Transaction not found' });

    const updatedTransaction = await Finance.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    await logChange({
      modelName: 'Finance',
      documentId: id,
      operation: 'update',
      updatedBy: req.userId || 'unknown', // from middleware
      before: oldTransaction.toObject(),
      after: updatedTransaction.toObject(),
    });

    res.status(200).json(updatedTransaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Delete Transaction with logging
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Finance.findById(id);
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

    await logChange({
      modelName: 'Finance',
      documentId: transaction._id,
      operation: 'delete',
      updatedBy: req.userId || 'unknown',
      deletedData: transaction.toObject(),
    });

    await transaction.deleteOne();
    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
