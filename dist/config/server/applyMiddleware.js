"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyMiddleware = void 0;
function applyMiddleware(app, middleware) {
    Object.values(middleware).forEach((m) => {
        app.use(m);
    });
}
exports.applyMiddleware = applyMiddleware;
//# sourceMappingURL=applyMiddleware.js.map