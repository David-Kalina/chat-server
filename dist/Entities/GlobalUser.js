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
exports.GlobalUser = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
require("reflect-metadata");
const Server_1 = require("./Server");
const LocalUser_1 = require("./LocalUser");
let GlobalUser = class GlobalUser extends typeorm_1.BaseEntity {
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], GlobalUser.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GlobalUser.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GlobalUser.prototype, "password", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GlobalUser.prototype, "firstName", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], GlobalUser.prototype, "lastName", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], GlobalUser.prototype, "connectedServerId", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], GlobalUser.prototype, "onlineStatus", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ nullable: false, unique: true }),
    __metadata("design:type", String)
], GlobalUser.prototype, "globalUserId", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)('text', { nullable: true }),
    __metadata("design:type", String)
], GlobalUser.prototype, "profileURL", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Server_1.Server, server => server.owner),
    __metadata("design:type", Array)
], GlobalUser.prototype, "servers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => LocalUser_1.LocalUser, user => user.globalUser),
    __metadata("design:type", Array)
], GlobalUser.prototype, "localUser", void 0);
GlobalUser = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)()
], GlobalUser);
exports.GlobalUser = GlobalUser;
//# sourceMappingURL=GlobalUser.js.map