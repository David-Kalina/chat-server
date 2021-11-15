import { ChatRoom } from '../../Entities/ChatRoom'
import { Channel } from '../../Entities/Channel'
import { GlobalUser } from '../../Entities/GlobalUser'
import { LocalUser } from '../../Entities/LocalUser'
import { Server } from '../../Entities/Server'
import { Message } from '../../Entities/Message'
import { ChatBlock } from '../../Entities/ChatBlock'

export const entities = [Channel, GlobalUser, LocalUser, Server, ChatRoom, Message, ChatBlock]
