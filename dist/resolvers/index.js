"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const Channel_1 = require("./Channel");
const GlobalUser_1 = require("./GlobalUser");
const Server_1 = require("./Server");
exports.resolvers = [
    GlobalUser_1.GlobalUserResolver,
    Server_1.ServerResolver,
    Channel_1.ChannelResolver,
];
//# sourceMappingURL=index.js.map