  const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'foodflow_db'
});

db.connect(err => {
    if (err) console.error('Erro no banco:', err.message);
    else console.log('✅ Servidor e Banco conectados!');
});

// Rota para salvar pedido
app.post('/pedido', (req, res) => {
    const { item, tipo, localizacao, hora, preco, cliente } = req.body;
    
    // Forçamos o preço a ser um número para o MySQL não se confundir
    const valorPreco = parseFloat(preco) || 0;
    const nomeCliente = cliente || "Anônimo";

    const sql = "INSERT INTO pedidos (item, tipo, localizacao, hora, preco, cliente) VALUES (?, ?, ?, ?, ?, ?)";
    
    db.query(sql, [item, tipo, localizacao, hora, valorPreco, nomeCliente], (err, result) => {
        if (err) {
            console.error("Erro ao inserir:", err);
            return res.status(500).json(err);
        }
        res.json({ mensagem: "Pedido salvo com sucesso!" });
    });
});

// Rota para listar pedidos no Dashboard
app.get('/listar-pedidos', (req, res) => {
    const sql = "SELECT * FROM pedidos ORDER BY id DESC";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.listen(3000, () => console.log('🚀 Servidor rodando na porta 3000'));