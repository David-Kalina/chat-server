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
let ServerResolver = class ServerResolver {
    async servers({ req }) {
        const entityManager = (0, typeorm_1.getManager)();
        const servers = await entityManager.find(Server_1.Server, {
            where: {
                owner: {
                    id: req.session.userId,
                },
            },
            relations: ['owner'],
        });
        return servers;
    }
    async server(serverId) {
        const server = await Server_1.Server.findOne({ where: { serverId } });
        if (!server) {
            throw new Error('Server not found');
        }
        return server;
    }
    async joinServer(serverId, { req }) {
        try {
            const user = await GlobalUser_1.GlobalUser.findOne(req.session.userId);
            if (!user) {
                throw new Error('User not found');
            }
            const server = await Server_1.Server.findOne({ where: { serverId } });
            if (!server) {
                throw new Error('Server not found');
            }
            await LocalUser_1.LocalUser.create({
                localId: (0, uniqid_1.default)('l-'),
                globalUser: user,
                globalId: user.id,
                server,
                serverReferenceId: server.serverReferenceId,
            }).save();
            return true;
        }
        catch (error) {
            console.log(error);
            return error;
        }
    }
    async connectToServer(serverReferenceId, { req }) {
        const server = await Server_1.Server.findOne({ where: { serverReferenceId } });
        if (!server) {
            throw new Error('Server not found');
        }
        req.session.connectedServerId = server.serverReferenceId;
        return server;
    }
    async createServer(options, { req }) {
        const owner = await GlobalUser_1.GlobalUser.findOne(req.session.userId);
        if (!owner) {
            throw new Error('User not found');
        }
        const server = await Server_1.Server.create(Object.assign(Object.assign({}, options), { serverReferenceId: (0, uniqid_1.default)('s-'), owner })).save();
        await LocalUser_1.LocalUser.create({
            localId: (0, uniqid_1.default)('l-'),
            globalUser: owner,
            globalId: owner.id,
            server,
            serverReferenceId: server.serverReferenceId,
        }).save();
        await Channel_1.Channel.create({
            name: 'general',
            description: 'General channel',
            server,
            channelId: (0, uniqid_1.default)('c-'),
            serverReferenceId: server.serverReferenceId,
        }).save();
        req.session.connectedServerId = server.serverReferenceId;
        return server;
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [Server_1.Server]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ServerResolver.prototype, "servers", null);
__decorate([
    (0, type_graphql_1.Query)(() => Server_1.Server),
    (0, type_graphql_1.UseMiddleware)([isAuth_1.isAuth]),
    __param(0, (0, type_graphql_1.Arg)('serverId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ServerResolver.prototype, "server", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    (0, type_graphql_1.UseMiddleware)([isAuth_1.isAuth]),
    __param(0, (0, type_graphql_1.Arg)('serverId')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ServerResolver.prototype, "joinServer", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Server_1.Server),
    (0, type_graphql_1.UseMiddleware)([isAuth_1.isAuth, isAllowedToConnectToServer_1.isAllowedToConnectToServer]),
    __param(0, (0, type_graphql_1.Arg)('serverReferenceId')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ServerResolver.prototype, "connectToServer", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Server_1.Server),
    (0, type_graphql_1.UseMiddleware)([isAuth_1.isAuth]),
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