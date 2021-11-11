import Redis from 'ioredis'
import redisConnector from 'connect-redis'
import session from 'express-session'

export const RedisStore = redisConnector(session)
export const redis = new Redis()
