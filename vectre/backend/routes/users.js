var express = require('express');
var router = express.Router();

const User = require('../models/user');
const Post = require('../models/post');
const dbUtils = require('../utils/neo4j/dbUtils');
const {authenticateToken} = require("../utils/auth");
const { rest } = require('lodash');


// GET /users
router.get('/', (req, res, next) => {
    User.getAll(dbUtils.getSession(req))
        .then((result) => res.send(result))
        .catch((error) => res.send(error))
})

// GET /users/{wallet_address}
router.get('/:wallet_address', (req, res) => {
    User.getByWalletAddress(dbUtils.getSession(req), req.params.wallet_address)
        .then((result) => res.send(result))
        .catch((error) => res.send(error))
})

// POST /users/register
router.post('/register', (req, res) => {
    User.register(dbUtils.getSession(req), req.body)
        .then((result) => res.send(result))
        .catch((error) => res.send(error))
})

// POST /users/login/nonce
router.post('/login/nonce', (req, res) => {
    User.getNonce(dbUtils.getSession(req), req.body.wallet_address)
        .then((result) => res.send(result))
        .catch((error) => res.send(error))
})

// GET /users/{wallet_address}/posts
router.get('/:user_id/posts', (req, res, next) => {
    const author = req.params.user_id;
    if (!author) throw {message: 'Invalid user id', status: 400, success: false};

    Post.getUserPosts(dbUtils.getSession(req), author)
    .then((result) => res.send(result))
    .catch((error) => res.send(error))


});

// POST /users/login
router.post('/login', (req, res) => {
    const setTokenInCookie = (token) => { res.cookie('token', token, { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true })} // Expires in 7 days
    User.login(dbUtils.getSession(req), req.body.wallet_address, req.body.signed_nonce, setTokenInCookie)
        .then((result) => res.send(result))
        .catch((error) => res.send(error))
})

// GET /users/login/currentUser
router.get('/login/currentUser', authenticateToken, (req, res) => {
    User.getByWalletAddress(dbUtils.getSession(req), req.wallet_address)
        .then((result) => res.send(result))
        .catch((error) => res.send(error))
})

// PUT /users/{wallet_address}/update
router.put('/:wallet_address/update', authenticateToken, (req, res) => {
    if (req.wallet_address === req.params.wallet_address) {
        User.updateProfile(dbUtils.getSession(req), req.params.wallet_address, req.body)
            .then((result) => res.send(result))
            .catch((error)=> res.send(error))
    } else {
        res.status(403).send({
            success: false,
            message: "You do not have access to update this User"
        })
    }
})

// DELETE /users/{wallet_address}/delete
router.delete('/:wallet_address/delete', authenticateToken, (req, res) => {
    if (req.wallet_address === req.params.wallet_address) {
        User.delete(dbUtils.getSession(req), req.wallet_address, req.params.wallet_address)
            .then((result) => res.send(result))
            .catch((error) => res.send(error))
    } else {
        res.status(403).send({
            success: false,
            message: "You do not have access to delete this User"
        })
    }
})

module.exports = router;