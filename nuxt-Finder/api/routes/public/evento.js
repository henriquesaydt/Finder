const express = require('express');
const router = express.Router();
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    var rows = await prisma.evento.findMany();
    for (var evento of rows) {
      const desaparecidos = await prisma.desaparecido.findMany({
        where: {
          eventoId: evento.id
        }
      });
      evento.desaparecidos = desaparecidos
    }
    res.status(200).json(rows);
  } 
  catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "error",
      message: "Não foi possível obter esse recurso"
    });
  }
});

module.exports = router;