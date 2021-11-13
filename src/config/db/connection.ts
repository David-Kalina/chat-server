import { createConnection } from 'typeorm'
import { config } from 'dotenv'
import { entities } from './entities'
config()

export async function connectToDatabase() {
  await createConnection({
    password: process.env.DATABASE_PASSWORD,
    username: process.env.DATABASE_USERNAME,
    database: process.env.DATABASE_NAME,
    type: 'postgres',
    logging: false,
    port: 5432,
    synchronize: true,
    entities,
  })
}
