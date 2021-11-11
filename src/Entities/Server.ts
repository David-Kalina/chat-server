import { Field, ID, ObjectType } from 'type-graphql'
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import 'reflect-metadata'
import { GlobalUser } from './GlobalUser'
@ObjectType()
@Entity()
export class Server extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Field()
  @Column({ unique: true, nullable: false })
  serverId: string

  @Field()
  @Column({ length: 255, unique: true })
  name: string

  @ManyToOne(() => GlobalUser, user => user.servers)
  owner: GlobalUser
}
