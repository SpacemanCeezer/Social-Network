// routes/index.js
const express = require('express');
const userRoutes = require('./userRoutes');
const thoughtRoutes = require('./thoughtRoutes');
const reactionRoutes = require('./reactionRoutes');

const router = express.Router();

router.use('/api/users', userRoutes);
router.use('/api/thoughts', thoughtRoutes);
router.use('/api/reactions', reactionRoutes);

module.exports = router;
