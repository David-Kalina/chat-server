import { Field, ObjectType } from 'type-graphql'
import { Server } from '../Entities/Server'

@ObjectType()
export class ServerResponse {
  @Field(() => Server)
  server: Server

  @Field(() => String, { nullable: true })
  channelReferenceId?: string | null
}
