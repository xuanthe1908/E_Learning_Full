import mongoose, { Document, Schema, model } from 'mongoose';

export interface IAchievement extends Document {
  studentId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  earnedAt: Date;
}

const achievementSchema = new Schema<IAchievement>({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'students',
    required: true,
    index: true,
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'course',
    required: true,
    index: true,
  },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  earnedAt: { type: Date, default: Date.now },
});

const Achievement = model<IAchievement>(
  'achievements',
  achievementSchema,
  'achievements'
);

export default Achievement;
