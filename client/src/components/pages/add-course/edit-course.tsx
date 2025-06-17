import React, { useState, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage} from "formik";
import { AddCourseValidationSchema } from "../../../validations/course/AddCourse";
import { Switch } from "@material-tailwind/react";
import { toast } from "react-toastify";
import { getIndividualCourse } from "../../../api/endpoints/course/course";
import { useNavigate, useParams } from "react-router-dom";
import { CourseInterface } from "../../../types/course";
import { ApiResponseCategory } from "../../../api/types/apiResponses/api-response-category";
import { getAllCategories } from "../../../api/endpoints/category";
import Modal from "react-modal";
import { Document, Page, pdfjs } from "react-pdf";
import { AiOutlineClose } from "react-icons/ai";
import { editCourse } from "../../../api/endpoints/course/course";
pdfjs.GlobalWorkerOptions.workerSrc = "/path/to/pdf.worker.js";

const isValidObjectId = (id: string): boolean => {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
};

interface InitialValType {
  title: string;
  instructor: string;
  about: string;
  duration: string | number;
  description: string;
  requirements: string;
  lessons: string;
  category: string;
  price: string | number;
  tags: string;
  syllabus: string;
  level:string;
  [key: string]: string | number;
}
const initialValues: InitialValType = {
  title: "",
  instructor: "",
  duration: "",
  description: "",
  requirements: "",
  lessons: "",
  category: "",
  price: "",
  tags: "",
  about: "",
  syllabus: "",
  level:""
};
const levels = ["easy", "medium", "hard"];
const EditCourse: React.FC = () => {
  const [paid, setPaid] = useState(false);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [guidelines, setGuidelines] = useState<File | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState<CourseInterface | null>(null);
  const params = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const courseId = params.courseId;

  console.log('🔍 EditCourse - Raw params:', params);
  console.log('🔍 EditCourse - Extracted courseId:', courseId);


  useEffect(() => {
    if (!courseId) {
      toast.error('Course ID is missing');
      navigate('/instructor/courses');
      return;
    }

    if (!isValidObjectId(courseId)) {
      toast.error('Invalid course ID format');
      navigate('/instructor/courses');
      return;
    }
  }, [courseId, navigate]);
  const [categories, setCategories] = useState<ApiResponseCategory[] | null>(
    null
  );
  const [isThumbnailModalOpen, setIsThumbnailModalOpen] = useState(false);
  const [isGuidelinesModalOpen, setIsGuidelinesModalOpen] = useState(false);
  const fetchCategory = async () => {
    try {
      const response = await getAllCategories();
      setCategories(response.data);
    } catch (error) {
      toast.error("something went wrong");
    }
  };

  const fetchCourse = async (courseId: string) => {
    if (!courseId || !isValidObjectId(courseId)) {
      toast.error('Invalid course ID');
      return;
    }

    try {
      console.log('📤 Fetching course for editing:', courseId);
      const response = await getIndividualCourse(courseId);
      
      if (response?.data?.data) {
        setCourse(response.data.data);
        setPaid(response.data.data.isPaid || false);
      } else {
        toast.error('Course not found');
        navigate('/instructor/courses');
      }
    } catch (error: any) {
      console.error('❌ Error fetching course:', error);
      toast.error(error?.response?.data?.message || 'Failed to load course');
      navigate('/instructor/courses');
    }
  };

  
  
  useEffect(() => {
    if (course) {
      initialValues.title = course.title;
      initialValues.category = course.category;
      initialValues.level=course.level
      initialValues.description = course.description;
      initialValues.duration = course.duration;
      initialValues.tags = course.tags.join(" ");
      initialValues.price = course.price;  
      initialValues.about = course.about;
      initialValues.syllabus = course.syllabus.join("");
      initialValues.requirements = course.requirements.join("");
      setPaid(course.isPaid);
    }
  }, [course]);

  const handleFormSubmit = async (values: any) => {
    try {
      const formData = new FormData();
      guidelines && formData.append("files", guidelines);
      thumbnail && formData.append("files", thumbnail);
      Object.keys(values).forEach((key) => formData.append(key, values[key]));
      const response = await editCourse(courseId ?? "", formData);
      toast.success(response.data.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } catch (error: any) {
      toast.error(error.data.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);
  useEffect(() => {
    if (courseId) {
      fetchCourse(courseId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <div>loading...</div>;
  }

  const handlePaid = () => {
    setPaid(!paid);
  };

  const toggleThumbnailModal = () => {
    setIsThumbnailModalOpen(!isThumbnailModalOpen);
  };

  const toggleGuidelinesModal = () => {
    setIsGuidelinesModalOpen(!isGuidelinesModalOpen);
  };

  return (
    <div className='mb-20'>
      <div className='ml-12 pl-20'>
        <h1 className='font-bold text-xl text-gray-800'>Edit Course</h1>
      </div>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={AddCourseValidationSchema}
        onSubmit={handleFormSubmit}
      >
        <Form>
          <div className='bg-white ml-32  rounded-lg border-2 border-gray-200 mr-32 mb-24 mt-2 p-5'>
            <div className='flex  w-full justify-center mt-10 pt-3 space-x-14 '>
              <div>
                <div className='mb-3'>
                  <label
                    htmlFor='title'
                    className='block text-sm font-medium leading-6 text-gray-900'
                  >
                    Title
                  </label>
                  <Field
                    type='text'
                    id='title'
                    name='title'
                    className='pl-2 block w-80 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-700 focus-visible:outline-none focus-visible:ring-blue-600 sm:text-sm sm:leading-6'
                  />
                  <ErrorMessage
                    name='title'
                    component='div'
                    className='text-red-500 text-sm'
                  />
                </div>

                <div className='mb-3'>
                  <label
                    htmlFor='duration'
                    className='block text-sm font-medium leading-6 text-gray-900'
                  >
                    Duration (in weeks)
                  </label>
                  <Field
                    type='number'
                    id='duration'
                    name='duration'
                    className='pl-2 block w-80 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-700 focus-visible:outline-none focus-visible:ring-blue-600 sm:text-sm sm:leading-6'
                  />
                  <ErrorMessage
                    name='duration'
                    component='div'
                    className='text-red-500 text-sm'
                  />
                </div>

                <div className='mb-3'>
                  <label
                    htmlFor='category'
                    className='block text-sm font-medium leading-6 text-gray-900'
                  >
                    Category
                  </label>
                  <Field
                    as='select'
                    id='category'
                    name='category'
                    className='pl-2 block w-80 rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-700 focus-visible:outline-none focus-visible:ring-blue-600 sm:text-sm sm:leading-6'
                  >
                    {categories?.map(({ _id, name }, index) => (
                      <option value={name} key={_id}>
                        {name}
                      </option>
                    ))}
                  </Field>  
                  <ErrorMessage
                    name='category'
                    component='div'
                    className='text-red-500 text-sm'
                  />
                </div>

                <div className='mb-3'>
                  <label
                    htmlFor='level'
                    className='block text-sm font-medium leading-6 text-gray-900'
                  >
                    Level
                  </label>
                  <Field
                    as='select'
                    id='level'
                    name='level'
                    className='pl-2 block w-80 rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-700 focus-visible:outline-none focus-visible:ring-blue-600 sm:text-sm sm:leading-6'
                  >
                    {levels.map((level, index) => (
                      <option key={index} value={level}>
                        {level}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name='level'
                    component='div'
                    className='text-red-500 text-sm'
                  />
                </div>
                <div className='mb-3'>
                  <label
                    htmlFor='tags'
                    className='block text-sm font-medium leading-6 text-gray-900'
                  >
                    Tags
                  </label>
                  <Field
                    type='text'
                    id='tags'
                    name='tags'
                    className='pl-2 block w-80 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-700 focus-visible:outline-none focus-visible:ring-blue-600 sm:text-sm sm:leading-6'
                  />
                  <ErrorMessage
                    name='tags'
                    component='div'
                    className='text-red-500 text-sm'
                  />
                </div>

                <div className='mb-3'>
                  <div className='mb-5 mt-2 pl-2 pt-5 '>
                    <Switch
                      id='auto-update'
                      checked={paid}
                      onChange={handlePaid}
                      label='Paid'
                    />
                  </div>

                  {paid && (
                    <div className=''>
                      <label
                        htmlFor='price'
                        className='block text-sm font-medium leading-6 text-gray-900'
                      >
                        Price
                      </label>
                      <Field
                        type='number'
                        id='price'
                        name='price'
                        className='pl-2 block w-80 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-700 focus-visible:outline-none focus-visible:ring-blue-600 sm:text-sm sm:leading-6'
                      />
                      <ErrorMessage
                        name='price'
                        component='div'
                        className='text-red-500 text-sm'
                      />
                    </div>
                  )}
                </div>
              </div>
              <div>
                <div className='mb-2'>
                  <label
                    htmlFor='about'
                    className='block text-sm font-medium leading-6 text-gray-900'
                  >
                    About
                  </label>
                  <Field
                    as='textarea'
                    id='about'
                    name='about'
                    rows={4}
                    className='pl-2 block w-80 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-700 focus-visible:outline-none focus-visible:ring-blue-600 sm:text-sm sm:leading-6'
                  />
                  <ErrorMessage
                    name='about'
                    component='div'
                    className='text-red-500 text-sm'
                  />
                </div>
                <div className='mb-2'>
                  <label
                    htmlFor='description'
                    className='block text-sm font-medium leading-6 text-gray-900'
                  >
                    Description
                  </label>
                  <Field
                    as='textarea'
                    id='description'
                    name='description'
                    rows={4}
                    className='pl-2 block w-80 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-700 focus-visible:outline-none focus-visible:ring-blue-600 sm:text-sm sm:leading-6'
                  />
                  <ErrorMessage
                    name='description'
                    component='div'
                    className='text-red-500 text-sm'
                  />
                </div>
                <div className='mb-2'>
                  <label
                    htmlFor='syllabus'
                    className='block text-sm font-medium leading-6 text-gray-900'
                  >
                    Syllabus
                  </label>
                  <Field
                    as='textarea'
                    id='syllabus'
                    name='syllabus'
                    rows={4}
                    className='pl-2 block w-80 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-700 focus-visible:outline-none focus-visible:ring-blue-600 sm:text-sm sm:leading-6'
                  />
                  <ErrorMessage
                    name='syllabus'
                    component='div'
                    className='text-red-500 text-sm'
                  />
                </div>
                <div className='mb-2'>
                  <label
                    htmlFor='syllabus'
                    className='block text-sm font-medium leading-6 text-gray-900'
                  >
                    Requirements
                  </label>
                  <Field
                    as='textarea'
                    id='requirements'
                    name='requirements'
                    rows={4}
                    className='pl-2 block w-80 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-700 focus-visible:outline-none focus-visible:ring-blue-600 sm:text-sm sm:leading-6'
                  />
                  <ErrorMessage
                    name='requirements'
                    component='div'
                    className='text-red-500 text-sm'
                  />
                </div>
              </div>
            </div>

            <div className='flex w-full justify-center mt-14 pt-3 space-x-14'>
              <div>
                <div className='mb-2'>
                  <label
                    htmlFor='guidelines'
                    className='block text-sm font-medium leading-6 text-gray-900'
                  >
                    Course guidelines
                  </label>
                  <input
                    type='file'
                    id='guidelines'
                    name='guidelines'
                    accept='application/pdf'
                    onChange={(event) => {
                      const file = event.target.files?.[0] || null;
                      setGuidelines(file);
                    }}
                    className='pl-2 block w-80 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-700 focus-visible:outline-none focus-visible:ring-blue-600 sm:text-sm sm:leading-6'
                  />
                  <ErrorMessage
                    name='guidelines'
                    component='div'
                    className='text-red-500 text-sm'
                  />
                  {course?.guidelinesUrl && (
                    <button
                      type='button'
                      onClick={toggleGuidelinesModal}
                      className='mt-2'
                    >
                      View Guidelines PDF
                    </button>
                  )}
                </div>
              </div>

              <div>
                <div className='mb-2'>
                  <label
                    htmlFor='thumbnail'
                    className='block text-sm font-medium leading-6 text-gray-900'
                  >
                    Thumbnail
                  </label>
                  <input
                    type='file'
                    id='thumbnail'
                    name='thumbnail'
                    accept='image/*'
                    onChange={(event) => {
                      const file = event.target.files?.[0] || null;
                      setThumbnail(file);
                    }}
                    className='pl-2 block w-80 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-700 focus-visible:outline-none focus-visible:ring-blue-600 sm:text-sm sm:leading-6'
                  />
                  <ErrorMessage
                    name='thumbnail'
                    component='div'
                    className='text-red-500 text-sm'
                  />
                  {course?.thumbnailUrl && (
                    <button
                      type='button'
                      onClick={toggleThumbnailModal}
                      className='mt-2'
                    >
                      View Thumbnail
                    </button>
                  )}
                </div>
              </div>
              <Modal
                isOpen={isThumbnailModalOpen}
                onRequestClose={toggleThumbnailModal}
                contentLabel='Thumbnail Modal'
              >
                <button
                  onClick={toggleThumbnailModal}
                  className='absolute top-0 right-0 mt-3 mr-3 m-2 hover:bg-red-400 hover:text-white text-gray-600 '
                >
                  <AiOutlineClose />
                </button>
                {course?.thumbnailUrl && (
                  <img
                    src={
                      thumbnail
                        ? URL.createObjectURL(thumbnail)
                        : course.thumbnailUrl
                    }
                    alt='Thumbnail'
                    style={{ maxWidth: "100%", maxHeight: "100%" }}
                  />
                )}
              </Modal>

              <Modal
                isOpen={isGuidelinesModalOpen}
                onRequestClose={toggleGuidelinesModal}
                contentLabel='Guidelines PDF Modal'
              >
                {guidelines && (
                  <Document
                    file={
                      guidelines
                        ? URL.createObjectURL(guidelines)
                        : course?.guidelinesUrl
                    }
                  >
                    <Page pageNumber={1} />
                  </Document>
                )}
                <button onClick={toggleGuidelinesModal} className='mt-2'>
                  Close Modal
                </button>
              </Modal>
            </div>
            <div className='flex justify-center  mt-8'>
              <button
                type='submit'
                className='bg-blue-500 mt-5 text-white px-3 py-2 rounded-md'
              >
                Submit
              </button>
            </div>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default EditCourse;
