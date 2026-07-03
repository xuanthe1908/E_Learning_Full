import { useState } from "react";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { PasswordInfo } from "../../../api/types/student/student";
import { PasswordValidationSchema } from "../../../validations/student";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { changeAdminPassword } from "../../../api/endpoints/admin";

interface Props {
  editMode: boolean;
  setEditMode: (val: boolean) => void;
}

const AdminChangePasswordForm: React.FC<Props> = ({
  editMode,
  setEditMode,
}) => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const handleSubmit = async (passwordInfo: PasswordInfo) => {
    try {
      const response = await changeAdminPassword(passwordInfo);
      if (response?.data?.status === "success") {
        formik.resetForm();
      }
      setEditMode(false);
      toast.success(response?.data?.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } catch (error: any) {
      toast.error(error?.data?.message, {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      repeatPassword: "",
    },
    validationSchema: PasswordValidationSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const togglePasswordVisibility = (field: string) => {
    switch (field) {
      case "currentPassword":
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case "newPassword":
        setShowNewPassword(!showNewPassword);
        break;
      case "repeatPassword":
        setShowRepeatPassword(!showRepeatPassword);
        break;
      default:
        break;
    }
  };

  const getPasswordInputType = (field: string) => {
    switch (field) {
      case "currentPassword":
        return showCurrentPassword ? "text" : "password";
      case "newPassword":
        return showNewPassword ? "text" : "password";
      case "repeatPassword":
        return showRepeatPassword ? "text" : "password";
      default:
        return "password";
    }
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="relative z-0 w-full mb-6 group">
        <input
          type={getPasswordInputType("currentPassword")}
          name="currentPassword"
          id="admin_current_password"
          disabled={!editMode}
          value={formik.values.currentPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer ${
            formik.touched.currentPassword && formik.errors.currentPassword
              ? "border-red-500"
              : ""
          }`}
          placeholder=" "
        />
        {formik.touched.currentPassword && formik.errors.currentPassword && (
          <div className="text-red-500 text-xs mt-1">
            {formik.errors.currentPassword}
          </div>
        )}
        <label
          htmlFor="admin_current_password"
          className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0]"
        >
          Current Password
        </label>
        <button
          type="button"
          className="absolute right-0 top-2/4 transform -translate-y-2/4 mr-2 focus:outline-none"
          onClick={() => togglePasswordVisibility("currentPassword")}
        >
          {showCurrentPassword ? (
            <AiOutlineEyeInvisible className="text-gray-500" />
          ) : (
            <AiOutlineEye className="text-gray-500" />
          )}
        </button>
      </div>

      <div className="relative z-0 w-full mb-6 group">
        <input
          type={getPasswordInputType("newPassword")}
          name="newPassword"
          disabled={!editMode}
          id="admin_new_password"
          value={formik.values.newPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer ${
            formik.touched.newPassword && formik.errors.newPassword
              ? "border-red-500"
              : ""
          }`}
          placeholder=" "
        />
        {formik.touched.newPassword && formik.errors.newPassword && (
          <div className="text-red-500 text-xs mt-1">
            {formik.errors.newPassword}
          </div>
        )}
        <label
          htmlFor="admin_new_password"
          className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0]"
        >
          New Password
        </label>
        <button
          type="button"
          className="absolute right-0 top-2/4 transform -translate-y-2/4 mr-2 focus:outline-none"
          onClick={() => togglePasswordVisibility("newPassword")}
        >
          {showNewPassword ? (
            <AiOutlineEyeInvisible className="text-gray-500" />
          ) : (
            <AiOutlineEye className="text-gray-500" />
          )}
        </button>
      </div>

      <div className="relative z-0 w-full mb-6 group">
        <input
          type={getPasswordInputType("repeatPassword")}
          name="repeatPassword"
          disabled={!editMode}
          id="admin_repeat_password"
          value={formik.values.repeatPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer ${
            formik.touched.repeatPassword && formik.errors.repeatPassword
              ? "border-red-500"
              : ""
          }`}
          placeholder=" "
        />
        {formik.touched.repeatPassword && formik.errors.repeatPassword && (
          <div className="text-red-500 text-xs mt-1">
            {formik.errors.repeatPassword}
          </div>
        )}
        <label
          htmlFor="admin_repeat_password"
          className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0]"
        >
          Confirm password
        </label>
        <button
          type="button"
          className="absolute right-0 top-2/4 transform -translate-y-2/4 mr-2 focus:outline-none"
          onClick={() => togglePasswordVisibility("repeatPassword")}
        >
          {showRepeatPassword ? (
            <AiOutlineEyeInvisible className="text-gray-500" />
          ) : (
            <AiOutlineEye className="text-gray-500" />
          )}
        </button>
      </div>

      <div className="relative pt-14 pr-1">
        {editMode && (
          <button
            type="submit"
            className="text-white absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            Update password
          </button>
        )}
      </div>
    </form>
  );
};

export default AdminChangePasswordForm;
