
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/User.js';

export const signUp = async (req, res) => {
    try {
        const user = new User();
        const {name, email, password} = req.body;

        const existingUser = await user.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({message: 'Usuário já cadastrado com esse email'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await user.create({
            name,
            email,
            password: hashedPassword,
        });

        const token = jwt.sign({userId: newUser._id}, process.env.JWT_SECRET, {expiresIn: process.env.TOKEN_EXPIRES_IN});

        res.status(201).json({user: newUser, token});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Erro ao criar usuário'});
    }
};

export const logIn = async (req, res) => {
    try {
        const user = new User();
        const {email, password} = req.body;

        const retrieve = await user.getUserByEmail(email);
        if (!retrieve) {
            return res.status(404).json({message: 'Usuário não encontrado'});
        }

        const passwordMatch = await bcrypt.compare(password, retrieve.password);
        if (!passwordMatch) {
            return res.status(401).json({message: 'Senha incorreta'});
        }

        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: process.env.TOKEN_EXPIRES_IN});

        res.status(200).json({username: retrieve.name, userId: retrieve.id, token});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Erro ao fazer login'});
    }
};
