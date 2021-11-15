import 'reflect-metadata'
import { ChatBlock } from '../Entities/ChatBlock'
import { Field, ID, ObjectType } from 'type-graphql'
import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { GlobalUser } from './GlobalUser'
import { Server } from './Server'
@ObjectType()
@Entity()
export class LocalUser extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Field()
  @Column({ nullable: false, unique: true })
  localUserReferenceId: string

  @Field()
  @Column({ nullable: false })
  globalUserReferenceId: string

  @ManyToOne(() => Server, server => server.channels, { onDelete: 'CASCADE' })
  server: Server

  @Field()
  @Column({ nullable: false })
  serverReferenceId: string

  @ManyToOne(() => GlobalUser, user => user.localUser)
  globalUser: GlobalUser

  @OneToMany(() => ChatBlock, chatBlock => chatBlock.user)
  chatBlocks: ChatBlock[]
}
