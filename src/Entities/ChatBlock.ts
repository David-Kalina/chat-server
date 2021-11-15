import 'reflect-metadata'
import { Field, ID, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { ChatRoom } from './ChatRoom'
import { LocalUser } from './LocalUser'
import { Message } from './Message'
@ObjectType()
@Entity()
export class ChatBlock extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Field()
  @Column()
  channelReferenceId: string

  @Field()
  @Column()
  chatRoomReferenceId: string

  @Field()
  @Column()
  userReferenceId: string

  @Field()
  @Column()
  serverReferenceId: string

  @Field()
  @Column()
  chatBlockReferenceId: string

  @Field()
  @CreateDateColumn()
  createdAt: Date

  @Field()
  @UpdateDateColumn()
  updatedAt: Date

  @Field({ defaultValue: false })
  isMine: boolean

  @Field(() => LocalUser)
  @ManyToOne(() => LocalUser, localUser => localUser.chatBlocks, { onDelete: 'CASCADE' })
  user: LocalUser

  @ManyToOne(() => ChatRoom, chatRoom => chatRoom.chatBlocks, { onDelete: 'CASCADE' })
  chatRoom: ChatRoom

  @Field(() => [Message])
  @OneToMany(() => Message, message => message.chatBlock)
  messages: Message[]
}
