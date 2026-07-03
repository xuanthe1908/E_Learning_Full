import mongoose, { Document, Schema, model } from 'mongoose';

export interface IEnrollment extends Document {
  studentId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  enrolledAt: Date;
  status: 'active' | 'completed' | 'cancelled';
}

const enrollmentSchema = new Schema<IEnrollment>({
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
  enrolledAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active',
  },
});

enrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

const Enrollment = model<IEnrollment>('enrollments', enrollmentSchema, 'enrollments');

export default Enrollment;
