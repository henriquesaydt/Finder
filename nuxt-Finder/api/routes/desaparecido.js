const express = require('express');
const router = express.Router();
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const md5 = require('md5');

//ID do recurso no banco
const recursoId = 6;

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

//Querys: pesquisar, eventoId
router.get('/', authorization, async (req, res) => {
  var rows = null;
  try {
    if (req.query.pesquisar) {
      rows = await prisma.desaparecido.findMany({
        where: {
          OR: [
            {
              pessoa: {
                nome: req.query.pesquisar
              }
            },
            {
              animal: {
                nome: req.query.pesquisar
              }
            }
          ]
        }
      });
    }
    else if (req.query.eventoId) {
      rows = await prisma.desaparecido.findMany({
        where: {
          eventoId: parseInt(req.query.eventoId)
        }
      });
    }
    else {
      rows = await prisma.desaparecido.findMany();
    }
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

router.get('/:desaparecidoId', authorization, async (req, res) => {
  try {
    var desaparecidoId = parseInt(req.params.desaparecidoId);
    const rows = await prisma.desaparecido.findUnique({
      where: {
        id: desaparecidoId
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
  var newDesaparecido = {
    is_animal: req.body.is_animal,
    pessoa_id: req.body.pessoa_id,
    animal_id: req.body.animal_id,
    detalhes: req.body.detalhes,
    eventoId: req.body.eventoId,
    encontrado: req.body.encontrado,
    criado_por: req.token.userId,
    criado_ip: req.ip
  }

  if (newDesaparecido.eventoId && ((newDesaparecido.pessoa_id && !newDesaparecido.animal_id) || (!newDesaparecido.pessoa_id && newDesaparecido.animal_id))) {
    try {
      const rows = await prisma.desaparecido.create({
        data: newDesaparecido
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

//Multer
const multer = require('multer');
const multerStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'static/public/desaparecido-picture'); //Caminho das fotos de desaparecidos
  },
  filename: function(req, file, cb) {
    cb(null, md5(Date.now().toString()) + '.png'); //Nome da foto: md5 da data atual e extensão png
  }
});
const upload = multer({ storage: multerStorage });

router.post('/:desaparecidoId/picture', authorization, upload.single('upload'), async (req, res) => {
  if (req.params.desaparecidoId) {
    try {
      var picture = req.file ? req.file.filename : 'none.png';
      var desaparecido = await prisma.desaparecido.update({
        where: {
          id: parseInt(req.params.desaparecidoId)
        },
        data: {
          avatar: picture
        }
      });
      if (desaparecido) {
        return res.status(200).json({
          stauts: "success",
          message: "Foto adicionada com sucesso"
        });
      }
    }
    catch (err) {
      console.log(err);
    }
    clearPicture(req.file);
    return res.status(500).json({
      status: "error",
      message: "Não foi possível atualizar a foto dessa pessoa"
    });
  }
  clearPicture(req.file);
  return res.status(400).json({
    status: "error",
    message: "Parâmetros inválidos"
  });
});

function clearPicture(file) {
  if (file) {
    fs.unlinkSync('static/public/profile-picture/' + file.filename);
  }
}

router.delete('/', authorization, async (req, res) => {
  if (req.body.id) {
    var desaparecidoId = parseInt(req.body.id);
    try {
      const rows = await prisma.desaparecido.delete({
        where: {
          id: desaparecidoId
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
    var desaparecidoId = parseInt(req.body.id);
    var newDesaparecido = {
      is_animal: req.body.is_animal,
      pessoa_id: req.body.pessoa_id,
      animal_id: req.body.animal_id,
      detalhes: req.body.detalhes,
      eventoId: req.body.eventoId,
      encontrado: req.body.encontrado,
      alterado_por: req.token.userId,
      alterado_ip: req.ip,
      alterado_em: new Date(Date.now())
    }

    if (newDesaparecido.eventoId && ((newDesaparecido.pessoa_id && !newDesaparecido.animal_id) || (!newDesaparecido.pessoa_id && newDesaparecido.animal_id))) {
      try {
        const rows = await prisma.desaparecido.update({
          where: {
            id: desaparecidoId
          },
          data: newDesaparecido,
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