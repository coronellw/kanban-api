"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const board_1 = __importDefault(require("../models/board"));
const auth_1 = __importDefault(require("../middleware/auth"));
const checkBoard_1 = __importDefault(require("../middleware/checkBoard"));
const utils_1 = require("../utils");
const router = (0, express_1.Router)();
router.post('/boards', auth_1.default, async (req, res) => {
    try {
        const board = new board_1.default({ ...req.body, owner: req.user._id });
        await board.save();
        res.send(board);
    }
    catch (error) {
        res.status(400).send(error);
    }
});
router.post('/boards/:id/columns/add', auth_1.default, checkBoard_1.default, async (req, res) => {
    try {
        req.board.columns.push(req.body);
        await req.board.save();
        res.send(req.board);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
router.get('/boards', auth_1.default, async (req, res) => {
    try {
        const boards = await board_1.default.find({ owner: req.user._id });
        res.send(boards);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
router.patch('/boards/:id', auth_1.default, checkBoard_1.default, async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const allowedUpdates = ["name", "columns"];
        if (!(0, utils_1.isSubsetOf)(updates, allowedUpdates)) {
            res.status(400).send({ error: 'Invalid update!' });
            return;
        }
        updates.forEach(u => req.board[u] = req.body[u]);
        await req.board.save();
        res.status(202).send(req.board);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
router.delete('/boards/:id/columns/remove', auth_1.default, checkBoard_1.default, async (req, res) => {
    try {
        await req.board.columns.id(req.body.boardId).deleteOne();
        await req.board.save();
        res.send(req.board);
    }
    catch (error) {
        res.status(500).send(error);
    }
});
router.delete('/boards/:id', auth_1.default, checkBoard_1.default, async (req, res) => {
    try {
        await req.board.deleteOne();
        res.send('ok');
    }
    catch (error) {
        res.status(500).send(error);
    }
});
exports.default = router;
//# sourceMappingURL=boards.js.map