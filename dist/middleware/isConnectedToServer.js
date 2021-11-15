"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isConnectedToServer = void 0;
const isConnectedToServer = ({ context, args }, next) => {
    if (!context.req.session.connectedServerId) {
        throw new Error('not connected to server');
    }
    if (!context.req.session.connectedServerId === args.serverId) {
        throw new Error('not connected to server');
    }
    return next();
};
exports.isConnectedToServer = isConnectedToServer;
//# sourceMappingURL=isConnectedToServer.js.map