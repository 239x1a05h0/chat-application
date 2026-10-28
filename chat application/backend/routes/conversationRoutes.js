const express = require('express');
const Conversation = require('../models/Conversation');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

// Create or find one-to-one conversation
router.post('/', protect, async (req, res) => {
    try {
        const { senderId, receiverId } = req.body;

        if (!senderId || !receiverId) {
            return res.status(400).json({
                message: 'User IDs are required'
            });
        }

        let conversation = await Conversation.findOne({
            participants: {
                $all: [senderId, receiverId],
                $size: 2
            }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            });
        }

        res.json(conversation);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

// Get conversations of a user
router.get('/:userId', protect, async (req, res) => {
    try {
        const conversations = await Conversation.find({
            participants: req.params.userId
        }).populate('participants', 'name email');

        res.json(conversations);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;