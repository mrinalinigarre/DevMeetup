const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

//@access Public
//@desc get curr user profile
//@route GET/profile/me

router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'No such user profile' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server error');
  }
});

module.exports = router;
