const express = require('express');
const router = express.Router();
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const argon2 = require('argon2');
const md5 = require('md5');

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
const upload = multer({ storage: multerStorage }).single('upload');

router.post('/', async (req, res) => {
  console.log(req.body);
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
        const uploadStatus = upload(req, res, function (err) {
          if (err) {
            console.log(err);
            return {
              status: "error",
              error: err
            };
          }
          return {
            status: "success",
            file: req.file
          }
        });
        if (uploadStatus.status == "success") {
          var newUser = {
            pessoaId: pessoa.id,
            username: req.body.username,
            password: await argon2.hash(req.body.password),
            avatar: uploadStatus.file.filename
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
        else {
          console.log(uploadStatus.error);
        }
      }
    }
    catch (err) {
      console.log(err);
    }
    return res.status(500).json({
      status: "error",
      message: "Não foi possível cadastrar esse usuário"
    });
  }
  return res.status(400).json({
    status: "error",
    message: "Parâmetros inválidos"
  });
});

module.exports = router;