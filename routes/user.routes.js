const { verifyJWT } = require('../middlewares/auth.middleware');
const {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    verifyAccount
} = require('../controllers/user.controller');

const router = require('express').Router();

router
    .post('/signup', registerUser)
    .post('/login', loginUser)
    .get('/profile', verifyJWT, getProfile)
    .put('/update-profile', verifyJWT, updateProfile)
    .get('/confirm-email', verifyAccount)

module.exports = router;