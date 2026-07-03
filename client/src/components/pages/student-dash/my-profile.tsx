import React, { useEffect, useState } from "react";
import ProfileForm from "./profile-from";
import { fetchStudentData } from "../../../redux/reducers/studentSlice";
import { useDispatch } from "react-redux";
import { FiEdit } from "react-icons/fi";
import { AppDispatch } from "../../../redux/store";

const MyProfile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    dispatch(fetchStudentData());
  }, [dispatch]);

  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-11/12">
        <div className="pt-5 pb-6 w-full">
          <h2 className="text-3xl font-semibold text-customFontColorBlack">
            My Profile
          </h2>
          <p className="text-gray-500 mt-1">
            View and update your personal information
          </p>
        </div>
        <div className="pb-10">
          <div className="border w-full max-w-3xl rounded-md bg-white border-gray-300">
            <div className="flex justify-between">
              <h3 className="pl-5 pt-5 text-lg text-customFontColorBlack font-semibold">
                Personal Information
              </h3>
              <button
                className="p-5"
                type="button"
                onClick={() => setEditMode(true)}
              >
                <FiEdit className="text-customFontColorBlack text-lg" />
              </button>
            </div>
            <div className="p-6">
              <ProfileForm editMode={editMode} setEditMode={setEditMode} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
