import { Pool } from "pg";

export const connection = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: '123456',
    database: 'catalogo-pw3'
});