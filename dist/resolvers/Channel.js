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
exports.ChannelResolver = void 0;
const isAuth_1 = require("../middleware/isAuth");
const isConnectedToServer_1 = require("../middleware/isConnectedToServer");
const type_graphql_1 = require("type-graphql");
const uniqid_1 = __importDefault(require("uniqid"));
const Channel_1 = require("../Entities/Channel");
const Server_1 = require("../Entities/Server");
const Channel_2 = require("../inputTypes/Channel");
let ChannelResolver = class ChannelResolver {
    async channels(serverReferenceId) {
        try {
            return await Channel_1.Channel.find({ where: { serverReferenceId } });
        }
        catch (error) {
            return error;
        }
    }
    inviteUrl(parent) {
        return parent.serverReferenceId;
    }
    async channel(channelId) {
        try {
            return await Channel_1.Channel.findOne({ where: { channelId } });
        }
        catch (error) {
            return error;
        }
    }
    async connectToChannel(channelId, { req }) {
        const channel = await Channel_1.Channel.findOne({ where: { channelId } });
        if (!channel) {
            throw new Error('Channel not found');
        }
        req.session.connectedChannelId = channel.channelId;
        return channel;
    }
    async createChannel(options, { req }) {
        console.log('Hello');
        try {
            const serverReferenceId = req.session.connectedServerId;
            const server = await Server_1.Server.findOne({ where: { serverReferenceId } });
            if (!server) {
                throw new Error('Server not found');
            }
            const channel = await Channel_1.Channel.create(Object.assign(Object.assign({}, options), { channelId: (0, uniqid_1.default)('c-'), serverReferenceId: server.serverReferenceId, server })).save();
            return channel;
        }
        catch (error) {
            console.log(error);
            return error;
        }
    }
    async deleteChannel(channelId) {
        try {
            await Channel_1.Channel.delete({ channelId });
            return true;
        }
        catch (error) {
            return error;
        }
    }
    async editChannel(channelId, options) {
        try {
            const channel = await Channel_1.Channel.findOne({ where: { channelId } });
            if (!channel) {
                throw new Error('Channel not found');
            }
            await Channel_1.Channel.update({ channelId }, options);
            return await Channel_1.Channel.findOne({ where: { channelId } });
        }
        catch (error) {
            return error;
        }
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [Channel_1.Channel]),
    (0, type_graphql_1.UseMiddleware)([isAuth_1.isAuth, isConnectedToServer_1.isConnectedToServer]),
    __param(0, (0, type_graphql_1.Arg)('serverReferenceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChannelResolver.prototype, "channels", null);
__decorate([
    (0, type_graphql_1.FieldResolver)(),
    __param(0, (0, type_graphql_1.Root)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Channel_1.Channel]),
    __metadata("design:returntype", void 0)
], ChannelResolver.prototype, "inviteUrl", null);
__decorate([
    (0, type_graphql_1.Query)(() => Channel_1.Channel),
    (0, type_graphql_1.UseMiddleware)([isAuth_1.isAuth, isConnectedToServer_1.isConnectedToServer]),
    __param(0, (0, type_graphql_1.Arg)('channelId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChannelResolver.prototype, "channel", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Channel_1.Channel),
    __param(0, (0, type_graphql_1.Arg)('channelId')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChannelResolver.prototype, "connectToChannel", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Channel_1.Channel),
    (0, type_graphql_1.UseMiddleware)([isAuth_1.isAuth, isConnectedToServer_1.isConnectedToServer]),
    __param(0, (0, type_graphql_1.Arg)('options')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Channel_2.CreateChannelInput, Object]),
    __metadata("design:returntype", Promise)
], ChannelResolver.prototype, "createChannel", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    (0, type_graphql_1.UseMiddleware)([isAuth_1.isAuth, isConnectedToServer_1.isConnectedToServer]),
    __param(0, (0, type_graphql_1.Arg)('channelId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChannelResolver.prototype, "deleteChannel", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Channel_1.Channel),
    (0, type_graphql_1.UseMiddleware)([isAuth_1.isAuth, isConnectedToServer_1.isConnectedToServer]),
    __param(0, (0, type_graphql_1.Arg)('channelId')),
    __param(1, (0, type_graphql_1.Arg)('options')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Channel_2.CreateChannelInput]),
    __metadata("design:returntype", Promise)
], ChannelResolver.prototype, "editChannel", null);
ChannelResolver = __decorate([
    (0, type_graphql_1.Resolver)(Channel_1.Channel)
], ChannelResolver);
exports.ChannelResolver = ChannelResolver;
//# sourceMappingURL=Channel.js.map