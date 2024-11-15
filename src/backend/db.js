const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

// Configurações do banco de dados
const DB_HOST = process.env.DB_HOST || '194.195.213.74';
const DB_USER = process.env.DB_USER || 'ifc';
const DB_PASSWORD = process.env.DB_PASSWORD || 'ifcs0mbrio';
const DB_NAME = process.env.DB_NAME || 'abelhas';
const PORT = process.env.PORT || 3000;

// Conexão com o banco de dados
const db = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
        return;
    }
    console.log('Conectado ao banco de dados com sucesso!');
});

module.exports = db;
