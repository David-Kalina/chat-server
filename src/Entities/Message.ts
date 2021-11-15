import 'reflect-metadata'
import { ChatBlock } from '../Entities/ChatBlock'
import { Field, ID, ObjectType } from 'type-graphql'
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
@ObjectType()
@Entity()
export class Message extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Field()
  @Column()
  text: string

  @Field()
  @CreateDateColumn()
  createdAt: Date

  @Field()
  @UpdateDateColumn()
  updatedAt: Date

  @Field()
  @Column()
  chatBlockReferenceId: string

  @ManyToOne(() => ChatBlock, chatBlock => chatBlock.messages, { onDelete: 'CASCADE' })
  chatBlock: ChatBlock
}
