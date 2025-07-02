const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let usuarios = [
  {
    id: 1,
    nome: 'Maria',
    senha: '123456',
    dataNascimento: '1990-05-10',
    email: 'maria@email.com',
    ativo: true
  },
  {
    id: 2,
    nome: 'João',
    senha: 'abcdef',
    dataNascimento: '1985-11-20',
    email: 'joao@email.com',
    ativo: false
  }
];

// GET /usuarios
app.get('/usuarios', (req, res) => {
  res.json(usuarios);
});

// GET /usuarios/:id
app.get('/usuarios/:id', (req, res) => {
  const usuario = usuarios.find(u => u.id === parseInt(req.params.id));
  if (usuario) res.json(usuario);
  else res.status(404).json({ erro: 'Usuário não encontrado' });
});

// GET /usuarios?dataNascimento=1990-05-10
app.get('/usuarios-filtro', (req, res) => {
  const { ativo, dataNascimento, nome, email } = req.query;
  let resultado = [...usuarios];

  if (ativo !== undefined) {
    resultado = resultado.filter(u => u.ativo === (ativo === 'true'));
  }

  if (dataNascimento) {
    resultado = resultado.filter(u => u.dataNascimento === dataNascimento);
  }

  if (nome) {
    resultado = resultado.filter(u => u.nome.toLowerCase().includes(nome.toLowerCase()));
  }

  if (email) {
    resultado = resultado.filter(u => u.email.toLowerCase().includes(email.toLowerCase()));
  }

  res.json(resultado);
});


// POST /usuarios
app.post('/usuarios', (req, res) => {
  const novoUsuario = {
    id: usuarios.length + 1,
    nome: req.body.nome,
    senha: req.body.senha,
    dataNascimento: req.body.dataNascimento,
    email: req.body.email,
    ativo: true
  };
  usuarios.push(novoUsuario);
  res.status(201).json(novoUsuario);
});

// PUT /usuarios/:id
app.put('/usuarios/:id', (req, res) => {
  const usuario = usuarios.find(u => u.id === parseInt(req.params.id));
  if (!usuario) return res.status(404).json({ erro: 'Usuário não encontrado' });

  const { nome, senha, dataNascimento, email, ativo } = req.body;
  if (nome !== undefined) usuario.nome = nome;
  if (senha !== undefined) usuario.senha = senha;
  if (dataNascimento !== undefined) usuario.dataNascimento = dataNascimento;
  if (email !== undefined) usuario.email = email;
  if (ativo !== undefined) usuario.ativo = ativo;

  res.json(usuario);
});

// DELETE /usuarios/:id
app.delete('/usuarios/:id', (req, res) => {
  usuarios = usuarios.filter(u => u.id !== parseInt(req.params.id));
  res.json({ mensagem: 'Usuário deletado' });
});

// POST /login
app.post('/login', (req, res) => {
  const { email, senha } = req.body;
  const usuario = usuarios.find(u => u.email === email && u.senha === senha);

  if (usuario) {
    res.json({ mensagem: 'Login realizado com sucesso', usuario });
  } else {
    res.status(401).json({ erro: 'Credenciais inválidas' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
