import { LocalUser } from '../Entities/LocalUser'
import { Message } from '../Entities/Message'
import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class ChatBlock {
  @Field(() => LocalUser)
  user: LocalUser

  @Field(() => [Message])
  messages: Message[]

  @Field(() => Date)
  lastMessageDate: Date

  @Field(() => Boolean)
  isMine: boolean
}
