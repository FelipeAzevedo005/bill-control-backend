import Transaction from '../models/Transaction.js';

export const createTransaction = async (req, res) => {
    try {
        const {userId, type, value, category, date} = req.body;
        const transaction = new Transaction();

        const newTransaction = await transaction.create({
            userId: parseInt(userId),
            type,
            value: parseFloat(value),
            category,
            date,
        });

        res.status(201).json({transaction: newTransaction});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Erro ao criar transação'});
    }
};

export const editTransaction = async (req, res) => {
    try {
        const {id} = req.params;
        const {type, value, category, date} = req.body;
        const transaction = new Transaction();

        const newTransaction = await transaction.update(id, {
            type,
            value: parseFloat(value),
            category,
            date,
        });

        res.status(200).json({transaction: newTransaction});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Erro ao editar transação'});
    }
};

export const deleteTransaction = async (req, res) => {
    try {
        const {id} = req.params;
        const transaction = new Transaction();
        const newTransaction = await transaction.delete(id);

        res.status(200).json({transaction: newTransaction});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Erro ao deletar transação'});
    }
};

export const getTransactionsByType = async (req, res) => {
    try {
        const {userId} = req.params;
        const {type, startDate, endDate} = req.query;
        const transaction = new Transaction();

        const transactions = await transaction.getByType(userId, type, startDate, endDate);

        res.status(200).json({transactions});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Erro ao buscar transações'});
    }
};

export async function getBalanceInfo(req, res) {
    try {
        const {userId} = req.params;
        const {startDate, endDate} = req.query;
        const transaction = new Transaction();

        const data = await transaction.getBalanceInformation(userId, startDate, endDate);

        const {incomes, expenses} = data.reduce(
            (acc, {_sum, type}) => ({
                incomes: type === 'INCOME' ? _sum.value : acc.incomes,
                expenses: type === 'EXPENSE' ? _sum.value : acc.expenses,
            }),
            {incomes: 0, expenses: 0},
        );

        res.status(200).json({incomes, expenses, balance: incomes - expenses});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Erro ao buscar transações'});
    }
}

export async function listExpensesByCategory(req, res) {
    try {
        const transaction = new Transaction();
        const {userId} = req.params;
        const {startDate, endDate} = req.query;

        const response = await transaction.getExpensesByCategory(userId, startDate, endDate);

        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Erro ao buscar transações'});
    }
}

export async function listIncomesByCategory(req, res) {
    try {
        const transaction = new Transaction();
        const {userId} = req.params;
        const {startDate, endDate} = req.query;

        const response = await transaction.getIncomesByCategory(userId, startDate, endDate);

        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Erro ao buscar transações'});
    }
}
