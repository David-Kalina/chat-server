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
  async channel(@Arg('channelId') channelId: string) {
    try {
      return await Channel.findOne({ where: { channelId } })
    } catch (error) {
      return error
    }
  }

  @Mutation(() => Channel)
  async connectToChannel(
    @Arg('channelId') channelId: string,
    @Ctx() { req }: MyContext
  ): Promise<Channel> {
    const channel = await Channel.findOne({ where: { channelId } })
    if (!channel) {
      throw new Error('Channel not found')
    }
    req.session.connectedChannelId = channel.channelId
    return channel
  }

  @Mutation(() => Channel)
  @UseMiddleware([isAuth, isConnectedToServer])
  async createChannel(
    @Arg('options') options: CreateChannelInput,
    @Ctx() { req }: MyContext
  ): Promise<Channel> {
    console.log('Hello')
    try {
      const serverReferenceId = req.session.connectedServerId

      const server = await Server.findOne({ where: { serverReferenceId } })

      if (!server) {
        throw new Error('Server not found')
      }

      const channel = await Channel.create({
        ...options,
        channelId: uniqid('c-'),
        serverReferenceId: server.serverReferenceId,
        server,
      }).save()

      return channel
    } catch (error) {
      console.log(error)
      return error
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware([isAuth, isConnectedToServer])
  async deleteChannel(@Arg('channelId') channelId: string) {
    try {
      await Channel.delete({ channelId })
      return true
    } catch (error) {
      return error
    }
  }

  @Mutation(() => Channel)
  @UseMiddleware([isAuth, isConnectedToServer])
  async editChannel(
    @Arg('channelId') channelId: string,
    @Arg('options') options: CreateChannelInput
  ) {
    try {
      const channel = await Channel.findOne({ where: { channelId } })
      if (!channel) {
        throw new Error('Channel not found')
      }
      await Channel.update({ channelId }, options)
      return await Channel.findOne({ where: { channelId } })
    } catch (error) {
      return error
    }
  }
}
