import { InputType, Field } from 'type-graphql'

@InputType()
export class CreateChannelInput {
  @Field()
  name: string

  @Field()
  description: string

  @Field()
  serverId: string
}
