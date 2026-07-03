import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { PencilIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Avatar,
  IconButton,
  Tooltip,
  Input,
} from "@material-tailwind/react";
import { getAllCourses } from "../../../api/endpoints/course/course";
import { toast } from "react-toastify";
import { formatDate } from "../../../utils/helpers";
import usePagination from "../../../hooks/usePagination";
import { CourseInterface } from "../../../types/course";
import CustomBreadCrumbs from "../../common/bread-crumbs";

const TABLE_HEAD = [
  "Course",
  "Category",
  "Price",
  "Enrolled",
  "Status",
  "Added",
  "",
];

const AdminManageCourses: React.FC = () => {
  const [courses, setCourses] = useState<CourseInterface[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const ITEMS_PER_PAGE = 5;

  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return courses;
    const query = searchQuery.toLowerCase();
    return courses.filter(
      (course) =>
        course.title?.toLowerCase().includes(query) ||
        course.category?.toLowerCase().includes(query)
    );
  }, [courses, searchQuery]);

  const {
    currentPage,
    totalPages,
    currentData,
    goToPage,
    goToPreviousPage,
    goToNextPage,
  } = usePagination(filteredCourses, ITEMS_PER_PAGE);

  const fetchCourses = async () => {
    try {
      const response = await getAllCourses();
      setCourses(response?.data?.data ?? []);
    } catch (error: any) {
      toast.error(error?.data?.message ?? "Failed to load courses", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const formatPrice = (course: CourseInterface) => {
    if (!course.isPaid) return "Free";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(course.price ?? 0);
  };

  return (
    <div className="pr-5">
      <CustomBreadCrumbs paths="/admin/courses" />
      <Card className="h-full w-full mt-3">
        <CardHeader floated={false} shadow={false} className="rounded-none">
          <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div>
              <Typography variant="h5" color="blue-gray">
                Manage Courses
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                Edit and manage all courses on the platform
              </Typography>
            </div>
            <div className="w-full md:w-72">
              <Input
                label="Search courses"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<MagnifyingGlassIcon className="h-5 w-5" />}
              />
            </div>
          </div>
        </CardHeader>

        <CardBody className="overflow-x-auto px-0">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {TABLE_HEAD.map((head) => (
                  <th
                    key={head}
                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                  >
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal leading-none opacity-70"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentData.length === 0 ? (
                <tr>
                  <td colSpan={TABLE_HEAD.length} className="p-8 text-center">
                    <Typography color="gray">No courses found</Typography>
                  </td>
                </tr>
              ) : (
                currentData.map((course, index) => {
                  const isLast = index === currentData.length - 1;
                  const classes = isLast
                    ? "p-4"
                    : "p-4 border-b border-blue-gray-50";

                  return (
                    <tr key={course._id}>
                      <td className={classes}>
                        <div className="flex items-center gap-3">
                          <Avatar
                            src={
                              course.thumbnailUrl ||
                              "https://img.freepik.com/free-vector/online-tutorials-concept_52683-37480.jpg"
                            }
                            alt={course.title}
                            size="md"
                            className="border border-blue-gray-50 bg-blue-gray-50/50 object-cover"
                          />
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-bold max-w-[200px]"
                          >
                            {course.title}
                          </Typography>
                        </div>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray">
                          {course.category}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray">
                          {formatPrice(course)}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray">
                          {course.coursesEnrolled?.length ?? 0}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Chip
                          size="sm"
                          variant="ghost"
                          value={course.isVerified ? "Active" : "Pending"}
                          color={course.isVerified ? "green" : "amber"}
                        />
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray">
                          {course.createdAt
                            ? formatDate(course.createdAt)
                            : "—"}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Tooltip content="Edit course">
                          <Link to={`/admin/courses/edit/${course._id}`}>
                            <IconButton variant="text" color="blue-gray">
                              <PencilIcon className="h-4 w-4" />
                            </IconButton>
                          </Link>
                        </Tooltip>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </CardBody>

        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
          <Button
            variant="outlined"
            color="blue-gray"
            size="sm"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (pageNumber) => (
                <IconButton
                  key={pageNumber}
                  variant={pageNumber === currentPage ? "outlined" : "text"}
                  color="blue-gray"
                  size="sm"
                  onClick={() => goToPage(pageNumber)}
                >
                  {pageNumber}
                </IconButton>
              )
            )}
          </div>
          <Button
            variant="outlined"
            color="blue-gray"
            size="sm"
            onClick={goToNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminManageCourses;
