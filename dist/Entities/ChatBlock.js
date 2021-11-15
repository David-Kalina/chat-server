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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatBlock = void 0;
require("reflect-metadata");
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const ChatRoom_1 = require("./ChatRoom");
const LocalUser_1 = require("./LocalUser");
const Message_1 = require("./Message");
let ChatBlock = class ChatBlock extends typeorm_1.BaseEntity {
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ChatBlock.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ChatBlock.prototype, "channelReferenceId", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ChatBlock.prototype, "chatRoomReferenceId", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ChatBlock.prototype, "userReferenceId", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ChatBlock.prototype, "serverReferenceId", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ChatBlock.prototype, "chatBlockReferenceId", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ChatBlock.prototype, "createdAt", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], ChatBlock.prototype, "updatedAt", void 0);
__decorate([
    (0, type_graphql_1.Field)({ defaultValue: false }),
    __metadata("design:type", Boolean)
], ChatBlock.prototype, "isMine", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => LocalUser_1.LocalUser),
    (0, typeorm_1.ManyToOne)(() => LocalUser_1.LocalUser, localUser => localUser.chatBlocks, { onDelete: 'CASCADE' }),
    __metadata("design:type", LocalUser_1.LocalUser)
], ChatBlock.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ChatRoom_1.ChatRoom, chatRoom => chatRoom.chatBlocks, { onDelete: 'CASCADE' }),
    __metadata("design:type", ChatRoom_1.ChatRoom)
], ChatBlock.prototype, "chatRoom", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Message_1.Message]),
    (0, typeorm_1.OneToMany)(() => Message_1.Message, message => message.chatBlock),
    __metadata("design:type", Array)
], ChatBlock.prototype, "messages", void 0);
ChatBlock = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)()
], ChatBlock);
exports.ChatBlock = ChatBlock;
//# sourceMappingURL=ChatBlock.js.map