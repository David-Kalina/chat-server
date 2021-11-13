import { Field, ID, ObjectType } from 'type-graphql'
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import 'reflect-metadata'
import { Server } from './Server'
import { GlobalUser } from './GlobalUser'
@ObjectType()
@Entity()
export class LocalUser extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Field()
  @Column({ nullable: false, unique: true })
  localId: string

  @Field()
  @Column({ nullable: false, unique: true })
  globalId: string

  @ManyToOne(() => Server, server => server.channels)
  server: Server

  @Field()
  @Column({ nullable: false, unique: true })
  serverReferenceId: string

  @ManyToOne(() => GlobalUser, user => user.localUser)
  globalUser: GlobalUser
}
