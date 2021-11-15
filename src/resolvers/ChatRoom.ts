import { ChatRoom } from '../Entities/ChatRoom'
import { isAuth } from '../middleware/isAuth'
import { isConnectedToChannel } from '../middleware/isConnectedToChannel'
import { isConnectedToServer } from '../middleware/isConnectedToServer'
import { MyContext } from '../types'
import { Ctx, Query, Resolver, UseMiddleware } from 'type-graphql'

@Resolver(ChatRoom)
export class ChatRoomResolver {
  @Query(() => ChatRoom)
  @UseMiddleware(isAuth, isConnectedToServer, isConnectedToChannel)
  async chatRoom(@Ctx() { req }: MyContext) {
    return await ChatRoom.findOne({
      where: { chatRoomReferenceId: req.session.connectedChatRoomId },
    })
  }
}
