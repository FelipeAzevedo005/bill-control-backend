import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

class User {
    async create(data) {
        const user = await prisma.user.create({data});
        return user;
    }

    async getUserByEmail(email) {
        const user = await prisma.user.findUnique({
            where: {email},
        });
        return user;
    }
}

export default User;
