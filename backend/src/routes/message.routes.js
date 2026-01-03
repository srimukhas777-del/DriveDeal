import express from 'express';
import { getMessages, saveMessage, markAsRead } from '../controllers/message.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/:userId', authMiddleware, getMessages);
router.post('/', authMiddleware, saveMessage);
router.put('/:userId/read', authMiddleware, markAsRead);

export default router;
