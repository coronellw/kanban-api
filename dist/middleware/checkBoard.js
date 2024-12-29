"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const board_1 = __importDefault(require("../models/board"));
const checkTask = async (req, res, next) => {
    try {
        const board = await board_1.default.findById(req.params.id);
        if (!board) {
            res.status(404).send({ error: "Invalid board ID" });
            return;
        }
        req.board = board;
        next();
    }
    catch (error) {
        res.status(400).send();
    }
};
exports.default = checkTask;
//# sourceMappingURL=checkBoard.js.map