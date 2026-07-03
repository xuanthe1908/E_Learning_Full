import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiEdit } from "react-icons/fi";
import ChangePasswordForm from "./chage-password-form";
import {
  fetchStudentData,
  selectStudent,
} from "../../../redux/reducers/studentSlice";
import { AppDispatch } from "../../../redux/store";
import { formatDate } from "../../../utils/helpers";

const NOTIFICATION_KEY = "student_notification_prefs";

type NotificationPrefs = {
  courseUpdates: boolean;
  promotionalEmails: boolean;
};

const defaultPrefs: NotificationPrefs = {
  courseUpdates: true,
  promotionalEmails: false,
};

const loadPrefs = (): NotificationPrefs => {
  try {
    const stored = localStorage.getItem(NOTIFICATION_KEY);
    return stored ? { ...defaultPrefs, ...JSON.parse(stored) } : defaultPrefs;
  } catch {
    return defaultPrefs;
  }
};

const StudentSettingsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const student = useSelector(selectStudent)?.studentDetails;
  const [passwordEditMode, setPasswordEditMode] = useState(false);
  const [prefs, setPrefs] = useState<NotificationPrefs>(loadPrefs);

  useEffect(() => {
    dispatch(fetchStudentData());
  }, [dispatch]);

  const handlePrefChange = (key: keyof NotificationPrefs) => {
    setPrefs((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem(NOTIFICATION_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-11/12">
        <div className="pt-5 pb-6 w-full">
          <h2 className="text-3xl font-semibold text-customFontColorBlack">
            Settings
          </h2>
          <p className="text-gray-500 mt-1">
            Manage account security and notification preferences
          </p>
        </div>

        <div className="flex flex-col gap-6 pb-10 max-w-3xl">
          <div className="border w-full rounded-md bg-white border-gray-300 p-6">
            <h3 className="text-lg text-customFontColorBlack font-semibold mb-4">
              Account
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Email</span>
                <p className="font-medium text-gray-900">
                  {student?.email ?? "—"}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Member since</span>
                <p className="font-medium text-gray-900">
                  {student?.dateJoined ? formatDate(student.dateJoined) : "—"}
                </p>
              </div>
              <div>
                <span className="text-gray-500">Sign-in method</span>
                <p className="font-medium text-gray-900">
                  {student?.isGoogleUser ? "Google account" : "Email & password"}
                </p>
              </div>
            </div>
          </div>

          {!student?.isGoogleUser ? (
            <div className="border w-full rounded-md bg-white border-gray-300">
              <div className="flex justify-between items-center">
                <h3 className="pl-5 pt-5 text-lg text-customFontColorBlack font-semibold">
                  Security — Change password
                </h3>
                <button
                  className="p-5"
                  type="button"
                  onClick={() => setPasswordEditMode(true)}
                >
                  <FiEdit className="text-customFontColorBlack text-lg" />
                </button>
              </div>
              <div className="p-6">
                <ChangePasswordForm
                  editMode={passwordEditMode}
                  setEditMode={setPasswordEditMode}
                />
              </div>
            </div>
          ) : (
            <div className="border w-full rounded-md bg-white border-gray-300 p-6">
              <h3 className="text-lg text-customFontColorBlack font-semibold mb-2">
                Security
              </h3>
              <p className="text-sm text-gray-600">
                You signed in with Google. Password is managed through your
                Google account.
              </p>
            </div>
          )}

          <div className="border w-full rounded-md bg-white border-gray-300 p-6">
            <h3 className="text-lg text-customFontColorBlack font-semibold mb-4">
              Notifications
            </h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between gap-4 cursor-pointer">
                <div>
                  <p className="font-medium text-gray-900">Course updates</p>
                  <p className="text-sm text-gray-500">
                    Get notified about new lessons and announcements
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.courseUpdates}
                  onChange={() => handlePrefChange("courseUpdates")}
                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
              <label className="flex items-center justify-between gap-4 cursor-pointer">
                <div>
                  <p className="font-medium text-gray-900">Promotional emails</p>
                  <p className="text-sm text-gray-500">
                    Receive offers and course recommendations
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={prefs.promotionalEmails}
                  onChange={() => handlePrefChange("promotionalEmails")}
                  className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSettingsPage;
