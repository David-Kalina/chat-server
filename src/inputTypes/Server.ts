import { InputType, Field } from 'type-graphql'

@InputType()
export class CreateServerInput {
  @Field()
  name: string
}
