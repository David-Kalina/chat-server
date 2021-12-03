"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAllowedToConnectToServer = void 0;
const Server_1 = require("../Entities/Server");
const isAllowedToConnectToServer = async ({ context, args }, next) => {
    const localUser = await Server_1.Server.findOne({
        relations: ['users'],
        where: {
            serverReferenceId: args.serverReferenceId,
        },
    }).then(u => u === null || u === void 0 ? void 0 : u.users.find(u => u.globalUserReferenceId === context.req.session.userId));
    if (!localUser) {
        throw new Error('Not part of server');
    }
    if (!context.req.session.connectedServerId === args.serverId) {
        throw new Error('not connected to server');
    }
    return next();
};
exports.isAllowedToConnectToServer = isAllowedToConnectToServer;
//# sourceMappingURL=isAllowedToConnectToServer.js.map