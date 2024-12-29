"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../middleware/auth"));
const user_1 = __importDefault(require("../models/user"));
const utils_1 = require("../utils");
const router = express_1.default.Router();
router.post('/users', async (req, res) => {
    try {
        const user = new user_1.default(req.body);
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    }
    catch (error) {
        res.status(400).send(error);
    }
});
router.post('/users/login', async (req, res) => {
    try {
        const user = await user_1.default.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    }
    catch (error) {
        console.log(error);
        res.status(400).send({ error: 'failed login' });
    }
});
router.post('/users/logout', auth_1.default, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(({ token }) => token !== req.token);
        await req.user.save();
        res.send('ok');
    }
    catch (error) {
        res.status(500).send(error);
    }
});
router.post('/users/logoutAll', auth_1.default, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send('ok');
    }
    catch (error) {
        res.status(500).send(error);
    }
});
router.get('/users', auth_1.default, async (req, res) => {
    try {
        const users = await user_1.default.find({});
        res.send(users);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
router.get('/users/me', auth_1.default, async (req, res) => {
    res.send(req.user);
});
router.get('/users/me/boards', auth_1.default, async (req, res) => {
    try {
        await req.user.populate('boards');
        res.send(req.user.boards);
    }
    catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});
router.get('/users/me/tasks', auth_1.default, async (req, res) => {
    try {
        await req.user.populate('tasks');
        res.send(req.user.tasks);
    }
    catch (error) {
        res.status(400).send(error);
    }
});
router.patch('/users/me', auth_1.default, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "password", "age"];
    if (!(0, utils_1.isSubsetOf)(updates, allowedUpdates)) {
        res.status(400).send();
        return;
    }
    try {
        updates.forEach(u => req.user[u] = req.body[u]);
        await req.user.save();
        res.send(req.user);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
router.delete('/users/me', auth_1.default, async (req, res) => {
    try {
        await user_1.default.deleteOne({ _id: req.user._id });
        res.send(req.user);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
router.delete('/users/:id', async (req, res) => {
    try {
        const { id: _id } = req.params;
    }
    catch (error) {
    }
});
exports.default = router;
//# sourceMappingURL=users.js.map