import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import { ApolloServer } from 'apollo-server-express'
import cors from 'cors'
import express from 'express'
import session from 'express-session'
import { buildSchema } from 'type-graphql'
import { connectToDatabase } from './config/db/connection'
import { sessionConfig } from './config/middleware/session'
import { redis } from './config/redis'
import { resolvers } from './resolvers'

const main = async () => {
  try {
    const app = express()

    app.use(cors({ origin: 'http://localhost:3000', credentials: true }), session(sessionConfig))

    await connectToDatabase()

    const gqlServer = new ApolloServer({
      plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
      schema: await buildSchema({ resolvers }),
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
  }
}

main()
