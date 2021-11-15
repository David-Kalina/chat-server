import { BuildSchemaOptions } from 'type-graphql'
import { ChannelResolver } from './Channel'
import { ChatBlockResolver } from './ChatBlock'
import { GlobalUserResolver } from './GlobalUser'
import { MessageResolver } from './Message'
import { ServerResolver } from './Server'

export const resolvers: BuildSchemaOptions['resolvers'] = [
  GlobalUserResolver,
  ServerResolver,
  ChannelResolver,
  MessageResolver,
  ChatBlockResolver,
]
