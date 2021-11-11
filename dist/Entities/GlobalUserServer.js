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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalUserServer = void 0;
const type_graphql_1 = require("type-graphql");
const typeorm_1 = require("typeorm");
const GlobalUser_1 = require("./GlobalUser");
const Server_1 = require("./Server");
let GlobalUserServer = class GlobalUserServer extends typeorm_1.BaseEntity {
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], GlobalUserServer.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], GlobalUserServer.prototype, "ownerId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => Server_1.Server),
    (0, typeorm_1.ManyToOne)(() => Server_1.Server, server => server.attendees, { onDelete: 'CASCADE' }),
    __metadata("design:type", typeof (_a = typeof CoordinateEvent !== "undefined" && CoordinateEvent) === "function" ? _a : Object)
], GlobalUserServer.prototype, "event", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], GlobalUserServer.prototype, "userId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => GlobalUser_1.GlobalUser),
    (0, typeorm_1.ManyToOne)(() => GlobalUser_1.GlobalUser, user => user.userEvents, { onDelete: 'CASCADE' }),
    __metadata("design:type", typeof (_b = typeof CoordinateUser !== "undefined" && CoordinateUser) === "function" ? _b : Object)
], GlobalUserServer.prototype, "user", void 0);
GlobalUserServer = __decorate([
    (0, type_graphql_1.ObjectType)(),
    (0, typeorm_1.Entity)({ name: 'globalUserServer' })
], GlobalUserServer);
exports.GlobalUserServer = GlobalUserServer;
//# sourceMappingURL=GlobalUserServer.js.map