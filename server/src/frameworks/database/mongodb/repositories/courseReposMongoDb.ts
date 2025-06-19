import Course from '../models/course';
import mongoose, { FilterQuery } from 'mongoose';
import Students from '../models/student';
import {
  AddCourseInfoInterface,
  EditCourseInfo,
  CourseInterface
} from '@src/types/courseInterface';

export const courseRepositoryMongodb = () => {
  const addCourse = async (courseInfo: AddCourseInfoInterface) => {
    const newCourse = new Course(courseInfo);
    newCourse.price ? (newCourse.isPaid = true) : (newCourse.isPaid = false);
    const { _id: courseId } = await newCourse.save();
    return courseId;
  };

  const editCourse = async (courseId: string, editInfo: EditCourseInfo) => {
    const response = await Course.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(courseId) },
      { ...editInfo }
    );
    return response;
  };

  const getAllCourse = async () => {
    const courses: CourseInterface[] | null = await Course.find({});
    return courses;
  };

  const getCourseById = async (courseId: string) => {
    const course: CourseInterface | null = await Course.findOne({
      _id: new mongoose.Types.ObjectId(courseId)
    }).lean()
    return course;
  };

  const getCourseByInstructorId = async (instructorId: string) => {
    const courses = await Course.find({
      instructorId: new mongoose.Types.ObjectId(instructorId)
    });
    return courses;
  };

  const getAmountByCourseId = async (courseId: string) => {
    try {
      const course = await Course.findOne(
        { _id: new mongoose.Types.ObjectId(courseId) },
        { price: 1, title: 1, isPaid: 1 } // Thêm title để không bị lỗi
      ).lean();
      return course;
    } catch (error) {
      console.error('getAmountByCourseId error:', error);
      return null;
    }
  };

  const enrollStudent = async (courseId: string, studentId: string) => {
    const response = await Course.updateOne(
      { _id: new mongoose.Types.ObjectId(courseId) },
      { $push: { coursesEnrolled: studentId } }
    );
    return response;
  };

  const getRecommendedCourseByStudentInterest = async (studentId: string) => {
    const pipeline = [
      { $match: { _id: new mongoose.Types.ObjectId(studentId) } },
      { $unwind: '$interests' },
      {
        $lookup: {
          from: 'categories',
          localField: 'interests',
          foreignField: 'name',
          as: 'category'
        }
      },
      { $unwind: '$category' },
      {
        $lookup: {
          from: 'course',
          localField: 'category.name',
          foreignField: 'category',
          as: 'courses'
        }
      },
      { $unwind: '$courses' },
      {
        $lookup: {
          from: 'instructor',
          localField: 'courses.instructorId',
          foreignField: '_id',
          as: 'instructor'
        }
      },
      {
        $addFields: {
          instructor: { $arrayElemAt: ['$instructor', 0] }
        }
      },
      {
        $project: {
          course: {
            _id: '$courses._id',
            name: '$courses.title',
            thumbnailKey: '$courses.thumbnail.key'
          },
          instructor: {
            _id: '$instructor._id',
            firstName: '$instructor.firstName',
            lastName: '$instructor.lastName',
            email: '$instructor.email',
            profileKey: '$instructor.profilePic.key'
          }
        }
      }
    ];
    const courses = await Students.aggregate(pipeline);
    return courses;
  };

  const getTrendingCourses = async () => {
    const courses = await Course.aggregate([
      {
        $sort: { enrolledCount: -1 }
      },
      {
        $limit: 10
      },
      {
        $lookup: {
          from: 'instructor',
          localField: 'instructorId',
          foreignField: '_id',
          as: 'instructor'
        }
      },
      {
        $project: {
          title: '$title',
          coursesEnrolled: '$coursesEnrolled',
          thumbnail: '$thumbnail',
          instructorFirstName: { $arrayElemAt: ['$instructor.firstName', 0] },
          instructorLastName: { $arrayElemAt: ['$instructor.lastName', 0] },
          instructorProfile: { $arrayElemAt: ['$instructor.profilePic', 0] },
          profileUrl: ''
        }
      }
    ]);
    return courses;
  };

  const getCourseByStudent = async (id: string) => {
    const courses: CourseInterface[] | null = await Course.find({
      coursesEnrolled: {
        $in: [new mongoose.Types.ObjectId(id)]
      }
    });
    return courses;
  };

  const getTotalNumberOfCourses = async () => {
    const totalCourses = await Course.find().count();
    return totalCourses;
  };

  const getNumberOfCoursesAddedInEachMonth = async () => {
    const courseCountsByMonth = await Course.aggregate([
      {
        $group: {
          _id: { $month: '$createdAt' },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          month: '$_id',
          count: 1,
          _id: 0
        }
      },
      {
        $sort: {
          month: 1
        }
      }
    ]);
    return courseCountsByMonth;
  };

  const getStudentsByCourseForInstructor = async (instructorId: string) => {
    const students = await Course.aggregate([
      {
        $match: { instructorId: new mongoose.Types.ObjectId(instructorId) }
      },
      {
        $unwind: '$coursesEnrolled'
      },
      {
        $lookup: {
          from: 'students',
          localField: 'coursesEnrolled',
          foreignField: '_id',
          as: 'studentDetails'
        }
      },
      {
        $project: {
          student: { $arrayElemAt: ['$studentDetails', 0] },
          courseName: '$title'
        }
      },
      {
        $group: {
          _id: '$student._id',
          course: { $first: '$courseName' },
          firstName: { $first: '$student.firstName' },
          lastName: { $first: '$student.lastName' },
          email: { $first: '$student.email' },
          mobile: { $first: '$student.mobile' },
          dateJoined: { $first: '$student.dateJoined' },
          isBlocked: { $first: '$student.isBlocked' },
          profilePic: { $first: '$student.profilePic' },
          isGoogleUser: { $first: '$student.isGoogleUser' }
        }
      }
    ]);
    return students;
  };

  // Thay thế hàm searchCourse trong file:
// server/src/frameworks/database/mongodb/repositories/courseReposMongoDb.ts

const searchCourse = async (
  isFree: boolean,
  searchQuery: string,
  filterQuery: string
) => {
  console.log('🔍 Repository search params:', { isFree, searchQuery, filterQuery });
  
  let query: any = {};
  
  try {
    // ✅ Build query without $text operator - using regex instead
    if (searchQuery && searchQuery.trim() !== '' && filterQuery && filterQuery.trim() !== '') {
      // Both search and filter provided
      query = {
        $and: [
          {
            $or: [
              { title: new RegExp(searchQuery, 'i') },
              { description: new RegExp(searchQuery, 'i') },
              { category: new RegExp(searchQuery, 'i') },
              { tags: { $in: [new RegExp(searchQuery, 'i')] } },
              { about: new RegExp(searchQuery, 'i') }
            ]
          },
          { isFree: isFree }
        ]
      };
    } else if (searchQuery && searchQuery.trim() !== '') {
      // Only search query provided
      const searchConditions = {
        $or: [
          { title: new RegExp(searchQuery, 'i') },
          { description: new RegExp(searchQuery, 'i') },
          { category: new RegExp(searchQuery, 'i') },
          { tags: { $in: [new RegExp(searchQuery, 'i')] } },
          { about: new RegExp(searchQuery, 'i') }
        ]
      };

      if (isFree) {
        query = {
          $and: [
            searchConditions,
            { isFree: true }
          ]
        };
      } else {
        query = searchConditions;
      }
    } else if (filterQuery && filterQuery.trim() !== '') {
      // Only filter provided - search by category and other fields
      query = {
        $or: [
          { category: new RegExp(filterQuery, 'i') },
          { title: new RegExp(filterQuery, 'i') },
          { description: new RegExp(filterQuery, 'i') },
          { tags: { $in: [new RegExp(filterQuery, 'i')] } },
          { about: new RegExp(filterQuery, 'i') }
        ]
      };
      
      // Add isFree condition if applicable
      if (isFree) {
        query = {
          $and: [
            query,
            { isFree: true }
          ]
        };
      }
    } else {
      // ✅ Fallback - return all courses if no valid search params
      query = {};
    }

    console.log('🔍 MongoDB query (using regex):', JSON.stringify(query, null, 2));

    // ✅ Execute query with regular find (no text scoring needed)
    const courses = await Course.find(query);

    console.log('✅ Found courses:', courses.length);
    return courses;
  } catch (error) {
    console.error('❌ Repository search error:', error);
    throw error;
  }
};
  

  return {
    addCourse,
    editCourse,
    getAllCourse,
    getCourseById,
    getCourseByInstructorId,
    getAmountByCourseId,
    enrollStudent,
    getRecommendedCourseByStudentInterest,
    getTrendingCourses,
    getCourseByStudent,
    getTotalNumberOfCourses,
    getNumberOfCoursesAddedInEachMonth,
    getStudentsByCourseForInstructor,
    searchCourse
  };
};

export type CourseRepositoryMongoDbInterface = typeof courseRepositoryMongodb;
