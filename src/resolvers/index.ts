import { BuildSchemaOptions } from 'type-graphql'
import { GlobalUserResolver } from './GlobalUser'
import { ServerResolver } from './Server'

export const resolvers: BuildSchemaOptions['resolvers'] = [GlobalUserResolver, ServerResolver]
