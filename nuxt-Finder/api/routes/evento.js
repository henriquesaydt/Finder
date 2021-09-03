const express = require('express');
const router = express.Router();
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

//ID do recurso no banco
const recursoId = 5;

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
  const select = {
    id: true,
    ativo: true,
    nome: true,
    descricao: true,
    data: true,
    localidade_x: true,
    localidade_y: true,
    localidade_r: true,
    endereco: true,
    bairro: true,
    cidade: true,
    desaparecidos: true
  }
  try {
    if (req.query.pesquisar) {
      rows = await prisma.evento.findMany({
        where: {
          nome: req.query.pesquisar
        },
        select: select
      });
    }
    else {
      rows = await prisma.evento.findMany({
        select: select
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

router.get('/:eventoId', authorization, async (req, res) => {
  try {
    var eventoId = parseInt(req.params.eventoId);
    const rows = await prisma.evento.findUnique({
      where: {
        id: eventoId
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
  var newEvento = {
    ativo: req.body.ativo,
    nome: req.body.nome,
    descricao: req.body.descricao,
    data: req.body.data,
    localidade_x: req.body.localidade_x,
    localidade_y: req.body.localidade_y,
    localidade_r: req.body.localidade_r,
    endereco: req.body.endereco,
    bairro: req.body.bairro,
    cidade: req.body.cidade
  }

  if (req.body.nome && ((newEvento.localidade_x && newEvento.localidade_y) || (newEvento.endereco && newEvento.bairro && newEvento.cidade))) {
    try {
      const rows = await prisma.evento.create({
        data: newEvento
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
    var eventoId = parseInt(req.body.id);
    try {
      const rows = await prisma.evento.delete({
        where: {
          id: eventoId
        }
      })
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
    var eventoId = parseInt(req.body.id);
    var newEvento = {
      ativo: req.body.ativo,
      nome: req.body.nome,
      descricao: req.body.descricao,
      data: req.body.data,
      localidade_x: req.body.localidade_x,
      localidade_y: req.body.localidade_y,
      localidade_r: req.body.localidade_r,
      endereco: req.body.endereco,
      bairro: req.body.bairro,
      cidade: req.body.cidade,
      alterado_por: req.token.userId,
      alterado_ip: req.ip,
      alterado_em: new Date(Date.now())
    }

    try {
      const rows = await prisma.evento.update({
        where: {
          id: eventoId
        },
        data: newEvento,
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
  return res.status(400).json({
    status: "error",
    message: "Parâmetros inválidos"
  });
});

module.exports = router;