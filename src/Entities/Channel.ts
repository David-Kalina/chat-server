import { Field, ID, ObjectType } from 'type-graphql'
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import 'reflect-metadata'
import { Server } from './Server'
@ObjectType()
@Entity()
export class Channel extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Field()
  @Column()
  channelId: string

  @Field()
  @Column()
  serverReferenceId: string

  @Field()
  @Column({ length: 255 })
  name: string

  @Field()
  @Column({ length: 500 })
  description: string

  @ManyToOne(() => Server, server => server.channels)
  server: Server
}
