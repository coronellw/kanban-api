"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const task_1 = __importDefault(require("../models/task"));
const checkTask = async (req, res, next) => {
    try {
        const task = await task_1.default.findById(req.params.id);
        if (!task) {
            res.status(404).send({ error: "Invalid task ID" });
            return;
        }
        req.task = task;
        next();
    }
    catch (error) {
        res.status(400).send();
    }
};
exports.default = checkTask;
//# sourceMappingURL=checkTask.js.map