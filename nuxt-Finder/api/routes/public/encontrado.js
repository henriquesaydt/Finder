const express = require('express');
const router = express.Router();
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
  try {
    var desaparecido = await prisma.desaparecido.update({
      where: {
        id: req.body.desaparecidoId
      },
      data: {
        encontrado: true
      }
    })
    if (desaparecido) {
      var historico = await prisma.historico.create({
        data: {
          desaparecido_id: req.body.desaparecidoId,
          encontrado: true,
          localizacao: req.body.localizacao,
          estado: req.body.estado
        }
      });
      if (historico) {
        return res.status(200).json({
          status: 'success',
          message: 'Localização e estado registrados com sucesso'
        });
      }
    }
  } 
  catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "error",
      message: "Não foi possível gravar esse recurso"
    });
  }
})

module.exports = router;