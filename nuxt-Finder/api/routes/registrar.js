const express = require('express');
const router = express.Router();
import { PrismaClient } from '@prisma/client';
import { findSync } from '@prisma/client/runtime';
const prisma = new PrismaClient();
const argon2 = require('argon2');
const md5 = require('md5');
const fs = require('fs')

//Multer
const multer = require('multer');
const multerStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'static/public/profile-picture'); //Caminho das fotos de perfil
  },
  filename: function(req, file, cb) {
    cb(null, md5(Date.now().toString()) + '.png'); //Nome da foto: md5 da data atual e extensão png
  }
});
const upload = multer({ storage: multerStorage });

router.post('/', upload.single('upload'), async (req, res) => {
  if (req.body.nome && req.body.nascimento && req.body.username && req.body.password) {
    try {
      var createdPessoa = null;
      var newPessoa = {
        nome: req.body.nome,
        nascimento: req.body.nascimento,
      }
      createdPessoa = await prisma.pessoa.create({
        data: newPessoa
      });
      if (createdPessoa) {
        var newUser = {
          pessoaId: createdPessoa.id,
          username: req.body.username,
          password: await argon2.hash(req.body.password),
          avatar: req.file ? req.file.filename : 'none.png'
        }
        var user = await prisma.user.create({
          data: newUser
        });
        if (user) {
          return res.status(200).json({
            stauts: "success",
            message: "Usuário cadastrado com sucesso"
          })
        }
      }
    }
    catch (err) {
      console.log(err);
    }
    fs.unlinkSync('static/public/profile-picture/' + req.file.filename);
    return res.status(500).json({
      status: "error",
      message: "Não foi possível cadastrar esse usuário"
    });
  }
  fs.unlinkSync('static/public/profile-picture/' + req.file.filename);
  return res.status(400).json({
    status: "error",
    message: "Parâmetros inválidos"
  });
});

module.exports = router;