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
exports.GlobalUserResolver = void 0;
const Register_1 = require("../inputTypes/Register");
const type_graphql_1 = require("type-graphql");
const GlobalUser_1 = require("../Entities/GlobalUser");
const Server_1 = require("../Entities/Server");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uniqid_1 = __importDefault(require("uniqid"));
const Login_1 = require("../inputTypes/Login");
const isAuth_1 = require("../middleware/isAuth");
let GlobalUserResolver = class GlobalUserResolver {
    hello() {
        return 'Hello World!';
    }
    async me({ req }) {
        try {
            const user = await GlobalUser_1.GlobalUser.findOne({ where: { globalUserId: req.session.userId } });
            if (!user) {
                return null;
            }
            return user;
        }
        catch (error) {
            return null;
        }
    }
    async getOnlineStatus({ req }) {
        if (!req.session.userId) {
            return 'offline';
        }
        const userStatus = req.session.onlineStatus;
        if (!userStatus) {
            return 'offline';
        }
        return userStatus;
    }
    async setOnlineStatus(onlineStatus, { req }) {
        if (!req.session.userId) {
            return 'offline';
        }
        req.session.onlineStatus = onlineStatus;
        return req.session.onlineStatus;
    }
    async logout({ req, res }) {
        try {
            return new Promise((resolve, reject) => {
                req.session.destroy(err => {
                    if (err) {
                        reject(false);
                    }
                    res.clearCookie('qid');
                    resolve(true);
                });
            });
        }
        catch (error) {
            return error;
        }
    }
    async register(options, { req }) {
        try {
            const user = await GlobalUser_1.GlobalUser.create(Object.assign(Object.assign({}, options), { globalUserId: (0, uniqid_1.default)('global-'), password: await bcryptjs_1.default.hash(options.password, 12) })).save();
            const server = await Server_1.Server.create({
                serverReferenceId: (0, uniqid_1.default)('s-'),
                name: 'general',
                owner: user,
            }).save();
            req.session.userId = user.globalUserId;
            req.session.connectedServerId = server.serverReferenceId;
            req.session.onlineStatus = 'online';
            return user;
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async login(options, { req }) {
        try {
            const user = await GlobalUser_1.GlobalUser.findOne({ where: { email: options.email } });
            if (!user) {
                throw new Error('User not found');
            }
            const valid = await bcryptjs_1.default.compare(options.password, user.password);
            if (!valid) {
                throw new Error('Invalid password');
            }
            req.session.userId = user.globalUserId;
            req.session.onlineStatus = 'online';
            return user;
        }
        catch (error) {
            throw new Error(error);
        }
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GlobalUserResolver.prototype, "hello", null);
__decorate([
    (0, type_graphql_1.Query)(() => GlobalUser_1.GlobalUser),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GlobalUserResolver.prototype, "me", null);
__decorate([
    (0, type_graphql_1.Query)(() => String),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GlobalUserResolver.prototype, "getOnlineStatus", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    (0, type_graphql_1.UseMiddleware)(isAuth_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)('onlineStatus')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], GlobalUserResolver.prototype, "setOnlineStatus", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], GlobalUserResolver.prototype, "logout", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => GlobalUser_1.GlobalUser),
    __param(0, (0, type_graphql_1.Arg)('options')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Register_1.RegisterInput, Object]),
    __metadata("design:returntype", Promise)
], GlobalUserResolver.prototype, "register", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => GlobalUser_1.GlobalUser),
    __param(0, (0, type_graphql_1.Arg)('options')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Login_1.LoginInput, Object]),
    __metadata("design:returntype", Promise)
], GlobalUserResolver.prototype, "login", null);
GlobalUserResolver = __decorate([
    (0, type_graphql_1.Resolver)(GlobalUser_1.GlobalUser)
], GlobalUserResolver);
exports.GlobalUserResolver = GlobalUserResolver;
//# sourceMappingURL=GlobalUser.js.map