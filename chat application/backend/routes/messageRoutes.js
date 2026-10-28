const express = require('express');
const Message = require('../models/Message');
const protect = require('../middleware/authMiddleware');
const router = express.Router();

// Get messages of a conversation
router.get('/:conversationId', protect, async (req, res) => {
    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId
        }).sort({ createdAt: 1 });

        res.json(messages);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;