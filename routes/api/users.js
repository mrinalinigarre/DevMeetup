const express = require('express');
const router = express.Router();

//@access Public
//@route GET

router.get('/', (req, res) => res.send('User route'));

module.exports = router;