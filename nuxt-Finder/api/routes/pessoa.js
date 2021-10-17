const express = require('express');
const router = express.Router();
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

//ID do recurso no banco
const recursoId = 1;

async function authorization (req, res, next) {
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
  catch(err) {
    console.log(err);
    return res.status(500).json({
      status: "error",
      message: "Não foi possível prosseguir com essa requisição"
    });
  }
}

//Querys: pesquisar
router.get('/', authorization, async (req, res) => {
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

router.get('/:pessoaId', authorization, async (req, res) => {
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

router.post('/', authorization, async (req, res) => {
  var newPessoa = {
    nome: req.body.nome,
    nascimento: req.body.nascimento,
    criado_por: req.token.userId,
    criado_ip: req.ip
  }
  if (req.body.nome) {
    try {
      const pessoa = await prisma.pessoa.create({
        data: newPessoa
      });
      if (pessoa) {
        return res.status(201).json({
          status: "success",
          message: "Recurso criado com sucesso",
          recurso: pessoa
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

router.delete('/', authorization, async (req, res) => {
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
          recurso: pessoa
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

router.patch('/', authorization, async (req, res) => {
  if (req.body.id) {
    var userId = parseInt(req.body.id);
    var newPessoa = {
      nome: req.body.nome,
      nascimento: new Date(req.body.nascimento),
      alterado_por: req.token.userId,
      alterado_ip: req.ip,
      alterado_em: new Date(Date.now())
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
          recurso: pessoa
        })
      }
    }
    catch(err) {
      console.log(err);
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