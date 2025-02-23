const express = require("express");
const app = express();
const fs = require('fs');
const port = process.env.PORT || 3000;
const path = require('path');
app.use(express.json());

const filePath = path.join(__dirname, 'produtos.json');

// Função para ler os produtos do arquivo
const lerProdutos = () => {
    if (!fs.existsSync(filePath)) return [];
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
};
  
// Função para salvar os produtos no arquivo
const salvarProdutos = (produtos) => {
    fs.writeFileSync(filePath, JSON.stringify(produtos, null, 2));
};

app.get("/", (req, res) => {
  res.send("Servidor Node.js rodando no GitHub Codespaces!");
});

// Criar um novo produto
app.post('/produto', (req, res) => {
    const { nome, descricao, preco, estoque, categoria } = req.body;
    const produtos = lerProdutos();
    const novoProduto = {
      id: produtos.length ? produtos[produtos.length - 1].id + 1 : 1,
      nome,
      descricao,
      preco,
      estoque,
      categoria,
    };
    produtos.push(novoProduto);
    salvarProdutos(produtos);
    res.status(201).json(novoProduto);
  });
  
  // Obter produtos por nome
  app.get('/produto', (req, res) => {
    const { nome } = req.query;
    const produtos = lerProdutos();
    const filtrados = nome ? produtos.filter(p => p.nome.toLowerCase().includes(nome.toLowerCase())) : produtos;
    res.json(filtrados);
  });
  
  // Atualizar um produto por ID
  app.put('/produto/:id', (req, res) => {
    const { id } = req.params;
    const { nome, descricao, preco, estoque, categoria } = req.body;
    const produtos = lerProdutos();
    const index = produtos.findIndex(p => p.id == id);
    if (index === -1) return res.status(404).json({ message: 'Produto não encontrado' });
    
    produtos[index] = { ...produtos[index], nome, descricao, preco, estoque, categoria };
    salvarProdutos(produtos);
    res.json(produtos[index]);
  });
  
  // Deletar um produto por ID
  app.delete('/produto/:id', (req, res) => {
    const { id } = req.params;
    let produtos = lerProdutos();
    const novoProdutos = produtos.filter(p => p.id != id);
    if (novoProdutos.length === produtos.length) return res.status(404).json({ message: 'Produto não encontrado' });
    
    salvarProdutos(novoProdutos);
    res.json({ message: 'Produto deletado com sucesso' });
  });

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});