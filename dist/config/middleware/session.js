"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionConfig = void 0;
const constants_1 = require("../../constants");
const redis_1 = require("../redis");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.sessionConfig = {
    name: constants_1.COOKIE_NAME,
    store: new redis_1.RedisStore({
        client: redis_1.redis,
        disableTouch: true,
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        secure: constants_1.__prod__,
        sameSite: 'lax',
    },
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
};
//# sourceMappingURL=session.js.map