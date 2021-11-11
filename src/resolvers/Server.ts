import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Server } from '../Entities/Server'
import uniqid from 'uniqid'
import { CreateServerInput } from '../inputTypes/Server'
import { MyContext } from '../types'
import { GlobalUser } from '../Entities/GlobalUser'

@Resolver(Server)
export class ServerResolver {
  @Query(() => [Server])
  async servers() {
    return await Server.find()
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

    return server
  }
}
