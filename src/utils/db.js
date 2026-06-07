import pg from 'pg';
import 'dotenv/config';

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL, ssl: {
        require: true,
    }
})

export default pool;