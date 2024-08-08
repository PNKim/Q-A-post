import "dotenv/config";
import * as pg from "pg";
const { Pool } = pg.default;

const connectionPool = new Pool({
  connectionString: process.env.Database,
});

export default connectionPool;
