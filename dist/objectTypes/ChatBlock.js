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
const LocalUser_1 = require("../Entities/LocalUser");
const Message_1 = require("../Entities/Message");
const type_graphql_1 = require("type-graphql");
let ChatBlock = class ChatBlock {
};
__decorate([
    (0, type_graphql_1.Field)(() => LocalUser_1.LocalUser),
    __metadata("design:type", LocalUser_1.LocalUser)
], ChatBlock.prototype, "user", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Message_1.Message]),
    __metadata("design:type", Array)
], ChatBlock.prototype, "messages", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Date),
    __metadata("design:type", Date)
], ChatBlock.prototype, "lastMessageDate", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Boolean),
    __metadata("design:type", Boolean)
], ChatBlock.prototype, "isMine", void 0);
ChatBlock = __decorate([
    (0, type_graphql_1.ObjectType)()
], ChatBlock);
exports.ChatBlock = ChatBlock;
//# sourceMappingURL=ChatBlock.js.map