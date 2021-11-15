import { ChatBlock } from '../Entities/ChatBlock'
import { Ctx, Query, Resolver } from 'type-graphql'
import { MyContext } from '../types'

@Resolver(ChatBlock)
export class ChatBlockResolver {
  @Query(() => [ChatBlock], { nullable: true })
  async chatBlocks(@Ctx() { req }: MyContext) {
    const chatBlocks = await ChatBlock.find({
      relations: ['messages', 'user'],
      order: { createdAt: 'ASC' },
    })

    console.log(chatBlocks)

    const mapped = chatBlocks.map(chatBlock => {
      if (chatBlock.userReferenceId === req.session.localId) {
        chatBlock.isMine = true
      } else {
        chatBlock.isMine = false
      }
      return chatBlock
    })

    console.log(mapped)

    return mapped
  }
}
