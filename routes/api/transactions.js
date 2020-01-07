const express = require('express');
const router = express.Router();

// @route GET api/transaction
// @desc Test Route
// @access Public
router.get('/', (req, res) => res.send('Transaction Route'));

module.exports = router;
