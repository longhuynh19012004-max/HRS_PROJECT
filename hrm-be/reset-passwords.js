const { Client } = require('pg');
const bcrypt = require('bcrypt');

const client = new Client({ host: 'localhost', port: 5432, user: 'postgres', password: '123456', database: 'hrm_db' });

async function resetPasswords() {
  try {
    await client.connect();
    const hash = await bcrypt.hash('123456', 10);
    await client.query('UPDATE accounts SET password = $1', [hash]);
    console.log('Passwords reset to 123456 successfully');
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}
resetPasswords();
