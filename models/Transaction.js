import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

class Transaction {
    async create(data) {
        const {type, value, category, date} = data;
        const dt = {type, value, category, date};
        const transaction = await prisma.transaction.create({
            data: {
                ...dt,
                user: {
                    connect: {id: data.userId},
                },
            },
        });
        return transaction;
    }

    async getByType(
        userId,
        type,
        startDate,
        endDate,
    ) {
        const transactions = await prisma.transaction.findMany({
            where: {
                userId: parseInt(userId),
                type,
                date: {
                    gte: new Date(startDate),
                    lte: new Date(endDate),
                },
            },
            orderBy: {
                date: 'desc',
            },
        });
        return transactions;
    }

    async update(id, data) {
        const transaction = await prisma.transaction.update({
            where: {id: Number(id)},
            data,
        });

        return transaction;
    }

    async delete(id) {
        const transaction = await prisma.transaction.delete({
            where: {id: Number(id)},
            select: {type: true, value: true, userId: true},
        });

        return transaction;
    }

    async getBalanceInformation(userId, startDate, endDate) {
        const types = await prisma.transaction.groupBy({
            by: ['type'],
            where: {
                userId: parseInt(userId),
                date: {
                    gte: new Date(startDate),
                    lte: new Date(endDate),
                },
            },
            _sum: {
                value: true,
            },
        });

        return types;
    }

    async getExpensesByCategory(userId, startDate, endDate) {
        const categories = await prisma.transaction.groupBy({
            by: ['category'],
            where: {
                userId: parseInt(userId),
                type: 'EXPENSE',
                date: {
                    gte: new Date(startDate),
                    lte: new Date(endDate),
                },
            },
            _sum: {
                value: true,
            },
        });

        const total = await prisma.transaction.aggregate({
            where: {
                userId: parseInt(userId),
                type: 'EXPENSE',
                date: {
                    gte: new Date(startDate),
                    lte: new Date(endDate),
                },
            },
            _sum: {
                value: true,
            },
        });

        const list = categories.map(category => ({category: category.category, value: category._sum.value}));

        return {list, total: total._sum.value};
    }

    async getIncomesByCategory(userId, startDate, endDate) {
        const categories = await prisma.transaction.groupBy({
            by: ['category'],
            where: {
                userId: parseInt(userId),
                type: 'INCOME',
                date: {
                    gte: new Date(startDate),
                    lte: new Date(endDate),
                },
            },
            _sum: {
                value: true,
            },
        });

        const total = await prisma.transaction.aggregate({
            where: {
                userId: parseInt(userId),
                type: 'INCOME',
                date: {
                    gte: new Date(startDate),
                    lte: new Date(endDate),
                },
            },
            _sum: {
                value: true,
            },
        });

        const list = categories.map(category => ({category: category.category, value: category._sum.value}));

        return {list, total: total._sum.value};
    }
}

export default Transaction;
