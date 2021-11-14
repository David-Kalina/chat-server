import { MiddlewareFn } from 'type-graphql'
import { MyContext } from '../types'

export const isConnectedToServer: MiddlewareFn<MyContext> = ({ context, args }, next) => {
  if (!context.req.session.connectedServerId) {
    throw new Error('not connected to server')
  }

  if (!context.req.session.connectedServerId === args.serverId) {
    console.log('Insane')
    throw new Error('not connected to server')
  }

  return next()
}
