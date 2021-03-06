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
const isAllowedToConnectToServer_1 = require("../middleware/isAllowedToConnectToServer");
const isAuth_1 = require("../middleware/isAuth");
const type_graphql_1 = require("type-graphql");
const uniqid_1 = __importDefault(require("uniqid"));
const Channel_1 = require("../Entities/Channel");
const GlobalUser_1 = require("../Entities/GlobalUser");
const LocalUser_1 = require("../Entities/LocalUser");
const Server_1 = require("../Entities/Server");
const Server_2 = require("../inputTypes/Server");
const typeorm_1 = require("typeorm");
const isConnectedToServer_1 = require("../middleware/isConnectedToServer");
const ChatRoom_1 = require("../Entities/ChatRoom");
const ServerResponse_1 = require("../objectTypes/ServerResponse");
let ServerResolver = class ServerResolver {
    async servers({ req }) {
        const entityManager = (0, typeorm_1.getManager)();
        const servers = entityManager
            .createQueryBuilder(Server_1.Server, 'server')
            .leftJoinAndSelect('server.users', 'users')
            .where('users."globalUserReferenceId" = :userId', { userId: req.session.userId })
            .getMany();
        return servers;
    }
    async server(serverReferenceId) {
        const server = await Server_1.Server.findOne({ where: { serverReferenceId } });
        if (!server) {
            throw new Error('Server not found');
        }
        return server;
    }
    async getServerUsers({ req }) {
        const server = await Server_1.Server.findOne({
            relations: ['users'],
            where: { serverReferenceId: req.session.connectedServerId },
        });
        if (!server) {
            throw new Error('Server not found');
        }
        return server.users.length;
    }
    async joinServer(serverReferenceId, { req }) {
        try {
            const user = await GlobalUser_1.GlobalUser.findOne({ where: { globalUserId: req.session.userId } });
            if (!user) {
                throw new Error('User not found');
            }
            const server = await Server_1.Server.findOne({ where: { serverReferenceId } });
            if (!server) {
                throw new Error('Server not found');
            }
            const localUser = await LocalUser_1.LocalUser.create({
                localUserReferenceId: (0, uniqid_1.default)('l-'),
                globalUser: user,
                globalUserReferenceId: user.globalUserId,
                server,
                serverReferenceId: server.serverReferenceId,
            }).save();
            req.session.localId = localUser.localUserReferenceId;
            return true;
        }
        catch (error) {
            return error;
        }
    }
    async connectToServer(serverReferenceId, { req }) {
        var _a, _b, _c;
        try {
            const server = await Server_1.Server.findOne({
                relations: ['users', 'channels'],
                where: { serverReferenceId },
            });
            if (!server) {
                throw new Error('Server not found');
            }
            req.session.connectedServerId = server.serverReferenceId;
            req.session.connectedChannelId = (_a = server.channels[0]) === null || _a === void 0 ? void 0 : _a.channelReferenceId;
            req.session.localId = (_b = server.users.find(user => user.globalUserReferenceId === req.session.userId &&
                user.serverReferenceId === serverReferenceId)) === null || _b === void 0 ? void 0 : _b.localUserReferenceId;
            return { server, channelReferenceId: ((_c = server.channels[0]) === null || _c === void 0 ? void 0 : _c.channelReferenceId) || null };
        }
        catch (error) {
            console.log(error);
            return error;
        }
    }
    async createServer(options, { req }) {
        const owner = await GlobalUser_1.GlobalUser.findOne({ where: { globalUserId: req.session.userId } });
        if (!owner) {
            throw new Error('User not found');
        }
        const server = await Server_1.Server.create(Object.assign(Object.assign({}, options), { serverReferenceId: (0, uniqid_1.default)('s-'), owner })).save();
        const localUser = await LocalUser_1.LocalUser.create({
            localUserReferenceId: (0, uniqid_1.default)('l-'),
            globalUser: owner,
            globalUserReferenceId: owner.globalUserId,
            server,
            serverReferenceId: server.serverReferenceId,
        }).save();
        const channel = await Channel_1.Channel.create({
            name: 'general',
            description: 'General channel',
            server,
            channelReferenceId: (0, uniqid_1.default)('c-'),
            serverReferenceId: server.serverReferenceId,
        }).save();
        const chatRoom = await ChatRoom_1.ChatRoom.create({
            chatRoomReferenceId: (0, uniqid_1.default)('chat-'),
            channelReferenceId: channel.channelReferenceId,
            serverReferenceId: server.serverReferenceId,
        }).save();
        const channelWithChatRoom = await Channel_1.Channel.findOne({
            where: { channelReferenceId: channel.channelReferenceId },
        });
        if (!channelWithChatRoom) {
            throw new Error('Channel not found');
        }
        channelWithChatRoom.chatRoom = chatRoom;
        await channelWithChatRoom.save();
        req.session.connectedServerId = server.serverReferenceId;
        req.session.localId = localUser.localUserReferenceId;
        req.session.localId = localUser.localUserReferenceId;
        req.session.connectedChatRoomId = chatRoom.chatRoomReferenceId;
        return { server, channelReferenceId: channel.channelReferenceId };
    }
    async leaveServer({ req }) {
        const user = await LocalUser_1.LocalUser.findOne({
            where: [
                {
                    globalUserReferenceId: req.session.userId,
                },
                {
                    serverReferenceId: req.session.connectedServerId,
                },
            ],
        });
        if (!user) {
            throw new Error('User not found');
        }
        await user.remove();
        return true;
    }
    async deleteServer({ req }) {
        const server = await Server_1.Server.findOne({
            where: { serverReferenceId: req.session.connectedServerId },
        });
        if (!server) {
            throw new Error('Server not found');
        }
        await server.remove();
        return true;
    }
    async editServer(serverReferenceId, options) {
        const server = await Server_1.Server.findOne({ where: { serverReferenceId } });
        if (!server) {
            throw new Error('Server not found');
        }
        await Server_1.Server.merge(server, options).save();
        return server;
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [Server_1.Server]),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServerResolver.prototype, "servers", null);
__decorate([
    (0, type_graphql_1.Query)(() => Server_1.Server),
    (0, type_graphql_1.UseMiddleware)([isAuth_1.isAuth]),
    __param(0, (0, type_graphql_1.Arg)('serverReferenceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ServerResolver.prototype, "server", null);
__decorate([
    (0, type_graphql_1.Query)(() => Number),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth, isConnectedToServer_1.isConnectedToServer),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServerResolver.prototype, "getServerUsers", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    (0, type_graphql_1.UseMiddleware)([isAuth_1.isAuth]),
    __param(0, (0, type_graphql_1.Arg)('serverReferenceId')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ServerResolver.prototype, "joinServer", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => ServerResponse_1.ServerResponse),
    (0, type_graphql_1.UseMiddleware)([isAuth_1.isAuth, isAllowedToConnectToServer_1.isAllowedToConnectToServer]),
    __param(0, (0, type_graphql_1.Arg)('serverReferenceId')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ServerResolver.prototype, "connectToServer", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => ServerResponse_1.ServerResponse),
    (0, type_graphql_1.UseMiddleware)([isAuth_1.isAuth]),
    __param(0, (0, type_graphql_1.Arg)('options')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Server_2.CreateServerInput, Object]),
    __metadata("design:returntype", Promise)
], ServerResolver.prototype, "createServer", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    (0, type_graphql_1.UseMiddleware)([isAuth_1.isAuth]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServerResolver.prototype, "leaveServer", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    (0, type_graphql_1.UseMiddleware)([isAuth_1.isAuth]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServerResolver.prototype, "deleteServer", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Server_1.Server),
    (0, type_graphql_1.UseMiddleware)([isAuth_1.isAuth]),
    __param(0, (0, type_graphql_1.Arg)('serverReferenceId')),
    __param(1, (0, type_graphql_1.Arg)('options')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Server_2.CreateServerInput]),
    __metadata("design:returntype", Promise)
], ServerResolver.prototype, "editServer", null);
ServerResolver = __decorate([
    (0, type_graphql_1.Resolver)(Server_1.Server)
], ServerResolver);
exports.ServerResolver = ServerResolver;
//# sourceMappingURL=Server.js.map