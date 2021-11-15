import 'reflect-metadata'
import { Field, ID, ObjectType } from 'type-graphql'
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { ChatBlock } from '../Entities/ChatBlock'
@ObjectType()
@Entity()
export class ChatRoom extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Field()
  @Column()
  chatRoomReferenceId: string

  @Field()
  @Column()
  channelReferenceId: string

  @Field()
  @Column()
  serverReferenceId: string

  @Field(() => [ChatBlock])
  @OneToMany(() => ChatBlock, chatblock => chatblock.chatRoom)
  chatBlocks: ChatBlock[]
}
