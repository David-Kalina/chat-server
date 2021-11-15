import { Arg, Ctx, FieldResolver, Query, Resolver, Root } from 'type-graphql'
import { ChatBlock } from '../Entities/ChatBlock'
import { MyContext } from '../types'

@Resolver(ChatBlock)
export class ChatBlockResolver {
  @Query(() => [ChatBlock], { nullable: true })
  async chatBlocks(@Arg('channelReferenceId') channelReferenceId: string) {
    // ! Use query builder to fetch proper order
    const chatBlocks = await ChatBlock.find({
      relations: ['messages', 'user'],
      where: {
        channelReferenceId,
      },
    })

    return chatBlocks
  }

  @FieldResolver(() => Boolean)
  isMine(@Root() parent: ChatBlock, @Ctx() { req }: MyContext) {
    console.log(
      `CHATBLOCK USER ID: ${parent.userReferenceId}, LOGGED IN USER LOCAL ID: ${req.session.localId}`
    )
    return req.session.localId === parent.userReferenceId
  }
}
