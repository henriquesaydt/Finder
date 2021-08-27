import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
const jwt = require('jsonwebtoken');
const jwtSecret = '2T$Kjq8NW4g2T2&43Am2nH4Qt0Hp%l@1dq!y#30TZk0Nl7KSW0';
const argon2 = require('argon2');

const rotaTeste = express.Router();
const routerPessoa = require('./routes/pessoa')

app.use(express.json());


//Verifica o Token e retorna o ID do usuário para a rota
function verifyJWT(req, res, next) {
  const token = req.headers['authorization'];
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

app.post('/login', async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username: req.body.user
      }
    });
    if (user) {
      const passValid = argon2.verify(user.password, req.body.password);
      if (passValid) {
        let expiration = 60 * 60 * 8; // Expiração do token, em segundos
        const whiteToken = await prisma.tokenWhiteList.create({
          data: {
            userId: user.id,
            expiraEm: new Date(Date.now() + (1000 * expiration))
          }
        });
        const token = jwt.sign({
          tokenId: whiteToken.id,
          userId: whiteToken.userId
        }, jwtSecret, {
          expiresIn: expiration
        });
        if (token) {
          return res.json({ auth: true, token: token });
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

app.get('/logout', verifyJWT, async (req, res, next) => {
  console.log(req.token);
  const whiteToken = await prisma.tokenWhiteList.delete({
    where: {
      id: req.token.tokenId
    }
  });
  if (whiteToken) {
    return res.status(200).json({message: "Logout com sucesso"});
  }
  return res.status(500).json({message: "Não foi possível concluir o logout"});
});

app.get('/secreto', verifyJWT, (req, res, next) => {
  return res.status(200).json({
    message: "bem-vindo",
    token: req.token
  });
});

rotaTeste.use((req, res, next) => {
  req.authorizationId = 5;
  next();
});

function autorizationMiddleware (req, res, next) {
  if (req.authorizationId == 5 && req.method == 'POST') {
    next();
  }
  else {
    return res.status(403).json({
      message: "não autorizado"
    });
  }
}

rotaTeste.get('/', autorizationMiddleware, (req, res) => {
  return res.json({
    message: "Bem-vindo",
    idAutorizacao: req.authorizationId
  })
});

rotaTeste.post('/', autorizationMiddleware, (req, res) => {
  return res.json({
    message: "Bem-vindo",
    idAutorizacao: req.authorizationId
  })
});

app.use('/teste', rotaTeste);
app.use('/pessoa',verifyJWT, routerPessoa);

export default {
  path: '/api',
  handler: app
}