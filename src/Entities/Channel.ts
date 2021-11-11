import { Field, ID, ObjectType } from 'type-graphql'
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import 'reflect-metadata'
@ObjectType()
@Entity()
export class Channel extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Field()
  @Column('uuid')
  serverId: string

  @Field()
  @Column({ length: 255 })
  name: string

  @Field()
  @Column({ length: 500 })
  description: string
}
