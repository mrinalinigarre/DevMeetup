const express = require('express');
const router = express.Router();

//@access Public
//@route GET/profile

router.get('/', (req, res) => res.send('Profile route'));

module.exports = router;
