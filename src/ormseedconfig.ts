import { DataSource } from "typeorm";
import ormconfig  from '@app/ormconfig';

const ormSeedConfig = {
    ...ormconfig,
    migrations: ['src/seeds/*.ts']      // Don't write __dirname + 'src/seeds/*.ts' --> didn't work!!
}

export default new DataSource(ormSeedConfig);

