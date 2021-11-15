import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import { ApolloServer } from 'apollo-server-express'
import cors from 'cors'
import express from 'express'
import session from 'express-session'
import { execute, subscribe } from 'graphql'
import { createServer } from 'http'
import { SubscriptionServer } from 'subscriptions-transport-ws'
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

    const httpServer = createServer(app)

    await connectToDatabase()

    const subscriptionServer = SubscriptionServer.create(
      {
        // This is the `schema` we just created.
        schema: await buildSchema({ resolvers }),

        // These are imported from `graphql`.
        execute,
        subscribe,
      },
      {
        // This is the `httpServer` we created in a previous step.
        server: httpServer,
        // This `server` is the instance returned from `new ApolloServer`.
        path: '/subscriptions',
      }
    )
    const gqlServer = new ApolloServer({
      plugins: [
        ApolloServerPluginLandingPageGraphQLPlayground(),
        {
          async serverWillStart() {
            return {
              async drainServer() {
                subscriptionServer.close()
              },
            }
          },
        },
      ],
      schema: await buildSchema({ resolvers }),

      context: ({ req, res }) => ({ req, res, redis }),
    })

    await gqlServer.start()

    gqlServer.applyMiddleware({ app, cors: false })

    const PORT = process.env.PORT || 4000

    httpServer.listen({ port: PORT }, () =>
      console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

main()
