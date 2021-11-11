import { Field, ID, ObjectType } from 'type-graphql'
import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import 'reflect-metadata'
import { GlobalUser } from './GlobalUser'
import { Channel } from './Channel'
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

  @OneToMany(() => Channel, channel => channel.server)
  channels: Channel[]
}
