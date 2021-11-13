"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
const entities_1 = require("./entities");
(0, dotenv_1.config)();
async function connectToDatabase() {
    await (0, typeorm_1.createConnection)({
        password: process.env.DATABASE_PASSWORD,
        username: process.env.DATABASE_USERNAME,
        database: process.env.DATABASE_NAME,
        type: 'postgres',
        logging: false,
        port: 5432,
        synchronize: true,
        entities: entities_1.entities,
    });
}
exports.connectToDatabase = connectToDatabase;
//# sourceMappingURL=connection.js.map