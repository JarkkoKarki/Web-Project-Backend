/* eslint-disable no-undef */
import mysql from "mysql2";
import "dotenv/config";

/**
 * @module database
 * @description MySQL connection pool for the application.
 *
 * This module creates and exports a promise-based MySQL connection pool
 * using environment variables for configuration.
 *
 * @requires mysql2 - MySQL database driver for Node.js.
 * @requires dotenv - Loads environment variables from a .env file.
 * @requires mysql2/promise - Provides promise-based API for MySQL queries.
 *
 * @example
 * // Usage example:
 * import promisePool from './database';
 *
 * // Running a query
 * const [rows] = await promisePool.query('SELECT * FROM users');
 */

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const promisePool = pool.promise();
export default promisePool;
