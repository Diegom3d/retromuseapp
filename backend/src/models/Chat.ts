import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage {
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'audio';
  mediaUrl?: string;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

export interface IChat extends Document {
  participants: string[];
  messages: IMessage[];
  lastMessage?: {
    content: string;
    senderId: string;
    createdAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>({
  senderId: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['text', 'image', 'audio'], default: 'text' },
  mediaUrl: { type: String },
  isRead: { type: Boolean, default: false },
  readAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

const chatSchema = new Schema<IChat>({
  participants: [{ type: String, required: true }],
  messages: [messageSchema],
  lastMessage: {
    content: String,
    senderId: String,
    createdAt: Date
  }
}, { timestamps: true });

export const Chat = mongoose.model<IChat>('Chat', chatSchema);
