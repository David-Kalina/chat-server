import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Server } from '../Entities/Server'
import uniqid from 'uniqid'
import { CreateServerInput } from '../inputTypes/Server'
import { MyContext } from '../types'
import { GlobalUser } from '../Entities/GlobalUser'
import { Channel } from '../Entities/Channel'

@Resolver(Server)
export class ServerResolver {
  @Query(() => [Server])
  async servers() {
    return await Server.find()
  }

  @Mutation(() => String)
  async connectToServer(
    @Arg('serverId') serverId: string,
    @Ctx() { req }: MyContext
  ): Promise<String> {
    const server = await Server.findOne({ where: { serverId } })
    if (!server) {
      throw new Error('Server not found')
    }
    req.session.connectedServerId = server.serverId
    return server.serverId
  }

  @Mutation(() => Server)
  async createServer(
    @Arg('options') options: CreateServerInput,
    @Ctx() { req }: MyContext
  ): Promise<Server> {
    const owner = await GlobalUser.findOne(req.session.userId)

    if (!owner) {
      throw new Error('User not found')
    }

    const server = await Server.create({
      ...options,
      serverId: uniqid('s-'),
      owner,
    }).save()

    await Channel.create({
      name: 'general',
      description: 'General channel',
      server,
      channelId: uniqid('c-'),
      serverReferenceId: server.serverId,
    }).save()

    req.session.connectedServerId = server.serverId

    return server
  }
}
