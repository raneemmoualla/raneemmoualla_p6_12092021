const express = require('express');
const router = express.Router();
const max = require("../middleware/limit");
const password =require('../middleware/password');
const userCtrl = require('../controllers/user');

router.post('/signup',password, userCtrl.signup);
router.post('/login', max.limiter, userCtrl.login);

module.exports = router