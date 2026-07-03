import React, { useMemo, useState } from "react";
import { FiEdit } from "react-icons/fi";
import AdminChangePasswordForm from "./admin-change-password-form";
import CustomBreadCrumbs from "../../common/bread-crumbs";
import decodeJwtToken from "../../../utils/decode";
const ADMIN_SETTINGS_KEY = "admin_platform_settings";

type AdminSettings = {
  emailNotifications: boolean;
};

const defaultSettings: AdminSettings = {
  emailNotifications: true,
};
const loadSettings = (): AdminSettings => {
  try {
    const stored = localStorage.getItem(ADMIN_SETTINGS_KEY);
    return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
  } catch {
    return defaultSettings;
  }
};

const AdminSettingsPage: React.FC = () => {
  const [passwordEditMode, setPasswordEditMode] = useState(false);
  const [settings, setSettings] = useState<AdminSettings>(loadSettings);
  const adminEmail = useMemo(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return "—";
    try {
      const parsed = JSON.parse(token);
      const accessToken = parsed?.accessToken ?? token;
      return decodeJwtToken(accessToken)?.payload?.email ?? "—";
    } catch {
      return decodeJwtToken(token)?.payload?.email ?? "—";
    }
  }, []);

  const handleSettingChange = (key: keyof AdminSettings) => {
    setSettings((prev) => {
      const updated = { ...prev, [key]: !prev[key] };
      localStorage.setItem(ADMIN_SETTINGS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return (    <div className="pr-5 pb-10">
      <CustomBreadCrumbs paths="/admin/settings" />
      <div className="pt-5 pb-6">
        <h2 className="text-3xl font-semibold text-gray-900">Settings</h2>
        <p className="text-gray-500 mt-1">
          Manage admin account and platform preferences
        </p>
      </div>

      <div className="flex flex-col gap-6 max-w-3xl">
        <div className="border w-full rounded-md bg-white border-gray-300 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account</h3>
          <div className="text-sm">
            <span className="text-gray-500">Signed in as</span>
            <p className="font-medium text-gray-900">{adminEmail}</p>
          </div>
        </div>

        <div className="border w-full rounded-md bg-white border-gray-300">
          <div className="flex justify-between items-center">
            <h3 className="pl-5 pt-5 text-lg font-semibold text-gray-900">
              Security — Change password
            </h3>
            <button
              className="p-5"
              type="button"
              onClick={() => setPasswordEditMode(true)}
            >
              <FiEdit className="text-gray-800 text-lg" />
            </button>
          </div>
          <div className="p-6 max-w-xl">
            <AdminChangePasswordForm
              editMode={passwordEditMode}
              setEditMode={setPasswordEditMode}
            />
          </div>
        </div>

        <div className="border w-full rounded-md bg-white border-gray-300 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Platform preferences
          </h3>
          <div className="space-y-4">
            <label className="flex items-center justify-between gap-4 cursor-pointer">
              <div>
                <p className="font-medium text-gray-900">Email notifications</p>
                <p className="text-sm text-gray-500">
                  Send system alerts to admin email
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={() => handleSettingChange("emailNotifications")}
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </label>
          </div>        </div>
      </div>
    </div>
  );
};
export default AdminSettingsPage;
