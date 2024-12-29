"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const logger_1 = __importDefault(require("./middleware/logger"));
const users_1 = __importDefault(require("./routers/users"));
const boards_1 = __importDefault(require("./routers/boards"));
const tasks_1 = __importDefault(require("./routers/tasks"));
require("./db/mongo");
dotenv_1.default.config();
const port = process.env.PORT || 3000;
const isLoggerOn = !!process.env.LOGGER;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
if (isLoggerOn) {
    app.use(logger_1.default);
}
app.use(users_1.default);
app.use(boards_1.default);
app.use(tasks_1.default);
app.listen(port, () => {
    console.log(`Kanban API is up and running on port ${port}`);
});
//# sourceMappingURL=index.js.map