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
exports.ConnectResponse = void 0;
const Channel_1 = require("../Entities/Channel");
const type_graphql_1 = require("type-graphql");
let ConnectResponse = class ConnectResponse {
};
__decorate([
    (0, type_graphql_1.Field)(() => Channel_1.Channel),
    __metadata("design:type", Channel_1.Channel)
], ConnectResponse.prototype, "channel", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], ConnectResponse.prototype, "localUserId", void 0);
ConnectResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], ConnectResponse);
exports.ConnectResponse = ConnectResponse;
//# sourceMappingURL=ConnectResponse.js.map