const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

//@access private
//@desc get curr user profile
//@route GET/profile/me

router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server error');
  }
});

//@access private
//@desc create or update user profile
//@route POST/profile

router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required')
        .not()
        .isEmpty(),
      check('skills', 'Skills is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    // Building profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    //Build Social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      // Using upsert option (creates new doc if no match is found):
      let profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true, upsert: true }
      );
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }

    //console.log(profileFields.skills);
  }
);

//@access public
//@desc get all user profile
//@route GET/profile

router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

//@access public
//@desc get all user profile
//@route GET/profile/user/:user_id

router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', ['name', 'avatar']);

    if (!profile)
      return res
        .status(400)
        .json({ msg: 'No profile found with this user_id' });

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'OnjectId') {
      return res
        .status(400)
        .json({ msg: 'No profile found with this user_id' });
    }
    res.status(500).send('Server Error');
  }
});

//@access private
//@desc delete profile, user and posts
//@route Delete api/profile

router.delete('/', auth, async (req, res) => {
  try {
    await Profile.findOneAndRemove({
      user: req.user.id
    });

    await User.findOneAndRemove({
      _id: req.user.id
    });

    res.json({ msg: 'user Profile deleted' });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('server error');
  }
});

module.exports = router;
