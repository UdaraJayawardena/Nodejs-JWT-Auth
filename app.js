const express = require('express');
const jwt = require('jsonwebtoken');

var app = express();

app.get('/api', (req, res) => {
    res.json({message: "Welcome to the API"})
});

app.post('/api/posts', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            console.log('verification token')
            res.sendStatus(403);
        } else {
            res.json({message: "Post created", authData})
            console.log(authData.user.name);
        }
    });
})

app.post('/api/login', (req, res) => {
    const user = {
        id: 1,
        name: "udara",
        email: "uj@gmail.com"
    }

    jwt.sign({
        user
    }, 'secretkey', {
        expiresIn: '30s'
    }, (err, token) => {
        res.json({token})
    })
})

function verifyToken(req, res, next) {

    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();

    } else {
        console.log('verifyToken Error')
        res.sendStatus(403)
    }
}

app.listen(3000, () => console.log('port run on 3000'));
