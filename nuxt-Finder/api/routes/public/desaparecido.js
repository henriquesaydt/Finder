const express = require('express');
const router = express.Router();
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    var rows = await prisma.desaparecido.findMany({
      where: {
        eventoId: parseInt(req.query.eventoId)
      }
    });
    for (var desaparecido of rows) {
      const pessoa = await prisma.pessoa.findUnique({
        where: {
          id: desaparecido.pessoa_id
        }
      });
      desaparecido.pessoa = pessoa;
    }
    res.status(200).json(rows);
  } 
  catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Não foi possível obter esse recurso"
    });
  }
});

module.exports = router;