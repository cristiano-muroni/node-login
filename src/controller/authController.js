const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authConfig = require("../config/auth.json");

const router = express.Router();

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 3600,
  });
}

router.post("/registro", async (req, res) => {
  const { email } = req.body;
  try {
    if (await User.findOne({ email }))
      return res.status(400).send("Esse usuário já existe");
    const user = await User.create(req.body);

    user.password = undefined;

    return res.send({ user, token: generateToken({ id: user.id }), });
  } catch (err) {
    return res.status(400).send({ error: "Falha ao registrar usuário" });
  }
});

router.post("/authenticate", async (req, res) => {
  try {
    const { email, password } = req.body;

    const userProps = [
      "name",
      "email",
      "password",
      "businessOwner",
      "createdAt",
    ]; // array de propriedades a retornar no objeto de usuário

    const user = await User.findOne({ email }) // Tua classe de acesso ao banco // consulta filtrada por email
      .select(userProps); // selecionando os campos que queremos

    console.log("user", user);

    if (!user) {
      return res.status(400).send({ error: "Usuário não encontrado" });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).send({ error: "Senha inválida" });
    }

    user.password = undefined;// para não exibir a senha no retorno da req   
    return res.send({ 
      user, 
      token: generateToken({ id: user.id }),
     });
    
  } catch (error) {
    console.log(error);
  }
});

module.exports = (app) => app.use("/auth", router);
