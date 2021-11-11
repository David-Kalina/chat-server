import { isAuth } from '../middleware/isAuth'
import { isConnectedToServer } from '../middleware/isConnectedToServer'
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import uniqid from 'uniqid'
import { Channel } from '../Entities/Channel'
import { Server } from '../Entities/Server'
import { CreateChannelInput } from '../inputTypes/Channel'
import { MyContext } from '../types'

@Resolver(Channel)
export class ChannelResolver {
  @Query(() => [Channel])
  async channels() {
    return await Channel.find()
  }

  @Mutation(() => Channel)
  @UseMiddleware([isAuth, isConnectedToServer])
  async createChannel(
    @Arg('options') options: CreateChannelInput,
    @Ctx() { req }: MyContext
  ): Promise<Channel> {
    const serverId = req.session.connectedServerId

    const server = await Server.findOne({ where: { serverId } })

    if (!server) {
      throw new Error('Server not found')
    }

    const channel = await Channel.create({
      ...options,
      channelId: uniqid('c-'),
      server,
    }).save()

    return channel
  }
}
