import { BuildSchemaOptions } from 'type-graphql'
import { ChannelResolver } from './Channel'
import { GlobalUserResolver } from './GlobalUser'
import { ServerResolver } from './Server'

export const resolvers: BuildSchemaOptions['resolvers'] = [
  GlobalUserResolver,
  ServerResolver,
  ChannelResolver,
]
