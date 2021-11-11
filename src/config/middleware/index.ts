import { corsConfig } from './cors'
import { sessionConfig } from './session'
import session from 'express-session'
import cors from 'cors'

export const middleware = {
  cors: cors(corsConfig),
  session: session(sessionConfig),
}
