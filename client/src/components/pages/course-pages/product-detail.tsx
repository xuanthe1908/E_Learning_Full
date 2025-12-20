import React, { useState } from "react";
import CustomBreadCrumbs from "../../common/bread-crumbs";
import { Link, useLocation } from "react-router-dom";
import { Button, Chip } from "@material-tailwind/react";
import { getIndividualCourse } from "../../../api/endpoints/course/course";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { CourseInterface } from "../../../types/course";
import { formatToINR } from "../../../utils/helpers";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { BiVideo } from "react-icons/bi";
import { IoBookSharp } from "react-icons/io5";
import useApiData from "../../../hooks/useApiCall";
import { getLessonsByCourse } from "../../../api/endpoints/course/lesson";
import { useDispatch } from "react-redux";
import { setCourse } from "../../../redux/reducers/courseSlice";
import { useSelector } from "react-redux";
import { selectStudentId } from "../../../redux/reducers/studentSlice";
import { MdDone } from "react-icons/md";
import { addToCart } from "../../../redux/reducers/cartSlice";
import { ShoppingCartIcon, HeartIcon, ShareIcon } from "@heroicons/react/24/outline";
import PaymentConfirmationModal from "./payment-confirmation-modal";
import PdfViewer from "./pdf-viewer";
import ViewCourseShimmer from "components/shimmer/view-course-shimmer";

const isValidObjectId = (id: string): boolean => {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
};

const ProductDetailPage: React.FC = () => {
  const params = useParams<{ courseId: string }>();
  const [expandedIndex, setExpandedIndex] = useState(null);
  const courseId = params.courseId;
  const [openPaymentConfirmation, setOpenPaymentConfirmation] =
    useState<boolean>(false);
  const dispatch = useDispatch();
  const studentId = useSelector(selectStudentId);
  const [showPdf] = useState(false);
  const [successToastShown, setSuccessToastShown] = useState(false);

  const fetchCourse = async (courseId: string): Promise<CourseInterface> => {
    if (!courseId || !isValidObjectId(courseId)) {
      throw new Error('Invalid course ID format');
    }
    try {
      const course = await getIndividualCourse(courseId);
      return course?.data?.data as CourseInterface;
    } catch (error: any) {
      toast.error(error.data.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      throw error;
    }
  };
  const fetchLessons = async (courseId: string) => {
    if (!courseId || !isValidObjectId(courseId)) {
      throw new Error('Invalid course ID for lessons');
    }
    try {
      const lessons = await getLessonsByCourse(courseId);
      return lessons.data;
    } catch (error: any) {
      toast.error(error.data.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      throw error;
    }
  };
  
  const shouldFetch = courseId && isValidObjectId(courseId);
  
  const { data, isLoading, refreshData } = useApiData(
    fetchCourse, 
    shouldFetch ? courseId : null // Pass null if invalid
  );
  
  const { data: lessons, isLoading: isLessonsLoading } = useApiData(
    fetchLessons,
    shouldFetch ? courseId : null // Pass null if invalid
  );

  const course: CourseInterface | null = data;
  course && dispatch(setCourse({ course }));

  const handleToggle = (index: any) => {
    setExpandedIndex(index === expandedIndex ? null : index);
  };
  const handleAddToCart = () => {
    if (!course) return;
    dispatch(addToCart({
      _id: course._id || '',
      title: course.title || '',
      description: course.description || '',
      thumbnailUrl: course.thumbnailUrl || '',
      price: course.price || 0,
      isPaid: course.isPaid || false,
      rating: course.rating || 0,
    } as CourseInterface));
    toast.success("Đã thêm vào giỏ hàng!", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
  };

  const handleBuyNow = () => {
    // Thêm vào giỏ hàng trước, rồi chuyển đến checkout
    if (course) {
      dispatch(addToCart({
        _id: course._id || '',
        title: course.title || '',
        description: course.description || '',
        thumbnailUrl: course.thumbnailUrl || '',
        price: course.price || 0,
        isPaid: course.isPaid || false,
        rating: course.rating || 0,
      } as CourseInterface));
      // Chuyển đến trang checkout
      window.location.href = '/checkout';
    }
  };
  const location = useLocation();
  if (isLoading || isLessonsLoading) {
    return <ViewCourseShimmer />;
  }

  if (location.hash === "#success" && !successToastShown) {
    toast.success("Successfully enrolled into the course", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
    setSuccessToastShown(true);
  }
  const enrolled = (course?.coursesEnrolled || []).includes(studentId);
  
  if (!course) {
    return <ViewCourseShimmer />;
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-purple-50/20'>
      <PaymentConfirmationModal
        open={openPaymentConfirmation}
        setUpdated={refreshData}
        courseDetails={{
          price: course?.price ?? 0,
          overview: course?.description ?? "",
          isPaid: course?.isPaid ?? false,
        }}
        setOpen={setOpenPaymentConfirmation}
      />
      
      <div className='bg-white border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <CustomBreadCrumbs paths={location.pathname} />
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Left Column - Main Content */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Product Image */}
            <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
              <div className='relative aspect-video w-full bg-gradient-to-br from-gray-100 to-gray-200'>
                <img
                  className='w-full h-full object-cover'
                  src={course?.thumbnailUrl}
                  alt={course?.title}
                />
                <div className='absolute top-4 right-4'>
                  <div className='bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 text-sm font-bold rounded-full shadow-lg'>
                    {course?.isPaid ? 'Bán chạy' : 'Miễn phí'}
                  </div>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className='bg-white rounded-xl shadow-lg p-8'>
              <div className='mb-6'>
                <h1 className='text-4xl font-extrabold text-gray-900 mb-4'>{course?.title}</h1>
                <p className='text-lg text-gray-600 leading-relaxed'>{course?.description}</p>
              </div>

              {/* Product Details Grid */}
              <div className='grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg'>
                <div>
                  <span className='text-sm text-gray-500'>Mức độ:</span>
                  <div className={`inline-block ml-2 rounded-full px-3 py-1 text-sm font-semibold text-white ${
                    course?.level === "easy"
                      ? "bg-green-500"
                      : course?.level === "medium"
                      ? "bg-orange-500"
                      : course?.level === "hard"
                      ? "bg-red-500"
                      : "bg-blue-500"
                  }`}>
                    {course?.level}
                  </div>
                </div>
                <div>
                  <span className='text-sm text-gray-500'>Thời lượng:</span>
                  <p className='text-base font-semibold text-gray-900'>{course?.duration} tuần</p>
                </div>
              </div>
              {/* Syllabus Section */}
              <div className='mb-8'>
                <h4 className='text-2xl font-bold mb-4 text-gray-900'>Nội dung khóa học</h4>
              <ul className='text-gray-700 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden'>
                <li
                  className={` p-6 border-b-2 cursor-pointer ${
                    expandedIndex === 0
                      ? "bg-blue-gray-50"
                      : "hover:bg-blue-gray-50"
                  }`}
                  onClick={() => handleToggle(0)}
                >
                  <div className='flex items-center'>
                    <span className='text-blue-500 mr-2'>&#9679;</span>
                    <span>Module 1: Introduction to the Course</span>
                    {expandedIndex === 0 ? (
                      <FaAngleUp className='ml-auto' />
                    ) : (
                      <FaAngleDown className='ml-auto' />
                    )}
                  </div>
                </li>
                {expandedIndex === 0 && (
                  <li className=''>
                    <ul>
                      <Link to={course?.guidelinesUrl ?? ""} target="_blank" rel="noopener noreferrer" >
                        <li
                          className='p-6 border-b border-gray-200 flex items-center cursor-pointer hover:bg-blue-50 transition-colors'
                        >
                          <IoBookSharp className='mr-2 text-blue-500' />
                          <span className='flex-1'>Important guidelines</span>
                        </li>
                      </Link>
                      {showPdf && (
                        <PdfViewer pdfUrl={course?.guidelinesUrl ?? ""} />
                      )}

                      {/* <Link to={`watch-lessons/introduction`}>
                        <li className='p-6 border-b flex items-center cursor-pointer hover:bg-customBlueShade'>
                          <BiVideo className='mr-2 text-blue-500' />
                          <span className='flex-1'>Introduction video</span>
                        </li>
                      </Link> */}
                    </ul>
                  </li>
                )}
                <li
                  className={` p-6 border-b-2 cursor-pointer ${
                    expandedIndex === 1
                      ? "bg-blue-gray-50"
                      : "hover:bg-blue-gray-50"
                  }`}
                  onClick={() => handleToggle(1)}
                >
                  <div className='flex items-center'>
                    <span className='text-blue-500 mr-2'>&#9679;</span>
                    <span>Module 2: Advanced Techniques</span>
                    {expandedIndex === 1 ? (
                      <FaAngleUp className='ml-auto' />
                    ) : (
                      <FaAngleDown className='ml-auto' />
                    )}
                  </div>
                </li>
                {expandedIndex === 1 && (
                  <li className=''>
                    <ul>
                      {lessons && lessons.length > 0 ? (
                        lessons.map((lesson: any) => {
                          return (
                            <Link
                              to={`watch-lessons/${lesson._id}`}
                              key={lesson._id}
                            >
                              <li className='p-6 border-b border-gray-200 flex items-center cursor-pointer hover:bg-blue-50 transition-colors'>
                                <BiVideo className='mr-2 text-blue-500' />
                                <span className='flex-1'>{lesson.title}</span>
                              </li>
                            </Link>
                          );
                        })
                      ) : (
                        <div className='p-6 text-gray-500'>No lessons available</div>
                      )}
                    </ul>
                  </li>
                )}
              </ul>
            </div>
              {/* About Section */}
              {course?.about && (
                <div className='mb-8'>
                  <h4 className='text-2xl font-bold mb-4 text-gray-900'>Mô tả sản phẩm</h4>
                  <div className='text-gray-700 bg-gray-50 p-6 rounded-lg leading-relaxed'>
                    {course?.about}
                  </div>
                </div>
              )}

              {/* Requirements Section */}
              {(course?.requirements || []).length > 0 && (
                <div className='mb-8'>
                  <h4 className='text-2xl font-bold mb-4 text-gray-900'>Yêu cầu</h4>
                  <ul className='space-y-2'>
                    {(course?.requirements || []).map((item, index) => {
                      return (
                        <li className='flex items-start p-3 bg-gray-50 rounded-lg' key={index}>
                          <span className='text-blue-600 mr-3 mt-1'>&#10003;</span>
                          <span className='text-gray-700'>{item}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-xl shadow-xl border border-gray-200 p-6 sticky top-4'>
              {/* Price */}
              <div className='mb-6 text-center border-b border-gray-200 pb-6'>
                {course?.isPaid ? (
                  <div>
                    <div className='text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2'>
                      {formatToINR(course?.price ?? 0)}
                    </div>
                    <p className='text-sm text-gray-500'>Giá đã bao gồm VAT</p>
                  </div>
                ) : (
                  <div className='text-4xl font-extrabold text-green-600 mb-2'>
                    Miễn phí
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className='space-y-3 mb-6'>
                {enrolled ? (
                  <div className='bg-green-50 border-2 border-green-500 rounded-lg p-4 text-center'>
                    <MdDone className='inline-block text-2xl text-green-600 mb-2' />
                    <p className='text-green-700 font-semibold'>Đã sở hữu sản phẩm</p>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={handleBuyNow}
                      className='w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2'
                    >
                      <ShoppingCartIcon className='h-5 w-5' />
                      Mua ngay
                    </button>
                    <button
                      onClick={handleAddToCart}
                      className='w-full bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2'
                    >
                      <ShoppingCartIcon className='h-5 w-5' />
                      Thêm vào giỏ hàng
                    </button>
                  </>
                )}
              </div>

              {/* Product Features */}
              <div className='space-y-3 mb-6 pt-6 border-t border-gray-200'>
                <div className='flex items-center text-gray-700'>
                  <span className='text-green-500 mr-3 text-xl'>&#10003;</span>
                  <span className='text-sm'>Giao hàng nhanh chóng</span>
                </div>
                <div className='flex items-center text-gray-700'>
                  <span className='text-green-500 mr-3 text-xl'>&#10003;</span>
                  <span className='text-sm'>Thanh toán an toàn</span>
                </div>
                <div className='flex items-center text-gray-700'>
                  <span className='text-green-500 mr-3 text-xl'>&#10003;</span>
                  <span className='text-sm'>Hỗ trợ 24/7</span>
                </div>
                <div className='flex items-center text-gray-700'>
                  <span className='text-green-500 mr-3 text-xl'>&#10003;</span>
                  <span className='text-sm'>Đổi trả trong 7 ngày</span>
                </div>
              </div>

              {/* Share Section */}
              <div className='pt-6 border-t border-gray-200'>
                <p className='text-sm text-gray-600 mb-3 text-center'>Chia sẻ sản phẩm</p>
                <div className='flex justify-center gap-3'>
                  <button className='p-2 hover:bg-gray-100 rounded-lg transition-colors'>
                    <ShareIcon className='h-5 w-5 text-gray-600' />
                  </button>
                  <button className='p-2 hover:bg-gray-100 rounded-lg transition-colors'>
                    <HeartIcon className='h-5 w-5 text-gray-600' />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductDetailPage;
