import { DataSource } from "typeorm";

export const appDataSource = new DataSource({
    type: "mysql",
    host: "0.0.0.0",
    port: 3306,
    username: "root",
    password: "123321",
    database: "app",
    synchronize: true,
    logging: true,
    entities: [],
    subscribers: [],
    migrations: [],
})

