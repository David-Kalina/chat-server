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
  @UseMiddleware(isAuth)
  async servers(@Ctx() { req }: MyContext): Promise<Server[]> {
    const entityManager = getManager()

    const servers = entityManager
      .createQueryBuilder(Server, 'server')
      .leftJoinAndSelect('server.users', 'users')
      .where('users."globalUserReferenceId" = :userId', { userId: req.session.userId })
      .getMany()

    return servers
  }

  @Query(() => Server)
  @UseMiddleware([isAuth])
  async server(@Arg('serverReferenceId') serverReferenceId: string): Promise<Server> {
    const server = await Server.findOne({ where: { serverReferenceId } })

    if (!server) {
      throw new Error('Server not found')
    }

    return server
  }

  @Mutation(() => Boolean)
  @UseMiddleware([isAuth])
  async joinServer(
    @Arg('serverReferenceId') serverReferenceId: string,
    @Ctx() { req }: MyContext
  ): Promise<Boolean> {
    try {
      const user = await GlobalUser.findOne({ where: { globalUserId: req.session.userId } })

      if (!user) {
        throw new Error('User not found')
      }

      const server = await Server.findOne({ where: { serverReferenceId } })

      if (!server) {
        throw new Error('Server not found')
      }

      await LocalUser.create({
        localId: uniqid('l-'),
        globalUser: user,
        globalUserReferenceId: user.globalUserId,
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

    console.log(server.serverReferenceId)

    req.session.connectedServerId = server.serverReferenceId
    return server
  }

  @Mutation(() => Server)
  @UseMiddleware([isAuth])
  async createServer(
    @Arg('options') options: CreateServerInput,
    @Ctx() { req }: MyContext
  ): Promise<Server> {
    const owner = await GlobalUser.findOne({ where: { globalUserId: req.session.userId } })

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
      globalUserReferenceId: owner.globalUserId,
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

  @Mutation(() => Boolean)
  @UseMiddleware([isAuth])
  async leaveServer(@Ctx() { req }: MyContext): Promise<Boolean> {
    console.log(req.session.connectedServerId)

    const user = await LocalUser.findOne({
      where: [
        {
          globalUserReferenceId: req.session.userId,
        },

        {
          serverReferenceId: req.session.connectedServerId,
        },
      ],
    })

    if (!user) {
      throw new Error('User not found')
    }

    await user.remove()

    return true
  }

  @Mutation(() => Boolean)
  @UseMiddleware([isAuth])
  async deleteServer(@Arg('serverReferenceId') serverReferenceId: string): Promise<Boolean> {
    const server = await Server.findOne({ where: { serverReferenceId } })

    if (!server) {
      throw new Error('Server not found')
    }

    await server.remove()

    return true
  }
}
