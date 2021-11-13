import { isAllowedToConnectToServer } from '../middleware/isAllowedToConnectToServer'
import { isAuth } from '../middleware/isAuth'
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import uniqid from 'uniqid'
import { Channel } from '../Entities/Channel'
import { GlobalUser } from '../Entities/GlobalUser'
import { LocalUser } from '../Entities/LocalUser'
import { Server } from '../Entities/Server'
import { CreateServerInput } from '../inputTypes/Server'
import { MyContext } from '../types'
import { getManager } from 'typeorm'

@Resolver(Server)
export class ServerResolver {
  @Query(() => [Server])
  async servers(@Ctx() { req }: MyContext): Promise<Server[]> {
    const entityManager = getManager()

    const servers = await entityManager.find(Server, {
      where: {
        owner: {
          id: req.session.userId,
        },
      },
      relations: ['owner'],
    })

    return servers
  }

  @Query(() => Server)
  @UseMiddleware([isAuth])
  async server(@Arg('serverId') serverId: string): Promise<Server> {
    const server = await Server.findOne({ where: { serverId } })

    if (!server) {
      throw new Error('Server not found')
    }

    return server
  }

  @Mutation(() => Boolean)
  @UseMiddleware([isAuth])
  async joinServer(@Arg('serverId') serverId: string, @Ctx() { req }: MyContext): Promise<Boolean> {
    try {
      const user = await GlobalUser.findOne(req.session.userId)

      if (!user) {
        throw new Error('User not found')
      }

      const server = await Server.findOne({ where: { serverId } })

      if (!server) {
        throw new Error('Server not found')
      }

      await LocalUser.create({
        localId: uniqid('l-'),
        globalUser: user,
        globalId: user.id,
        server,
        serverReferenceId: server.serverReferenceId,
      }).save()

      return true
    } catch (error) {
      console.log(error)
      return error
    }
  }

  @Mutation(() => Server)
  @UseMiddleware([isAuth, isAllowedToConnectToServer])
  async connectToServer(
    @Arg('serverReferenceId') serverReferenceId: string,
    @Ctx() { req }: MyContext
  ): Promise<Server> {
    const server = await Server.findOne({ where: { serverReferenceId } })
    if (!server) {
      throw new Error('Server not found')
    }
    req.session.connectedServerId = server.serverReferenceId
    return server
  }

  @Mutation(() => Server)
  @UseMiddleware([isAuth])
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
      serverReferenceId: uniqid('s-'),
      owner,
    }).save()

    await LocalUser.create({
      localId: uniqid('l-'),
      globalUser: owner,
      globalId: owner.id,
      server,
      serverReferenceId: server.serverReferenceId,
    }).save()

    await Channel.create({
      name: 'general',
      description: 'General channel',
      server,
      channelId: uniqid('c-'),
      serverReferenceId: server.serverReferenceId,
    }).save()

    req.session.connectedServerId = server.serverReferenceId

    return server
  }
}
