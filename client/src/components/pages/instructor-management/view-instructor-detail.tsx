import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getIndividualInstructors } from "../../../api/endpoints/instructor-management";
import { formatDate } from "../../../utils/helpers";
import { toast } from "react-toastify";
import { Button, Chip } from "@material-tailwind/react";
import { InstructorApiResponse } from "../../../api/types/apiResponses/api-response-instructors";
import { USER_AVATAR } from "../../../constants/common";

const ViewInstructorDetail: React.FC = () => {
  const { id } = useParams();
  const [instructor, setInstructor] = useState<InstructorApiResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInfo = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await getIndividualInstructors(id);
        setInstructor(response.data.data);
      } catch (error: any) {
        toast.error(error?.data?.message ?? "Failed to load instructor", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInfo();
  }, [id]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!instructor) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Instructor not found.</p>
        <Link to="/admin/instructors" className="text-indigo-600 mt-2 inline-block">
          Back to instructors
        </Link>
      </div>
    );
  }

  const {
    firstName,
    lastName,
    email,
    profileUrl,
    mobile,
    qualification,
    subjects,
    experience,
    skills,
    about,
    dateJoined,
    certificates,
    isBlocked,
    isVerified,
    blockedReason,
  } = instructor;

  return (
    <div className="bg-white rounded-md mt-2 px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <Link
          to="/admin/instructors"
          className="text-sm text-indigo-600 hover:text-indigo-800"
        >
          ← Back to instructors
        </Link>
        <Chip
          size="sm"
          variant="ghost"
          value={isBlocked ? "Blocked" : isVerified === false ? "Pending" : "Active"}
          color={isBlocked ? "red" : isVerified === false ? "amber" : "green"}
        />
      </div>

      <div className="px-4 py-6 sm:px-6">
        <div className="flex items-center">
          <img
            className="h-12 w-12 rounded-full object-cover"
            src={profileUrl ?? USER_AVATAR}
            alt="Profile"
          />
          <h3 className="text-lg leading-6 font-medium text-gray-900 ml-4">
            {firstName} {lastName}
          </h3>
        </div>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Instructor profile details
        </p>
      </div>

      {certificates?.length > 0 && (
        <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
          <h4 className="text-lg leading-6 font-medium text-gray-900 mb-2">
            Certificates
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
            {certificates.map((certificate, index) => (
              <div key={index} className="flex flex-col items-center">
                <img
                  className="h-40 w-full object-contain text-gray-400 mb-2"
                  src={certificate.url}
                  alt={certificate.name}
                />
                <span className="text-sm font-medium text-indigo-600">
                  {certificate.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Email</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {email}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Mobile</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {mobile || "—"}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Qualification</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {qualification || "—"}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Subjects</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {subjects?.length ? subjects.join(", ") : "—"}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Experience</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {experience || "—"}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Skills</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {skills || "—"}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">About</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {about || "—"}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Date joined</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {dateJoined ? formatDate(dateJoined) : "—"}
            </dd>
          </div>
          {isBlocked && blockedReason && (
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Block reason</dt>
              <dd className="mt-1 text-sm text-red-600 sm:mt-0 sm:col-span-2">
                {blockedReason}
              </dd>
            </div>
          )}
        </dl>
      </div>

      <div className="px-4 py-4 sm:px-6 border-t border-gray-200">
        <Link to="/admin/instructors">
          <Button variant="outlined" color="blue-gray" size="sm">
            Back to list
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ViewInstructorDetail;
