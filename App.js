const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente
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

// Garantir que a conexão seja bem-sucedida antes de iniciar o servidor
db.connect(err => {
    if (err) {
        console.error('Erro ao conectar-se ao banco de dados:', err);
        process.exit(1); // Encerra o processo se a conexão falhar
    } else {
        console.log('Conectado ao banco de dados MySQL');
    }
});

const app = express();

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'src', 'frontend')));

// Endpoint para dados de telemetria
app.get('/api/telemetria', (req, res) => {
    db.query('SELECT * FROM telemetria', (err, results) => {
        if (err) {
            console.error('Erro ao buscar dados de telemetria:', err);
            res.status(500).send('Erro ao buscar dados de telemetria');
        } else {
            res.json(results);
        }
    });
});

// Rota principal para servir o arquivo HTML
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'src', 'frontend', 'Index.html');
    res.sendFile(indexPath);
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
