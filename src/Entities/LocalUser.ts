import { Field, ID, ObjectType } from 'type-graphql'
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import 'reflect-metadata'
@ObjectType()
@Entity()
export class LocalUser extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Field()
  @Column({ nullable: false, unique: true })
  local_id: string

  @Field()
  @Column({ nullable: false })
  global_id: string

  @Field()
  @Column('uuid', { nullable: false, unique: true })
  workspace_id: string
}
