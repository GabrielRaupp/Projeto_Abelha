const express = require('express');
const cors = require('cors');
const db = require('../db'); // Ou a configuração do banco de dados

const app = express();

// Habilita o CORS para permitir requisições de outros domínios
const allowedOrigins = [
    'https://projeto-abelha.onrender.com',
    'http://localhost:3000', // Para ambiente de desenvolvimento local
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Não permitido pelo CORS'));
        }
    },
}));

// A rota da API
app.get('/api/telemetria', (req, res) => {
    const query = 'SELECT * FROM telemetria';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao executar consulta:', err);
            res.status(500).send({ message: 'Erro ao executar consulta' });
            return;
        }
        res.json(results);
    });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
