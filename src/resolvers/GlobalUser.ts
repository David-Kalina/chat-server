import { RegisterInput } from '../inputTypes/Register'
import { MyContext } from 'src/types'
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { GlobalUser } from '../Entities/GlobalUser'
import bcrypt from 'bcryptjs'
import uniqid from 'uniqid'
import { LoginInput } from '../inputTypes/Login'
import { isAuth } from '../middleware/isAuth'

@Resolver(GlobalUser)
export class GlobalUserResolver {
  @Query(() => String)
  hello() {
    return 'Hello World!'
  }

  @Query(() => String)
  @UseMiddleware(isAuth)
  async getOnlineStatus(@Ctx() { req }: MyContext) {
    if (!req.session!.userId) {
      return 'offline'
    }
    const userStatus = req.session.onlineStatus
    if (!userStatus) {
      return 'offline'
    }
    return userStatus
  }

  @Mutation(() => String)
  @UseMiddleware(isAuth)
  async setOnlineStatus(
    @Arg('onlineStatus') onlineStatus: string,
    @Ctx() { req }: MyContext
  ): Promise<String> {
    if (!req.session!.userId) {
      return 'offline'
    }

    req.session.onlineStatus = onlineStatus
    return req.session.onlineStatus
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { req, res }: MyContext) {
    try {
      return new Promise((resolve, reject) => {
        req.session!.destroy(err => {
          if (err) {
            console.log(err)
            reject(false)
          }
          res.clearCookie('qid')
          resolve(true)
        })
      })
    } catch (error) {
      console.log(error)
      return error
    }
  }

  @Mutation(() => GlobalUser)
  async register(
    @Arg('options') options: RegisterInput,
    @Ctx() { req }: MyContext
  ): Promise<GlobalUser> {
    try {
      const user = await GlobalUser.create({
        ...options,
        globalUserId: uniqid('global-'),
        password: await bcrypt.hash(options.password, 12),
      }).save()

      req.session.userId = user.globalUserId
      req.session.onlineStatus = 'online'

      return user
    } catch (error) {
      throw new Error(error)
    }
  }

  @Mutation(() => GlobalUser)
  async login(@Arg('options') options: LoginInput, @Ctx() { req }: MyContext): Promise<GlobalUser> {
    try {
      const user = await GlobalUser.findOne({ where: { email: options.email } })

      if (!user) {
        throw new Error('User not found')
      }

      const valid = await bcrypt.compare(options.password, user.password)

      if (!valid) {
        throw new Error('Invalid password')
      }

      req.session.userId = user.globalUserId
      req.session.onlineStatus = 'online'

      return user
    } catch (error) {
      throw new Error(error)
    }
  }
}
