"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const Channel_1 = require("./Channel");
const ChatBlock_1 = require("./ChatBlock");
const GlobalUser_1 = require("./GlobalUser");
const Message_1 = require("./Message");
const Server_1 = require("./Server");
exports.resolvers = [
    GlobalUser_1.GlobalUserResolver,
    Server_1.ServerResolver,
    Channel_1.ChannelResolver,
    Message_1.MessageResolver,
    ChatBlock_1.ChatBlockResolver,
];
//# sourceMappingURL=index.js.map