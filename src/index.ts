import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import { ApolloServer } from 'apollo-server-express'
import cors from 'cors'
import express from 'express'
import session from 'express-session'
import { PubSub } from 'graphql-subscriptions'
import { buildSchema } from 'type-graphql'
import { connectToDatabase } from './config/db/connection'
import { sessionConfig } from './config/middleware/session'
import { redis } from './config/redis'
import { resolvers } from './resolvers'

const main = async () => {
  try {
    const app = express()
    app.set('trust proxy', 1)
    app.use(cors({ origin: 'http://localhost:3000', credentials: true }), session(sessionConfig))

    const pubSub = new PubSub()

    await connectToDatabase()

    const gqlServer = new ApolloServer({
      plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
      schema: await buildSchema({ resolvers, pubSub }),

      context: ({ req, res }) => ({ req, res, redis }),
    })

    await gqlServer.start()

    gqlServer.applyMiddleware({ app, cors: false })

    const PORT = process.env.PORT || 4000

    app.listen({ port: PORT }, () =>
      console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

main()
