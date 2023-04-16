import express from 'express';

import {createTransaction, deleteTransaction, editTransaction, getBalanceInfo, getTransactionsByType, listExpensesByCategory, listIncomesByCategory} from '../controllers/transactionController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/transactions', authMiddleware, createTransaction);

router.put('/transactions/:id', authMiddleware, editTransaction);

router.delete('/transactions/:id', authMiddleware, deleteTransaction);

router.get('/transactions/type/:userId', authMiddleware, getTransactionsByType);

router.get('/transactions/balance/:userId', authMiddleware, getBalanceInfo);

router.get('/transactions/expenses/category/:userId', authMiddleware, listExpensesByCategory);

router.get('/transactions/incomes/category/:userId', authMiddleware, listIncomesByCategory);

export default router;
