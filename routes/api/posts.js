const express = require('express');
const router = express.Router();

//@access Public
//@route GET/posts

router.get('/', (req, res) => res.send('Posts route'));

module.exports = router;
