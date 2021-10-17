const express = require('express');
const router = express.Router();
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

//ID do recurso no banco
const recursoId = 2;

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
    var rows = null;
    if (req.query.pesquisar == undefined) {
      rows = await prisma.animal.findMany({
        select: {
          nome: true,
          tipo: true,
          raca: true
        }
      });
    }
    else {
      rows = await prisma.animal.findMany({
        where: {
          OR: [
            {
              nome: {
                contains: req.query.pesquisar
              }
            },
            {
              tipo: {
                contains: req.query.pesquisar
              }
            },
            {
              raca: {
                contains: req.query.pesquisar
              }
            },
          ],
        },
        select: {
          nome: true,
          tipo: true,
          raca: true
        }
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

router.get('/:animalId', authorization, async (req, res) => {
  var animalId = parseInt(req.params.animalId);
  try {
    const rows = await prisma.animal.findUnique({
      where: {
        id: animalId
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
  var newAnimal = {
    nome: req.body.nome,
    tipo: req.body.tipo,
    raca: req.body.raca,
    criado_por: req.token.userId,
    criado_ip: req.ip
  }
  if (newAnimal.nome && newAnimal.tipo) {
    try {
      const rows = await prisma.animal.create({
        data: newAnimal
      });
      if (rows) {
        return res.status(201).json({
          status: "success",
          message: "Recurso criado com sucesso",
          recurso: rows
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
    var animalId = parseInt(req.body.id);
    try {
      const rows = await prisma.animal.delete({
        where: {
          id: animalId
        }
      })
      if (rows) {
        return res.json({
          status: "success",
          message: "Recurso excluído com sucesso",
          recurso: rows
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
    var animalId = parseInt(req.body.id);
    var newAnimal = {
      nome: req.body.nome,
      tipo: req.body.tipo,
      raca: req.body.raca,
      alterado_por: req.token.userId,
      alterado_ip: req.ip,
      alterado_em: new Date(Date.now())
    }
    try {
      const rows = await prisma.animal.update({
        where: {
          id: animalId
        },
        data: newAnimal
      })
      if (rows) {
        return res.json({
          status: "success",
          message: "Recurso atualizado com sucesso",
          recurso: rows
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