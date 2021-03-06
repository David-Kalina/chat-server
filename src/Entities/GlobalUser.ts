import { Field, ID, ObjectType } from 'type-graphql'
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import 'reflect-metadata'
import { Server } from './Server'
import { LocalUser } from './LocalUser'
@ObjectType()
@Entity()
export class GlobalUser extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Field()
  @Column()
  email: string

  @Column()
  password: string

  @Field()
  @Column()
  firstName: string

  @Field()
  @Column()
  lastName: string

  @Field()
  connectedServerId: string

  @Field()
  onlineStatus: string

  @Field()
  @Column({ nullable: false, unique: true })
  globalUserId: string

  @Field()
  @Column('text', { nullable: true })
  profileURL?: string

  @OneToMany(() => Server, server => server.owner)
  servers: Server[]

  @OneToMany(() => LocalUser, user => user.globalUser)
  localUser: LocalUser[]
}
