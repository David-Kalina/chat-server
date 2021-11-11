"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_core_1 = require("apollo-server-core");
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const connection_1 = require("./config/db/connection");
const middleware_1 = require("./config/middleware");
const redis_1 = require("./config/redis");
const server_1 = require("./config/server");
const applyMiddleware_1 = require("./config/server/applyMiddleware");
const resolvers_1 = require("./resolvers");
const main = async () => {
    try {
        const server = (0, server_1.createServer)();
        await (0, connection_1.connectToDatabase)();
        (0, applyMiddleware_1.applyMiddleware)(server, middleware_1.middleware);
        const gqlServer = new apollo_server_express_1.ApolloServer({
            plugins: [(0, apollo_server_core_1.ApolloServerPluginLandingPageGraphQLPlayground)()],
            schema: await (0, type_graphql_1.buildSchema)({ resolvers: resolvers_1.resolvers }),
            context: ({ req, res }) => ({ req, res, redis: redis_1.redis }),
        });
        await gqlServer.start();
        gqlServer.applyMiddleware({ app: server, cors: false });
        const PORT = process.env.PORT || 4000;
        server.listen({ port: PORT }, () => console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`));
    }
    catch (error) {
        console.log(error);
    }
};
main();
//# sourceMappingURL=index.js.map