"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleware = void 0;
const cors_1 = require("./cors");
const session_1 = require("./session");
const express_session_1 = __importDefault(require("express-session"));
const cors_2 = __importDefault(require("cors"));
exports.middleware = {
    cors: (0, cors_2.default)(cors_1.corsConfig),
    session: (0, express_session_1.default)(session_1.sessionConfig),
};
//# sourceMappingURL=index.js.map