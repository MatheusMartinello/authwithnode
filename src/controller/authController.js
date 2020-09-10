const express = require('express');
const bycrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const router = express.Router();
const authconfig = require('../config/auth.json')


function geradorToken(params = {}) {
    return jwt.sign(params, authconfig.secret, {
        expiresIn: 86400,
    })
}
function authRole(role) {
    return (req, res, next) => {
        if (req.user.role !== role) {
            res.status(401)
            return res.send('not allowed');
        }

        next()
    }
}

router.post('/register', async (req, res) => {
    const { email } = req.body;
    try {
        if (await User.findOne({ email }))
            return res.status(400).send("User Already Exists");

        const user = await User.create(req.body);
        user.password = undefined;
        return res.send({
            user,
            token: geradorToken({ id: user.id, role: user.role }),
        });
    } catch (err) {
        return res.status(400).send({ error: 'Registro de erro!' });
    }
});


router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user)
        return res.status(400).send("User not Found");
    if (! await bycrypt.compare(password, user.password))
        return res.status(400).send("Invalid Password");
    user.password = undefined;

    const token = jwt.sign({ id: user.id }, authconfig.secret, {
        expiresIn: 86400,
    })

    res.send({
        user,
        token: geradorToken({ id: user.id })
    })

})

module.exports = (authRole, app => app.use('/auth', router));
