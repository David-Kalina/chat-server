import { Channel } from '../Entities/Channel'
import { Field, ObjectType } from 'type-graphql'

@ObjectType()
export class ConnectResponse {
  @Field(() => Channel)
  channel: Channel

  @Field()
  localUserId: string
}
