import express from 'express';
import { PrismaClient } from '@prisma/client';

const cors = require('cors');
const prisma = new PrismaClient();
const app = express();
const jwt = require('jsonwebtoken');
const jwtSecret = '2T$Kjq8NW4g2T2&43Am2nH4Qt0Hp%l@1dq!y#30TZk0Nl7KSW0';
const argon2 = require('argon2');

//Importação das rotas
const routerPessoa = require('./routes/pessoa');
const routerAnimal = require('./routes/animal');
const routerAtributo = require('./routes/atributo');
const routerUser = require('./routes/user');
const routerEvento = require('./routes/evento');
const routerDesaparecido = require('./routes/desaparecido');
const routerCaracteristica = require('./routes/caracteristica');
const routerRegister = require('./routes/registrar')

app.use(cors());
app.use(express.json());

/*
  TOKEN:
    tokenId,
    userId
*/

//Verifica o Token e retorna o ID do usuário para a rota
function verifyJWT(req, res, next) {
  var token = req.headers['authorization'];
  try {
    token = token.split(" ")[1];
  }
  catch {
    return res.status(500).json({
      message: 'Formato do token inválido'
    });
  }
  if (!token) {
    return res.status(401).json({ message: 'Nenhum token fornecido' });
  }
  jwt.verify(token, jwtSecret, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Falha ao autenticar token' });
    }
    const whiteToken = await prisma.tokenWhiteList.findUnique({
      where: {
        id: decoded.tokenId
      }
    });
    if (whiteToken && (whiteToken.expiraEm - Date.now()) > 0 && whiteToken.userId == decoded.userId) {
      req.token = decoded;
      next();
      return;
    }
    return res.status(401).json({ message: 'Falha ao autenticar token' });
  })
}

//Token contém: userId, tokenId
app.post('/auth/login', async (req, res, next) => {
  try {
    if (!req.body.username || !req.body.password) {
      return res.status(500).json({
        message: "Estrutura de login incorreta"
      });
    }
    const user = await prisma.user.findUnique({
      where: {
        username: req.body.username
      }
    });
    if (user) {
      const pessoa = await prisma.pessoa.findUnique({
        where: {
          id: user.pessoaId
        }
      });
      const passValid = await argon2.verify(user.password, req.body.password);
      if (passValid) {
        let expiration = 60 * 60 * 8; // Expiração do token, em segundos
        //Token a ser gravado no banco
        const whiteToken = await prisma.tokenWhiteList.create({
          data: {
            userId: user.id,
            expiraEm: new Date(Date.now() + (1000 * expiration))
          }
        });
        //Token a ser enviado para o usuário 
        const token = jwt.sign({
          tokenId: whiteToken.id,
          userId: whiteToken.userId
        }, jwtSecret, {
          expiresIn: expiration
        });
        if (token) {
          return res.json({ 
            token: token 
          });
        }
      }
    }
    return res.status(401).json({
      message: 'Usuário ou senha incorretos'
    });
  }
  catch (error) {
    console.log(error);
    return res.status(500);
  }
});

app.get('/auth/user', verifyJWT, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.token.userId
      }
    });
    if (user) {
      const pessoa = await prisma.pessoa.findUnique({
        where: {
          id: user.pessoaId
        }
      });
      if (pessoa) {
        return res.status(200).json({
          user: {
            ativo: user.ativo,
            flags: user.flags,
            avatar: user.avatar,
            nome: pessoa.nome,
            nascimento: pessoa.nascimento,
          }, 
        })
      }
    }
  }
  catch (err) {
    console.log(err);
  }
  return res.status(500).json({message: "Não foi possível obter esse recurso"});
})

app.get('/auth/logout', verifyJWT, async (req, res, next) => {
  try {
    const whiteToken = await prisma.tokenWhiteList.delete({
      where: {
        id: req.token.tokenId
      }
    });
    if (whiteToken) {
      return res.status(200).json({message: "Logout com sucesso"});
    }
  }
  catch (err) {}
  return res.status(500).json({message: "Não foi possível concluir o logout"});
});

app.use('/pessoa', verifyJWT, routerPessoa);
app.use('/animal', verifyJWT, routerAnimal);
app.use('/atributo', verifyJWT, routerAtributo);
app.use('/user', verifyJWT, routerUser);
app.use('/evento', verifyJWT, routerEvento);
app.use('/desaparecido', verifyJWT, routerDesaparecido);
app.use('/caracteristica', verifyJWT, routerCaracteristica);
app.use('/register', routerRegister);

export default {
  path: '/api',
  handler: app
}