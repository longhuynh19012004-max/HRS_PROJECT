const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: '123456',
  database: 'postgres'
});

async function createDb() {
  try {
    await client.connect();
    await client.query('CREATE DATABASE hrm_db;');
    console.log('Database hrm_db created successfully');
  } catch (err) {
    if (err.code === '42P04') {
      console.log('Database hrm_db already exists');
    } else {
      console.error('Error creating database:', err);
    }
  } finally {
    await client.end();
  }
}

createDb();
