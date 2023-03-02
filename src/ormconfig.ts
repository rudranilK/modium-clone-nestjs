import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

const config: PostgresConnectionOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'mediumclone',
    password: '123',
    database: 'mediumclone',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],     //look for all the files with '*.entity.js' | '*.entity.ts' ; no matter how deep
    synchronize: false,
    migrations: [__dirname + '/migrations/**/*{.ts,.js}']
}

export default config;