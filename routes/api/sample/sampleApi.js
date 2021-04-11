const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const User = require('../../../models/SampleUser');

// @route   POST /api/sample/register
// @desc    Register user
// @access  Public
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include valid email').isEmail(),
    check(
      'password',
      'Please enter password with 6 or more characters'
    ).isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    try {
      //if user exist return 400
      let user = await User.findOne({ email });
      if (user) {
        res.status(400).json({ errors: [{ msg: 'User already exists..' }] });
      }

      user = new User({ name, email, password });
      //encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };
      res.status(200).json({ msg: 'User successfully registered', payload });
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route    GET api/sample/users
// @desc     Get all users
// @access   Public
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/sample/users/:id
// @desc     Delete a post
// @access   Public
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    // Check for user
    if (!user) {
      return res.status(404).json({ msg: 'user not found' });
    }

    await user.remove();

    res.json({ msg: 'user deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/sample/users/update/:id
// @desc    Update user
// @access  Public
router.put('/users/update/:id', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = name;
      user.email = email;

      //encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();
      res.status(200).json({ msg: 'User successfully updated' });
    }

    res.status(400).json({ errors: [{ msg: 'User does not exists..' }] });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
