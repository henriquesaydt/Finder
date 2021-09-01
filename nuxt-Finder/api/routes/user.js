const express = require('express');
const router = express.Router();
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

//ID do recurso no banco
const recursoId = 4;

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
  const select = {
    pessoa: {
      select: {
        nome: true
      }
    },
    ativo: true,
    username: true,
    flags: true
  }
  var rows = null;
  try {
    if (req.query.pesquisar) {
      rows = await prisma.user.findMany({
        where: {
          OR: [
            {
              pessoa: {
                nome: {
                  contains: req.query.pesquisar
                }
              }
            },
            {
              username: {
                contains: req.query.pesquisar
              }
            }
          ]
        },
        select: select
      });
    }
    else {
      rows = await prisma.user.findMany({
        select: select
      });
    }
    if (rows) {
      return res.json(rows);
    }
  }
  catch {}
  return res.status(500).json({
    status: "error",
    message: "Não foi possível obter esse recurso"
  });
});

router.get('/:atributoId', authorization, async (req, res) => {
  try {
    var atributoId = parseInt(req.params.atributoId);
    const rows = await prisma.atributo.findUnique({
      where: {
        id: atributoId
      }
    });
    if (rows) {
      return res.json(rows);
    }
  }
  catch {}
  return res.status(500).json({
    status: "error",
    message: "Não foi possível obter esse recurso"
  });
});

router.post('/', authorization, async (req, res) => {
  var newAtributo = {
    nome: null,
    is_animal: null
  }
  if (req.body.nome && req.body.hasOwnProperty("is_animal")) {
    newAtributo.nome = req.body.nome;
    newAtributo.is_animal = req.body.is_animal;
    try {
      const rows = await prisma.atributo.create({
        data: {
          nome: newAtributo.nome,
          is_animal: newAtributo.is_animal,
          criado_por: req.token.userId,
          criado_ip: req.ip
        }
      });
      if (rows) {
        return res.status(201).json({
          status: "success",
          message: "Recurso criado com sucesso",
          animal: rows
        });
      }
    }
    catch {}
    return res.status(500).json({
      status: "error",
      message: "Não foi possível criar esse recurso"
    });
  }
  else {
    return res.status(400).json({
      status: "error",
      message: "Parâmetros inválidos"
    });
  }
});

router.delete('/', authorization, async (req, res) => {
  if (req.body.id) {
    var atributoId = parseInt(req.body.id);
    try {
      const rows = await prisma.atributo.delete({
        where: {
          id: atributoId
        }
      })
      if (rows) {
        return res.json({
          status: "success",
          message: "Recurso excluído com sucesso",
          animal: rows
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
    var atributoId = parseInt(req.body.id);
    var newAtributo = {
      alterado_por: req.token.userId,
      alterado_ip: req.ip,
      alterado_em: new Date(Date.now())
    }
    if (req.body.nome) newAtributo.nome = req.body.nome;
    if (req.body.is_animal) newAtributo.is_animal = req.body.is_animal;
    try {
      const rows = await prisma.atributo.update({
        where: {
          id: atributoId
        },
        data: newAtributo
      })
      if (rows) {
        return res.json({
          status: "success",
          message: "Recurso atualizado com sucesso",
          animal: rows
        })
      }
    }
    catch {}
    return res.status(500).json({
      status: "error",
      message: "Não foi possível atualizar esse recurso"
    });
  }
  return res.status(400).json({
    status: "error",
    message: "Parâmetros inválidos"
  });
});

module.exports = router;