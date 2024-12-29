"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger = (req, res, next) => {
    const { method, path, params, body } = req;
    const date = new Date().toISOString();
    let log = `[${date}] ${method.toUpperCase()} ${path}`;
    if (!!Object.keys(params).length) {
        log += ` ${JSON.stringify(params)}`;
    }
    if (body) {
        log += ` - ${JSON.stringify(body)}`;
    }
    console.log(log);
    next();
};
exports.default = logger;
//# sourceMappingURL=logger.js.map