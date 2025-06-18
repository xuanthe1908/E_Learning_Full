import { Schema, model } from 'mongoose';

const messageSchema = new Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const aiChatSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'userType'
  },
  userType: {
    type: String,
    enum: ['students', 'instructor'],
    required: true
  },
  title: {
    type: String,
    required: true,
    default: 'Chat mới'
  },
  messages: [messageSchema],
  isActive: {
    type: Boolean,
    default: true
  },
  metadata: {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'course',
      required: false
    },
    lessonId: {
      type: Schema.Types.ObjectId,
      ref: 'lessons',
      required: false
    },
    tags: [String]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

aiChatSchema.index({ userId: 1, userType: 1 });
aiChatSchema.index({ createdAt: -1 });

const AiChat = model('AiChat', aiChatSchema, 'ai_chats');
export default AiChat;