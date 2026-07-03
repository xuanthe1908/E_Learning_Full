import mongoose, { Document, Schema, model } from 'mongoose';

export interface IBookmark extends Document {
  studentId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  lessonId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const bookmarkSchema = new Schema<IBookmark>({
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
  lessonId: { type: Schema.Types.ObjectId, ref: 'lessons' },
  createdAt: { type: Date, default: Date.now },
});

bookmarkSchema.index({ studentId: 1, courseId: 1, lessonId: 1 }, { unique: true });

const Bookmark = model<IBookmark>('bookmarks', bookmarkSchema, 'bookmarks');

export default Bookmark;
