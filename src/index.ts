import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import { ApolloServer } from 'apollo-server-express'
import cors from 'cors'
import express from 'express'
import session from 'express-session'
import { createServer } from 'http'
import { buildSchema } from 'type-graphql'
import { connectToDatabase } from './config/db/connection'
import { sessionConfig } from './config/middleware/session'
import { redis } from './config/redis'
import { resolvers } from './resolvers'
import { Server } from 'socket.io'
import { Server as ServerNameSpace } from './Entities/Server'
import { ChatBlock } from './Entities/ChatBlock'

const main = async () => {
  try {
    const app = express()
    app.set('trust proxy', 1)
    const mySession = session(sessionConfig)

    const httpServer = createServer(app)
    const io = new Server(httpServer, { cors: { origin: process.env.CORS_ORIGIN } })

    app.use(cors({ origin: 'http://localhost:3000', credentials: true }), mySession)

    const schema = await buildSchema({ resolvers })

    await connectToDatabase()

    const gqlServer = new ApolloServer({
      plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
      schema,
      context: ({ req, res }) => ({ req, res, redis }),
    })

    await gqlServer.start()

    gqlServer.applyMiddleware({ app, cors: false })

    const PORT = process.env.PORT || 4000

    const servers = await ServerNameSpace.find({ relations: ['channels'] })

    servers.forEach((server: ServerNameSpace) => {
      io.of(`/${server.serverReferenceId}`).on('connection', async socket => {
        socket.emit('numberOfConnectedUsers', { data: Array.from(socket.rooms) })

        socket.on('join', async ({ channelId }) => {
          console.log(`${socket.id} joined ${channelId}`)
          await socket.join(channelId)

          socket.on('message', async ({ channelId }) => {
            const chatBlocks = await ChatBlock.find({
              relations: ['messages'],
              where: { channelReferenceId: channelId },
            })

            console.log(chatBlocks)

            io.of(`/${server.serverReferenceId}`).to(channelId).emit('chatBlocks', chatBlocks)
          })
        })

        console.log('a user connected')
        socket.on('disconnect', () => {
          console.log('user disconnected')
        })
      })
    })

    httpServer.listen({ port: PORT }, () =>
      console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`)
    )
  } catch (error) {
    console.log(error)
    return error
  }
}

main()
