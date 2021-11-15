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
exports.MessageResolver = void 0;
const type_graphql_1 = require("type-graphql");
const uniqid_1 = __importDefault(require("uniqid"));
const ChatBlock_1 = require("../Entities/ChatBlock");
const LocalUser_1 = require("../Entities/LocalUser");
const Message_1 = require("../Entities/Message");
let MessageResolver = class MessageResolver {
    async messages({ req }) {
        return await Message_1.Message.find({
            where: { chatRoomReferenceId: req.session.connectedChatRoomId },
        });
    }
    async createMessage({ req }, text) {
        try {
            const user = await LocalUser_1.LocalUser.findOne({
                where: { localUserReferenceId: req.session.localId },
            });
            const mostRecentChatBlock = await ChatBlock_1.ChatBlock.findOne({
                relations: ['messages', 'user'],
                where: { chatRoomReferenceId: req.session.connectedChatRoomId },
                order: { createdAt: 'DESC' },
            });
            if (mostRecentChatBlock && mostRecentChatBlock.userReferenceId === req.session.localId) {
                const message = await Message_1.Message.create({
                    text,
                    chatBlockReferenceId: mostRecentChatBlock.chatBlockReferenceId,
                    chatBlock: mostRecentChatBlock,
                }).save();
                console.log('mostRecentExists');
                mostRecentChatBlock.messages.push(message);
                await mostRecentChatBlock.save();
                return true;
            }
            else {
                const chatBlock = await ChatBlock_1.ChatBlock.create({
                    user,
                    channelReferenceId: req.session.connectedChannelId,
                    serverReferenceId: req.session.connectedServerId,
                    chatRoomReferenceId: req.session.connectedChatRoomId,
                    userReferenceId: req.session.localId,
                    chatBlockReferenceId: (0, uniqid_1.default)('block-'),
                }).save();
                const addToChatBlock = await ChatBlock_1.ChatBlock.findOne({
                    relations: ['messages', 'user'],
                    where: { chatBlockReferenceId: chatBlock.chatBlockReferenceId },
                });
                const message = await Message_1.Message.create({
                    text,
                    chatBlockReferenceId: addToChatBlock === null || addToChatBlock === void 0 ? void 0 : addToChatBlock.chatBlockReferenceId,
                    chatBlock: addToChatBlock,
                }).save();
                addToChatBlock === null || addToChatBlock === void 0 ? void 0 : addToChatBlock.messages.push(message);
                await chatBlock.save();
                return true;
            }
        }
        catch (error) {
            console.log(error);
            return error;
        }
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [Message_1.Message]),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MessageResolver.prototype, "messages", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Ctx)()),
    __param(1, (0, type_graphql_1.Arg)('text')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MessageResolver.prototype, "createMessage", null);
MessageResolver = __decorate([
    (0, type_graphql_1.Resolver)(Message_1.Message)
], MessageResolver);
exports.MessageResolver = MessageResolver;
//# sourceMappingURL=Message.js.map