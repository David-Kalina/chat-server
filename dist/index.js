"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_core_1 = require("apollo-server-core");
const apollo_server_express_1 = require("apollo-server-express");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const http_1 = require("http");
const type_graphql_1 = require("type-graphql");
const connection_1 = require("./config/db/connection");
const session_1 = require("./config/middleware/session");
const redis_1 = require("./config/redis");
const resolvers_1 = require("./resolvers");
const socket_io_1 = require("socket.io");
const Server_1 = require("./Entities/Server");
const ChatBlock_1 = require("./Entities/ChatBlock");
const main = async () => {
    try {
        const app = (0, express_1.default)();
        app.set('trust proxy', 1);
        const mySession = (0, express_session_1.default)(session_1.sessionConfig);
        const httpServer = (0, http_1.createServer)(app);
        const io = new socket_io_1.Server(httpServer, { cors: { origin: process.env.CORS_ORIGIN } });
        app.use((0, cors_1.default)({ origin: 'http://localhost:3000', credentials: true }), mySession);
        const schema = await (0, type_graphql_1.buildSchema)({ resolvers: resolvers_1.resolvers });
        await (0, connection_1.connectToDatabase)();
        const gqlServer = new apollo_server_express_1.ApolloServer({
            plugins: [(0, apollo_server_core_1.ApolloServerPluginLandingPageGraphQLPlayground)()],
            schema,
            context: ({ req, res }) => ({ req, res, redis: redis_1.redis }),
        });
        await gqlServer.start();
        gqlServer.applyMiddleware({ app, cors: false });
        const PORT = process.env.PORT || 4000;
        const servers = await Server_1.Server.find({ relations: ['channels'] });
        servers.forEach((server) => {
            io.of(`/${server.serverReferenceId}`).on('connection', async (socket) => {
                socket.emit('numberOfConnectedUsers', { data: Array.from(socket.rooms) });
                socket.on('join', async ({ channelId }) => {
                    console.log(`${socket.id} joined ${channelId}`);
                    await socket.join(channelId);
                    socket.on('message', async ({ channelId }) => {
                        const chatBlocks = await ChatBlock_1.ChatBlock.find({
                            relations: ['messages'],
                            where: { channelReferenceId: channelId },
                        });
                        console.log(chatBlocks);
                        io.of(`/${server.serverReferenceId}`).to(channelId).emit('chatBlocks', chatBlocks);
                    });
                });
                console.log('a user connected');
                socket.on('disconnect', () => {
                    console.log('user disconnected');
                });
            });
        });
        httpServer.listen({ port: PORT }, () => console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`));
    }
    catch (error) {
        console.log(error);
        return error;
    }
};
main();
//# sourceMappingURL=index.js.map