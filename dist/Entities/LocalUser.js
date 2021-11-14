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
exports.LocalUser = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
require("reflect-metadata");
const Server_1 = require("./Server");
const GlobalUser_1 = require("./GlobalUser");
let LocalUser = class LocalUser extends typeorm_1.BaseEntity {
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.ID),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], LocalUser.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ nullable: false, unique: true }),
    __metadata("design:type", String)
], LocalUser.prototype, "localId", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], LocalUser.prototype, "globalUserReferenceId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Server_1.Server, server => server.channels, { onDelete: 'CASCADE' }),
    __metadata("design:type", Server_1.Server)
], LocalUser.prototype, "server", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], LocalUser.prototype, "serverReferenceId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => GlobalUser_1.GlobalUser, user => user.localUser),
    __metadata("design:type", GlobalUser_1.GlobalUser)
], LocalUser.prototype, "globalUser", void 0);
LocalUser = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)()
], LocalUser);
exports.LocalUser = LocalUser;
//# sourceMappingURL=LocalUser.js.map