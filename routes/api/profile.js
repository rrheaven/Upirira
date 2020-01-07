const express = require('express');
const router = express.Router();
const config = require('config');
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator/check');

// Models
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route GET api/profile
// @desc Test Route
// @access Public
router.get('/', (req, res) => res.send('Profile Route'));

module.exports = router;
