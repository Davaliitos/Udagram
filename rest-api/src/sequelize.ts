import { Sequelize } from 'sequelize-typescript';
import { configuration } from './config/config';

const c = configuration.dev;

//Instantiate new Sequelize instance
export const sequelize = new Sequelize({
    'username' : c.username,
    'password' : c.password,
    'database' : c.database,
    'host' : c.host,

    dialect : 'postgres',
    storage : ':memory:'
})