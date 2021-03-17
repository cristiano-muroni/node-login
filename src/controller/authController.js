const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');

const router = express.Router();

function generateToken(params = {}) {
  return jwt.sign(params,authConfig.secret, {
    expiresIn: 3600,
  } )
}

router.post("/registro", async (req, res) => {
  const { email } = req.body;
  try {
    if (await User.findOne({ email }))
      return res.status(400).send("Esse usuário já existe");
    const user = await User.create(req.body);

    user.password = undefined;

    return res.send({ user,
      token: generateToken({id: user.id}),      
    });
  } catch (err) {
    return res.status(400).send({ error: "Falha ao registrar usuário" });
  }
});

router.post('/authenticate', async (req, res) => {
  const {email, password} = req.body;
  const user = await (await User.findOne({email})).select('+passord');

  if(!user){
    return res.status(400).send({error:'Usuário não encontrado'});
  } 

  if(!await bcrypt.compare(password, user.password)){
    return res.status(400).send({error:'Senha inválida'});

  }

  user.password = undefined;

 
  res.send({user,
     token: generateToken({id: user.id}),
    });
})



module.exports = (app) => app.use("/auth", router);
