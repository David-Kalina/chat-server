"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Server_1 = require("../Entities/Server");
const uniqid_1 = __importDefault(require("uniqid"));
const Server_2 = require("../inputTypes/Server");
const GlobalUser_1 = require("../Entities/GlobalUser");
const Channel_1 = require("../Entities/Channel");
let ServerResolver = class ServerResolver {
    async servers() {
        return await Server_1.Server.find();
    }
    async connectToServer(serverId, { req }) {
        const server = await Server_1.Server.findOne({ where: { serverId } });
        if (!server) {
            throw new Error('Server not found');
        }
        req.session.connectedServerId = server.serverId;
        return server.serverId;
    }
    async createServer(options, { req }) {
        const owner = await GlobalUser_1.GlobalUser.findOne(req.session.userId);
        if (!owner) {
            throw new Error('User not found');
        }
        const server = await Server_1.Server.create(Object.assign(Object.assign({}, options), { serverId: (0, uniqid_1.default)('s-'), owner })).save();
        await Channel_1.Channel.create({
            name: 'general',
            description: 'General channel',
            server,
            channelId: (0, uniqid_1.default)('c-'),
            serverReferenceId: server.serverId,
        }).save();
        req.session.connectedServerId = server.serverId;
        return server;
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [Server_1.Server]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ServerResolver.prototype, "servers", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('serverId')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ServerResolver.prototype, "connectToServer", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Server_1.Server),
    __param(0, (0, type_graphql_1.Arg)('options')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Server_2.CreateServerInput, Object]),
    __metadata("design:returntype", Promise)
], ServerResolver.prototype, "createServer", null);
ServerResolver = __decorate([
    (0, type_graphql_1.Resolver)(Server_1.Server)
], ServerResolver);
exports.ServerResolver = ServerResolver;
//# sourceMappingURL=Server.js.map