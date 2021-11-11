"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isConnectedToChannel = void 0;
const isConnectedToChannel = ({ context, args }, next) => {
    if (!context.req.session.connectedChannelId) {
        throw new Error('not connected to channel');
    }
    if (!context.req.session.connectedChannelId === args.channelId) {
        throw new Error('not connected to channel');
    }
    return next();
};
exports.isConnectedToChannel = isConnectedToChannel;
//# sourceMappingURL=isConnectedToChannel.js.map