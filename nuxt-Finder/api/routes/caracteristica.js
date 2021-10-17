const express = require('express');
const router = express.Router();
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

//ID do recurso no banco
const recursoId = 7;

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
  var rows = null;
  try {
    if (req.query.pesquisar) {
      rows = await prisma.caracteristica.findMany({
        where: {
          valor: req.query.pesquisar
        }
      });
    }
    if (rows) {
      return res.json(rows);
    }
  }
  catch (err) {}
  return res.status(500).json({
    status: "error",
    message: "Não foi possível obter esse recurso"
  });
});

router.get('/:caracteristicaId', authorization, async (req, res) => {
  try {
    var caracteristicaId = parseInt(req.params.caracteristicaId);
    const rows = await prisma.caracteristica.findUnique({
      where: {
        id: caracteristicaId
      }
    });
    if (rows) {
      return res.json(rows);
    }
  }
  catch (err) {
    console.log(err);
  }
  return res.status(500).json({
    status: "error",
    message: "Não foi possível obter esse recurso"
  });
});

router.post('/', authorization, async (req, res) => {
  var newCaracteristica = {
    atributo_id: req.token.atributo_id,
    desaparecido_id: req.token.desaparecido_id,
    valor: req.token.valor,
    criado_por: req.token.userId,
    criado_ip: req.ip
  }

  if (newCaracteristica.atributo_id && newCaracteristica.desaparecido_id && newCaracteristica.valor ) {
    try {
      const rows = await prisma.caracteristica.create({
        data: newCaracteristica
      });
      if (rows) {
        return res.status(201).json({
          status: "success",
          message: "Recurso criado com sucesso",
          recurso: rows
        });
      }
    }
    catch (err) {
      console.log(err);
    }
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
    var caracteristicaId = parseInt(req.body.id);
    try {
      const rows = await prisma.caracteristica.delete({
        where: {
          id: caracteristicaId
        }
      });
      if (rows) {
        return res.json({
          status: "success",
          message: "Recurso excluído com sucesso",
          animal: rows
        });
      }
    }
    catch (err) {
      console.log(err);
    }
    return res.status(500).json({
      status: "error",
      message: "Não foi possível excluir esse recurso"
    });
  }
  return res.status(400).json({
    status: "error",
    message: "Parâmetros inválidos"
  });
});

router.patch('/', authorization, async (req, res) => {
  if (req.body.id) {
    var caracteristicaId = parseInt(req.body.id);
    var newCaracteristica = {
      atributo_id: req.token.atributo_id,
      desaparecido_id: req.token.desaparecido_id,
      valor: req.token.valor,
      alterado_por: req.token.userId,
      alterado_ip: req.ip,
      alterado_em: new Date(Date.now())
    }

    if (newCaracteristica.atributo_id && newCaracteristica.desaparecido_id && newCaracteristica.valor ) {
      try {
        const rows = await prisma.caracteristica.update({
          where: {
            id: caracteristicaId
          },
          data: newCaracteristica,
        })
        if (rows) {
          return res.json({
            status: "success",
            message: "Recurso atualizado com sucesso",
            animal: rows
          })
        }
      }
      catch (err) {
        console.log(err);
      }
      return res.status(500).json({
        status: "error",
        message: "Não foi possível atualizar esse recurso"
      });
    }
  }
  else {
    return res.status(400).json({
      status: "error",
      message: "Parâmetros inválidos"
    });
  }
});

module.exports = router;