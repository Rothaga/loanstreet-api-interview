require('dotenv').config();
const { Pool } = require('pg')
const { v4: uuidv4 } = require('uuid');

const dbCreds = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD || null,
    port: process.env.DB_PORT,
};
const pool = new Pool(dbCreds)

async function initDb() {
    await pool.query(`CREATE TABLE IF NOT EXISTS loans ( 
        id varchar(36) NOT NULL,
        amount decimal NOT NULL,
        interest decimal NOT NULL,
        payment decimal NOT NULL,
        length integer NOT NULL,
        PRIMARY KEY (id)
    )`);
}

async function createLoan(amount, interest, length, payment) {
    const id = uuidv4();
    await pool.query(`INSERT INTO loans (id, amount, interest, length, payment)
        VALUES ($1, $2, $3, $4, $5)`,[id, amount, interest, length, payment]);
    return id;
}

async function getLoan(id) {
    const loan = await pool.query(`SELECT * from loans WHERE id = $1`, [id]);
    return loan.rows[0];
}

async function updateLoan(id, updatedLoan) {
    const keys = Object.keys(updatedLoan);
    const values = Object.values(updatedLoan);
    const queryString = keys.map((key, index) => `${key} = $${index + 1}`).join(',');
    await pool.query(`UPDATE loans SET ${queryString} WHERE id = $${keys.length + 1}`,[...values, id]);
}

module.exports = {
    initDb,
    createLoan,
    getLoan,
    updateLoan,
}
