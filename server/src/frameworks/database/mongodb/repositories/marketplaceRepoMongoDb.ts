import mongoose from 'mongoose';
import Enrollment from '../models/enrollment';
import Achievement from '../models/achievement';
import AdminEarning from '../models/adminEarning';
import Payout from '../models/payout';
import Students from '../models/student';

export const marketplaceDbRepository = () => {
  const createEnrollment = async (studentId: string, courseId: string) => {
    const studentObjectId = new mongoose.Types.ObjectId(studentId);
    const courseObjectId = new mongoose.Types.ObjectId(courseId);

    await Enrollment.findOneAndUpdate(
      { studentId: studentObjectId, courseId: courseObjectId },
      {
        $setOnInsert: {
          studentId: studentObjectId,
          courseId: courseObjectId,
          enrolledAt: new Date(),
          status: 'active',
        },
      },
      { upsert: true, new: true }
    );

    await Students.updateOne(
      { _id: studentObjectId },
      { $addToSet: { coursesEnrolled: courseObjectId } }
    );
  };

  const recordPaidEnrollment = async (options: {
    studentId: string;
    courseId: string;
    instructorId: string;
    amount: number;
    currency: string;
    paymentId: string;
  }) => {
    const now = new Date();
    const adminShare = Math.round(options.amount * 0.2);
    const instructorShare = options.amount - adminShare;

    await AdminEarning.create({
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      courseId: new mongoose.Types.ObjectId(options.courseId),
      paymentId: options.paymentId,
      amount: adminShare,
      currency: options.currency,
    });

    await Payout.create({
      instructorId: new mongoose.Types.ObjectId(options.instructorId),
      courseId: new mongoose.Types.ObjectId(options.courseId),
      amount: instructorShare,
      currency: options.currency,
      status: 'pending',
      paymentId: options.paymentId,
    });
  };

  const grantCourseAchievement = async (
    studentId: string,
    courseId: string,
    courseTitle: string
  ) => {
    await Achievement.findOneAndUpdate(
      {
        studentId: new mongoose.Types.ObjectId(studentId),
        courseId: new mongoose.Types.ObjectId(courseId),
        title: `Completed: ${courseTitle}`,
      },
      {
        $setOnInsert: {
          studentId: new mongoose.Types.ObjectId(studentId),
          courseId: new mongoose.Types.ObjectId(courseId),
          title: `Enrolled: ${courseTitle}`,
          description: 'Successfully enrolled in the course',
          earnedAt: new Date(),
        },
      },
      { upsert: true, new: true }
    );
  };

  return {
    createEnrollment,
    recordPaidEnrollment,
    grantCourseAchievement,
  };
};

export type MarketplaceDbRepository = ReturnType<typeof marketplaceDbRepository>;
