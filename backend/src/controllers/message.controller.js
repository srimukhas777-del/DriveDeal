import Message from '../models/message.model.js';
import { successResponse, errorResponse } from '../utils/response.util.js';

export const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: req.userId, receiver: userId },
        { sender: userId, receiver: req.userId },
      ],
    })
      .populate('sender', 'name email profileImage')
      .populate('receiver', 'name email profileImage')
      .sort({ createdAt: 1 });

    return successResponse(res, 200, { messages }, 'Messages fetched successfully');
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const saveMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;

    if (!receiverId || !content) {
      return errorResponse(res, 400, 'Please provide all required fields');
    }

    const message = await Message.create({
      sender: req.userId,
      receiver: receiverId,
      content,
    });

    await message.populate('sender', 'name email profileImage');
    await message.populate('receiver', 'name email profileImage');

    return successResponse(res, 201, { message }, 'Message saved successfully');
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    
    await Message.updateMany(
      { sender: userId, receiver: req.userId, isRead: false },
      { isRead: true }
    );

    return successResponse(res, 200, {}, 'Messages marked as read');
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};
