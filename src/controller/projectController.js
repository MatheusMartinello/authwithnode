const express = require('express');
const bycrypt = require('bcryptjs');
const authMiddleware = require('../middlewares/auth');
const { authRole } = require('./authController');
const User = require('../models/user');
const router = express.Router();


router.use(authMiddleware);

router.get('/', (req, res) => {
    res.send({ ok: true, user: req.userId });
});

router.get('/admin', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user)
        return res.status(400).send("User not Found");
    if (! await bycrypt.compare(password, user.password))
        return res.status(400).send("Invalid Password");
    user.password = undefined;
    if (user.role == "admin")
        return res.send('Admin Page')
    return res.status(401).send("Denied role");
});
module.exports = app => app.use('/projects', router);
//usar email e senha para obter usuario => depois ver role => liberar acesso