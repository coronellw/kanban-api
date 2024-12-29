"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const taskSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String
    },
    subtasks: [new mongoose_1.Schema({
            name: { type: String, required: true },
            completed: { type: Boolean, default: false }
        })],
    status: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Board.columns',
    },
    assignee: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    }
});
const Task = (0, mongoose_1.model)('Task', taskSchema);
exports.default = Task;
//# sourceMappingURL=task.js.map