import jwt from 'jsonwebtoken';

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({message: 'Header de autorização não informado'});
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({message: 'Token não informado'});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({message: 'Token invalido'});
    }
}

export default authMiddleware;
