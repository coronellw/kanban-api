"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = require("mongoose");
dotenv_1.default.config();
const MONGO_URL = process.env.MONGO_URL;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME;
const MONGO_CONNECTION_URL = `mongodb://${MONGO_URL}`;
(0, mongoose_1.connect)(MONGO_CONNECTION_URL, {
    dbName: MONGO_DB_NAME,
    family: 4
})
    .then(() => console.log("DB Connection Ok"))
    .catch(e => console.log(e));
//# sourceMappingURL=mongo.js.map