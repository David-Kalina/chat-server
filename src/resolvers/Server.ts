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
import { isConnectedToServer } from '../middleware/isConnectedToServer'
import { ChatRoom } from '../Entities/ChatRoom'
import { ServerResponse } from '../objectTypes/ServerResponse'

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

  @Query(() => Number)
  @UseMiddleware(isAuth, isConnectedToServer)
  async getServerUsers(@Ctx() { req }: MyContext): Promise<Number> {
    const server = await Server.findOne({
      relations: ['users'],
      where: { serverReferenceId: req.session.connectedServerId },
    })

    if (!server) {
      throw new Error('Server not found')
    }

    return server.users.length
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

      const localUser = await LocalUser.create({
        localUserReferenceId: uniqid('l-'),
        globalUser: user,
        globalUserReferenceId: user.globalUserId,
        server,
        serverReferenceId: server.serverReferenceId,
      }).save()

      req.session.localId = localUser.localUserReferenceId

      return true
    } catch (error) {
      return error
    }
  }

  @Mutation(() => ServerResponse)
  @UseMiddleware([isAuth, isAllowedToConnectToServer])
  async connectToServer(
    @Arg('serverReferenceId') serverReferenceId: string,
    @Ctx() { req }: MyContext
  ): Promise<ServerResponse> {
    try {
      const server = await Server.findOne({
        relations: ['users', 'channels'],
        where: { serverReferenceId },
      })
      if (!server) {
        throw new Error('Server not found')
      }

      req.session.connectedServerId = server.serverReferenceId
      req.session.connectedChannelId = server.channels[0]?.channelReferenceId

      req.session.localId = server.users.find(
        user =>
          user.globalUserReferenceId === req.session.userId &&
          user.serverReferenceId === serverReferenceId
      )?.localUserReferenceId!

      console.log(server.channels[0]?.channelReferenceId)

      return { server, channelReferenceId: server.channels[0]?.channelReferenceId || null }
    } catch (error) {
      console.log(error)
      return error
    }
  }

  @Mutation(() => ServerResponse)
  @UseMiddleware([isAuth])
  async createServer(
    @Arg('options') options: CreateServerInput,
    @Ctx() { req }: MyContext
  ): Promise<ServerResponse> {
    const owner = await GlobalUser.findOne({ where: { globalUserId: req.session.userId } })

    if (!owner) {
      throw new Error('User not found')
    }

    const server = await Server.create({
      ...options,
      serverReferenceId: uniqid('s-'),
      owner,
    }).save()

    const localUser = await LocalUser.create({
      localUserReferenceId: uniqid('l-'),
      globalUser: owner,
      globalUserReferenceId: owner.globalUserId,
      server,
      serverReferenceId: server.serverReferenceId,
    }).save()

    const channel = await Channel.create({
      name: 'general',
      description: 'General channel',
      server,
      channelReferenceId: uniqid('c-'),
      serverReferenceId: server.serverReferenceId,
    }).save()

    const chatRoom = await ChatRoom.create({
      chatRoomReferenceId: uniqid('chat-'),
      channelReferenceId: channel.channelReferenceId,
      serverReferenceId: server.serverReferenceId,
    }).save()

    const channelWithChatRoom = await Channel.findOne({
      where: { channelReferenceId: channel.channelReferenceId },
    })

    if (!channelWithChatRoom) {
      throw new Error('Channel not found')
    }

    channelWithChatRoom.chatRoom = chatRoom

    await channelWithChatRoom.save()

    req.session.connectedServerId = server.serverReferenceId
    req.session.localId = localUser.localUserReferenceId
    req.session.localId = localUser.localUserReferenceId
    req.session.connectedChatRoomId = chatRoom.chatRoomReferenceId

    return { server, channelReferenceId: channel.channelReferenceId }
  }

  @Mutation(() => Boolean)
  @UseMiddleware([isAuth])
  async leaveServer(@Ctx() { req }: MyContext): Promise<Boolean> {
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
  async deleteServer(@Ctx() { req }: MyContext): Promise<Boolean> {
    const server = await Server.findOne({
      where: { serverReferenceId: req.session.connectedServerId },
    })

    if (!server) {
      throw new Error('Server not found')
    }

    await server.remove()

    return true
  }

  @Mutation(() => Server)
  @UseMiddleware([isAuth])
  async editServer(
    @Arg('serverReferenceId') serverReferenceId: string,
    @Arg('options') options: CreateServerInput
  ): Promise<Server> {
    const server = await Server.findOne({ where: { serverReferenceId } })

    if (!server) {
      throw new Error('Server not found')
    }

    await Server.merge(server, options).save()

    return server
  }
}
