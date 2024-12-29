"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = __importDefault(require("../models/user"));
const JWT_TOKEN = process.env.JWT_TOKEN;
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        const decoded = jsonwebtoken_1.default.verify(token, JWT_TOKEN);
        const user = await user_1.default.findOne({
            _id: decoded._id,
            'tokens.token': token
        });
        if (!user) {
            throw new Error();
        }
        req.user = user;
        req.token = token;
        next();
    }
    catch (error) {
        res.status(401).send({ error: 'Please authenticate' });
    }
};
exports.default = auth;
//# sourceMappingURL=auth.js.map