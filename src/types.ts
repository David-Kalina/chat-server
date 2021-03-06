import { Request, Response } from 'express'
import { Session } from 'express-session'
import { Redis } from 'ioredis'

declare module 'express-session' {
  export interface SessionData {
    user: { [key: string]: any }
  }
}

export type MyContext = {
  req: Request & {
    session: Session & {
      userId: string
      localId: string
      connectedServerId: string
      connectedChannelId: string
      connectedChatRoomId: string
      onlineStatus: string
    }
  }
  redis: Redis
  res: Response
}
