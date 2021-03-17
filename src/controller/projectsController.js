const express = require("express");
const router = express.Router();
const authMidleware = require('../midlewares/auth');

router.use(authMidleware);

router.get('/', (req, res) => {
    res.send({ok: true});
});

module.exports = app => app.use('/projects', router);