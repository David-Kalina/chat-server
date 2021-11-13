import { RegisterInput } from '../inputTypes/Register'
import { MyContext } from 'src/types'
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { GlobalUser } from '../Entities/GlobalUser'
import bcrypt from 'bcryptjs'
import uniqid from 'uniqid'
import { LoginInput } from '../inputTypes/Login'

@Resolver(GlobalUser)
export class GlobalUserResolver {
  @Query(() => String)
  hello() {
    return 'Hello World!'
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

      return user
    } catch (error) {
      throw new Error(error)
    }
  }
}
