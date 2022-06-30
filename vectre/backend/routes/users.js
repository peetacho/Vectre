var express = require('express');
var router = express.Router();

const User = require('../models/user');
const Post = require('../models/post');
const dbUtils = require('../utils/neo4j/dbUtils');
const { authenticateToken } = require("../utils/auth");
const { rest } = require('lodash');

// GET /users
router.get('/', (req, res, next) => {
    User.getAll(dbUtils.getSession(req))
        .then((result) => res.send(result))
        .catch((error) => res.send(error))
})

// GET /users/{walletAddress}
router.get('/:walletAddress', (req, res) => {
    User.getByWalletAddress(dbUtils.getSession(req), req.params.walletAddress)
        .then((result) => res.send(result))
        .catch((error) => res.send(error))
})

// GET /users/{walletAddress}/posts
router.get('/:walletAddress/posts', (req, res, next) => {
    Post.getPostsByUser(dbUtils.getSession(req), req.params.walletAddress)
        .then((result) => res.send(result))
        .catch((error) => res.send(error))
});

// POST /users/register
router.post('/register', (req, res) => {
    User.register(dbUtils.getSession(req), req.body)
        .then((result) => res.send(result))
        .catch((error) => res.send(error))
})

// POST /users/login/nonce
router.post('/login/nonce', (req, res) => {
    User.getNonce(dbUtils.getSession(req), req.body.walletAddress)
        .then((result) => res.send(result))
        .catch((error) => res.send(error))
})

// GET /users/{walletAddress}/posts
router.get('/:walletAddress/posts', (req, res, next) => {
    Post.getPostsByUser(dbUtils.getSession(req), req.params.walletAddress)
        .then((result) => res.send(result))
        .catch((error) => res.send(error))
});

// POST /users/login
router.post('/login', (req, res) => {
    const setTokenInCookie = (token) => { res.cookie('token', token, { maxAge: 1000 * 60 * 60 * 24 * 7, httpOnly: true }) } // Expires in 7 days
    User.login(dbUtils.getSession(req), req.body.walletAddress, req.body.signedNonce, setTokenInCookie)
        .then((result) => res.send(result))
        .catch((error) => res.send(error))
})

// GET /users/login/currentUser
router.get('/login/currentUser', authenticateToken, (req, res) => {
    User.getByWalletAddress(dbUtils.getSession(req), req.walletAddress)
        .then((result) => res.send(result))
        .catch((error) => res.send(error))
})

// PUT /users/{walletAddress}/update
router.put('/:walletAddress/update', authenticateToken, (req, res) => {
    if (req.walletAddress === req.params.walletAddress) {
        User.updateProfile(dbUtils.getSession(req), req.params.walletAddress, req.body)
            .then((result) => res.send(result))
            .catch((error) => res.send(error))
    } else {
        res.status(403).send({
            success: false,
            message: "You do not have access to update this User"
        })
    }
})

// DELETE /users/{walletAddress}/delete
router.delete('/:walletAddress/delete', authenticateToken, (req, res) => {
    if (req.walletAddress === req.params.walletAddress) {
        User.delete(dbUtils.getSession(req), req.walletAddress, req.params.walletAddress)
            .then((result) => res.send(result))
            .catch((error) => res.send(error))
    } else {
        res.status(403).send({
            success: false,
            message: "You do not have access to delete this User"
        })
    }
})

// GET /users/{walletAddress}/following
router.get('/:walletAddress/following', (req, res, next) => {
    User.getFollowing(dbUtils.getSession(req), req.params.walletAddress)
        .then((result) => res.send(result))
        .catch((error) => res.send(error))
});
// GET /users/{walletAddress}/followers
router.get('/:walletAddress/followers', (req, res, next) => {
    User.getFollowers(dbUtils.getSession(req), req.params.walletAddress)
        .then((result) => res.send(result))
        .catch((error) => res.send(error))
});
// POST /users/{walletAddressToFollow}/follow
router.post('/:walletAddressToFollow/follow', authenticateToken, (req, res, next) => {
    User.follow(dbUtils.getSession(req), req.walletAddress, req.params.walletAddressToFollow)
        .then((result) => res.send(result))
        .catch((error) => res.send(error))
});
// POST /users/{walletAddressToUnfollow}/unfollow
router.post('/:walletAddressToUnfollow/unfollow', authenticateToken, (req, res, next) => {
    User.unfollow(dbUtils.getSession(req), req.walletAddress, req.params.walletAddressToUnfollow)
        .then((result) => res.send(result))
        .catch((error) => res.send(error))
});

module.exports = router;