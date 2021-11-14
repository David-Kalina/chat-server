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
exports.Server = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
require("reflect-metadata");
const GlobalUser_1 = require("./GlobalUser");
const Channel_1 = require("./Channel");
const LocalUser_1 = require("./LocalUser");
let Server = class Server extends typeorm_1.BaseEntity {
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Server.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ unique: true, nullable: false }),
    __metadata("design:type", String)
], Server.prototype, "serverReferenceId", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ length: 255, unique: true }),
    __metadata("design:type", String)
], Server.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => GlobalUser_1.GlobalUser, user => user.servers),
    __metadata("design:type", GlobalUser_1.GlobalUser)
], Server.prototype, "owner", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Channel_1.Channel, channel => channel.server, { onDelete: 'CASCADE' }),
    __metadata("design:type", Array)
], Server.prototype, "channels", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => LocalUser_1.LocalUser, user => user.server, { onDelete: 'CASCADE' }),
    __metadata("design:type", Array)
], Server.prototype, "users", void 0);
Server = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)()
], Server);
exports.Server = Server;
//# sourceMappingURL=Server.js.map