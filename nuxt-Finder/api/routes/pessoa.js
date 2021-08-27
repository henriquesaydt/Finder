const express = require('express');
const router = express.Router();
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function autorization (req, res, next) {
  //ID do recurso no banco
  var recursoId = 1;
  //ID da permissão no banco
  var permissaoId = 0;

  switch (req.method) {
    case 'GET':
      permissaoId = 1;
      break;
    case 'POST':
      permissaoId = 2;
      break;
    case 'PATCH':
      permissaoId = 3;
      break;
    case 'DELETE':
      permissaoId = 4;
      break
  }
  try {
    const permissao = await prisma.$queryRaw(`
      select
        User.id,
        GrupoUsuario.grupoId,
        GrupoAutorizacao.recursoId,
        GrupoAutorizacao.permissaoId
      from
        User
        join GrupoUsuario on User.id = GrupoUsuario.userId
        join GrupoAutorizacao on GrupoUsuario.grupoId = GrupoAutorizacao.grupoId 
      where (
        User.id = ${req.token.userId} AND
        GrupoAutorizacao.recursoId = ${recursoId} AND
        GrupoAutorizacao.permissaoId = ${permissaoId}
      );
    `);
    if (permissao.length > 0) {
      next();
    }
    else {
      return res.status(403).json({
        status: "error",
        message: "Acesso negado"
      });
    }
  } 
  catch {
    return res.status(500).json({
      status: "error",
      message: "Não foi possível prosseguir com essa requisição"
    });
  }
}

//Querys: pesquisar
router.get('/', autorization, async (req, res) => {
  try {
    const pessoa = await prisma.pessoa.findMany({
      where: {
        nome: {
          contains: req.query.pesquisar
        }
      },
      select: {
        id: true,
        nome: true,
        nascimento: true
      }
    });
    if (pessoa) {
      return res.json(pessoa);
    }
  }
  catch {}
  return res.status(500).json({
    status: "error",
    message: "Não foi possível obter esse recurso"
  });
});

router.get('/:pessoaId', autorization, async (req, res) => {
  var pessoaId = parseInt(req.params.pessoaId);
  try {
    const pessoa = await prisma.pessoa.findUnique({
      where: {
        id: pessoaId
      }
    });
    if (pessoa) {
      return res.json(pessoa);
    }
  }
  catch {}
  return res.status(500).json({
    status: "error",
    message: "Não foi possível obter esse recurso"
  });
});

router.post('/', autorization, async (req, res) => {
  var newPessoa = {
    nome: null,
    nascimento: null
  }
  if (req.body.nome) {
    newPessoa.nome = req.body.nome;
    if (req.body.nascimento) newPessoa.nascimento = req.body.nascimento;
    try {
      const pessoa = await prisma.pessoa.create({
        data: {
          nome: newPessoa.nome,
          nascimento: new Date(newPessoa.nascimento)
        }
      });
      if (pessoa) {
        return res.status(201).json({
          status: "success",
          message: "Recurso criado com sucesso",
          pessoa: pessoa
        });
      }
    }
    catch {}
    return res.status(500).json({
      status: "error",
      message: "Não foi possível criar esse recurso"
    });
  }
  return res.status(400).json({
    status: "error",
    message: "Parâmetros inválidos"
  });
});

router.delete('/', autorization, async (req, res) => {
  if (req.body.id) {
    var userId = parseInt(req.body.id);
    try {
      const pessoa = await prisma.pessoa.delete({
        where: {
          id: userId
        }
      })
      if (pessoa) {
        return res.json({
          status: "success",
          message: "Recurso excluído com sucesso",
          pessoa: pessoa
        })
      }
    }
    catch {
      return res.status(500).json({
        status: "error",
        message: "Não foi possível excluir esse recurso"
      });
    }
  }
  return res.status(400).json({
    status: "error",
    message: "Parâmetros inválidos"
  });
});

router.patch('/', autorization, async (req, res) => {
  if (req.body.id) {
    var userId = parseInt(req.body.id);
    var newPessoa = {}
    if (req.body.nome) {
      newPessoa.nome = req.body.nome
    }
    if (req.body.nascimento) {
      newPessoa.nascimento = new Date(req.body.nascimento);
    }
    try {
      const pessoa = await prisma.pessoa.update({
        where: {
          id: userId
        },
        data: newPessoa
      })
      if (pessoa) {
        return res.json({
          status: "success",
          message: "Recurso atualizado com sucesso",
          pessoa: pessoa
        })
      }
    }
    catch {
      return res.status(500).json({
        status: "error",
        message: "Não foi possível atualizar esse recurso"
      });
    }
  }
  return res.status(400).json({
    status: "error",
    message: "Parâmetros inválidos"
  });
});

module.exports = router;