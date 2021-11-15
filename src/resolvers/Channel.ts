import { isAuth } from '../middleware/isAuth'
import { isConnectedToServer } from '../middleware/isConnectedToServer'
import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql'
import uniqid from 'uniqid'
import { Channel } from '../Entities/Channel'
import { Server } from '../Entities/Server'
import { ChatRoom } from '../Entities/ChatRoom'
import { CreateChannelInput } from '../inputTypes/Channel'
import { MyContext } from '../types'

@Resolver(Channel)
export class ChannelResolver {
  @Query(() => [Channel])
  @UseMiddleware([isAuth, isConnectedToServer])
  async channels(@Arg('serverReferenceId') serverReferenceId: string) {
    try {
      return await Channel.find({ where: { serverReferenceId } })
    } catch (error) {
      return error
    }
  }

  @FieldResolver()
  inviteUrl(@Root() parent: Channel) {
    return parent.serverReferenceId
  }

  @Query(() => Channel)
  @UseMiddleware([isAuth, isConnectedToServer])
  async channel(@Arg('channelReferenceId') channelReferenceId: string) {
    try {
      return await Channel.findOne({ where: { channelReferenceId } })
    } catch (error) {
      return error
    }
  }

  @Mutation(() => Channel)
  async connectToChannel(
    @Arg('channelReferenceId') channelReferenceId: string,
    @Ctx() { req }: MyContext
  ): Promise<Channel> {
    const channel = await Channel.findOne({
      relations: ['chatRoom'],
      where: { channelReferenceId },
    })
    if (!channel) {
      throw new Error('Channel not found')
    }

    req.session.connectedChannelId = channel.channelReferenceId
    req.session.connectedChatRoomId = channel.chatRoom.chatRoomReferenceId
    return channel
  }

  @Mutation(() => Channel)
  @UseMiddleware([isAuth, isConnectedToServer])
  async createChannel(
    @Arg('options') options: CreateChannelInput,
    @Ctx() { req }: MyContext
  ): Promise<Channel> {
    try {
      const serverReferenceId = req.session.connectedServerId

      const server = await Server.findOne({ where: { serverReferenceId } })

      if (!server) {
        throw new Error('Server not found')
      }

      const channel = await Channel.create({
        ...options,
        channelReferenceId: uniqid('c-'),
        serverReferenceId: server.serverReferenceId,
        server,
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

      return channel
    } catch (error) {
      console.log(error)
      return error
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware([isAuth, isConnectedToServer])
  async deleteChannel(@Ctx() { req }: MyContext) {
    try {
      await Channel.delete({ channelReferenceId: req.session.connectedChannelId })
      return true
    } catch (error) {
      return error
    }
  }

  @Mutation(() => Channel)
  @UseMiddleware([isAuth, isConnectedToServer])
  async editChannel(@Ctx() { req }: MyContext, @Arg('options') options: CreateChannelInput) {
    try {
      const channel = await Channel.findOne({
        where: { channelReferenceId: req.session.connectedChannelId },
      })
      if (!channel) {
        throw new Error('Channel not found')
      }
      await Channel.update({ channelReferenceId: req.session.connectedChannelId }, options)
      return await Channel.findOne({
        where: { channelReferenceId: req.session.connectedChannelId },
      })
    } catch (error) {
      return error
    }
  }
}
