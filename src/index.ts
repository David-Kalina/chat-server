import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { connectToDatabase } from './config/db/connection'
import { middleware } from './config/middleware'
import { redis } from './config/redis'
import { createServer } from './config/server'
import { applyMiddleware } from './config/server/applyMiddleware'
import { resolvers } from './resolvers'

const main = async () => {
  try {
    const server = createServer()
    await connectToDatabase()
    applyMiddleware(server, middleware)

    const gqlServer = new ApolloServer({
      plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
      schema: await buildSchema({ resolvers }),
      context: ({ req, res }) => ({ req, res, redis }),
    })

    await gqlServer.start()

    gqlServer.applyMiddleware({ app: server, cors: false })

    const PORT = process.env.PORT || 4000

    server.listen({ port: PORT }, () =>
      console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`)
    )
  } catch (error) {
    console.log(error)
  }
}

main()
