"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const task_1 = __importDefault(require("../models/task"));
const auth_1 = __importDefault(require("../middleware/auth"));
const checkTask_1 = __importDefault(require("../middleware/checkTask"));
const utils_1 = require("../utils");
const router = (0, express_1.Router)();
router.post('/tasks', auth_1.default, async (req, res) => {
    try {
        const task = new task_1.default({ ...req.body, });
        await task.save();
        res.send(task);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
router.post('/tasks/:id/assign', auth_1.default, checkTask_1.default, async (req, res) => {
    try {
        if (!req.body.assignee) {
            res.status(400).send({ error: 'Assignee required' });
        }
        console.log(req.task);
        req.task.assignee = req.body.assignee;
        await req.task.save();
        res.status(202).send(req.task);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
router.post('/tasks/:id/subtask/add', auth_1.default, checkTask_1.default, async (req, res) => {
    try {
        req.task.subtasks.push(req.body);
        await req.task.save();
        res.send(req.task);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
router.delete('/tasks/:id/subtask/remove', auth_1.default, checkTask_1.default, async (req, res) => {
    try {
        await req.task.subtasks.id(req.body.taskId).deleteOne();
        await req.task.save();
        res.status(202).send(req.task);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
router.patch('/tasks/:id', auth_1.default, checkTask_1.default, async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const allowedUpdates = ["title", "subtasks", "assignee", "status", "description"];
        if (!(0, utils_1.isSubsetOf)(updates, allowedUpdates)) {
            res.status(400).send({ error: 'Invalid update!' });
            return;
        }
        updates.forEach(u => req.task[u] = req.body[u]);
        await req.task.save();
        res.status(202).send(req.task);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
router.get('/tasks', auth_1.default, async (req, res) => {
    try {
        const tasks = await task_1.default.find({});
        res.send(tasks);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
router.get('/tasks/:id', auth_1.default, checkTask_1.default, async (req, res) => {
    try {
        res.send(req.task);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
router.delete('/tasks/:id', auth_1.default, checkTask_1.default, async (req, res) => {
    try {
        await req.task.deleteOne();
        res.send('ok');
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.default = router;
//# sourceMappingURL=tasks.js.map