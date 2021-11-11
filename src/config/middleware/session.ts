import { COOKIE_NAME, __prod__ } from '../../constants'
import { redis, RedisStore } from '../redis'
import { SessionOptions } from 'express-session'

import { config } from 'dotenv'

config()

export const sessionConfig: SessionOptions = {
  name: COOKIE_NAME,
  store: new RedisStore({
    client: redis,
    disableTouch: true,
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
    httpOnly: true,
    secure: __prod__,
    sameSite: 'lax',
  },
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: false,
}
