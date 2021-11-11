import { Express } from 'express'

export function applyMiddleware(app: Express, middleware: any) {
  Object.values(middleware).forEach((m: any) => {
    app.use(m)
  })
}
