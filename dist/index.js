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
const graphql_1 = require("graphql");
const http_1 = require("http");
const subscriptions_transport_ws_1 = require("subscriptions-transport-ws");
const type_graphql_1 = require("type-graphql");
const connection_1 = require("./config/db/connection");
const session_1 = require("./config/middleware/session");
const redis_1 = require("./config/redis");
const resolvers_1 = require("./resolvers");
const main = async () => {
    try {
        const app = (0, express_1.default)();
        app.set('trust proxy', 1);
        app.use((0, cors_1.default)({ origin: 'http://localhost:3000', credentials: true }), (0, express_session_1.default)(session_1.sessionConfig));
        const httpServer = (0, http_1.createServer)(app);
        await (0, connection_1.connectToDatabase)();
        const subscriptionServer = subscriptions_transport_ws_1.SubscriptionServer.create({
            schema: await (0, type_graphql_1.buildSchema)({ resolvers: resolvers_1.resolvers }),
            execute: graphql_1.execute,
            subscribe: graphql_1.subscribe,
        }, {
            server: httpServer,
            path: '/subscriptions',
        });
        const gqlServer = new apollo_server_express_1.ApolloServer({
            plugins: [
                (0, apollo_server_core_1.ApolloServerPluginLandingPageGraphQLPlayground)(),
                {
                    async serverWillStart() {
                        return {
                            async drainServer() {
                                subscriptionServer.close();
                            },
                        };
                    },
                },
            ],
            schema: await (0, type_graphql_1.buildSchema)({ resolvers: resolvers_1.resolvers }),
            context: ({ req, res }) => ({ req, res, redis: redis_1.redis }),
        });
        await gqlServer.start();
        gqlServer.applyMiddleware({ app, cors: false });
        const PORT = process.env.PORT || 4000;
        httpServer.listen({ port: PORT }, () => console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`));
    }
    catch (error) {
        console.log(error);
        return error;
    }
};
main();
//# sourceMappingURL=index.js.map