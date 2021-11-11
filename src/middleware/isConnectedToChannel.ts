import { MiddlewareFn } from 'type-graphql'
import { MyContext } from '../types'

export const isConnectedToChannel: MiddlewareFn<MyContext> = ({ context, args }, next) => {
  if (!context.req.session.connectedChannelId) {
    throw new Error('not connected to channel')
  }

  if (!context.req.session.connectedChannelId === args.channelId) {
    throw new Error('not connected to channel')
  }

  return next()
}
