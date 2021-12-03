import { Server } from '../Entities/Server'
import { MiddlewareFn } from 'type-graphql'
import { MyContext } from '../types'

export const isAllowedToConnectToServer: MiddlewareFn<MyContext> = async (
  { context, args },
  next
) => {
  const localUser = await Server.findOne({
    relations: ['users'],
    where: {
      serverReferenceId: args.serverReferenceId,
    },
  }).then(u => u?.users.find(u => u.globalUserReferenceId === context.req.session.userId))

  if (!localUser) {
    throw new Error('Not part of server')
  }

  if (!context.req.session.connectedServerId === args.serverId) {
    throw new Error('not connected to server')
  }

  return next()
}
