import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import uniqid from 'uniqid'
import { ChatBlock } from '../Entities/ChatBlock'
import { LocalUser } from '../Entities/LocalUser'
import { Message } from '../Entities/Message'
import { MyContext } from '../types'

@Resolver(Message)
export class MessageResolver {
  @Query(() => [Message])
  async messages(@Ctx() { req }: MyContext) {
    return await Message.find({
      where: { chatRoomReferenceId: req.session.connectedChatRoomId },
    })
  }

  @Mutation(() => Boolean)
  async createMessage(@Ctx() { req }: MyContext, @Arg('text') text: string): Promise<Boolean> {
    try {
      const user = await LocalUser.findOne({
        where: { localUserReferenceId: req.session.localId },
      })

      const mostRecentChatBlock = await ChatBlock.findOne({
        relations: ['messages', 'user'],
        where: { chatRoomReferenceId: req.session.connectedChatRoomId },
        order: { createdAt: 'DESC' },
      })

      if (mostRecentChatBlock && mostRecentChatBlock.userReferenceId === req.session.localId) {
        const message = await Message.create({
          text,
          chatBlockReferenceId: mostRecentChatBlock.chatBlockReferenceId,
          chatBlock: mostRecentChatBlock,
        }).save()

        mostRecentChatBlock.messages.push(message)
        await mostRecentChatBlock.save()
        return true
      } else {
        const chatBlock = await ChatBlock.create({
          user,
          channelReferenceId: req.session.connectedChannelId,
          serverReferenceId: req.session.connectedServerId,
          chatRoomReferenceId: req.session.connectedChatRoomId,
          userReferenceId: req.session.localId,
          isMine: req.session.localId === user?.localUserReferenceId,
          chatBlockReferenceId: uniqid('block-'),
        }).save()

        const addToChatBlock = await ChatBlock.findOne({
          relations: ['messages', 'user'],
          where: { chatBlockReferenceId: chatBlock.chatBlockReferenceId },
        })

        const message = await Message.create({
          text,
          chatBlockReferenceId: addToChatBlock?.chatBlockReferenceId,
          chatBlock: addToChatBlock,
        }).save()

        addToChatBlock?.messages.push(message)
        await chatBlock.save()

        return true
      }
    } catch (error) {
      return error
    }
  }
}
