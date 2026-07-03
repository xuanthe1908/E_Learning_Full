import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { APP_LOGO } from "../../../constants/common";
import { useResetPasswordMutation } from "../../../redux/api/baseApi";

const resetPasswordSchema = Yup.object({
  newPassword: Yup.string().min(8, "Minimum 8 characters").required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Required"),
});

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleSubmit = async (values: { newPassword: string }) => {
    if (!token) {
      toast.error("Invalid or missing reset token", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }

    try {
      const response = await resetPassword({
        token,
        newPassword: values.newPassword,
      }).unwrap();
      toast.success(response?.message || "Password reset successful", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      navigate("/login");
    } catch (error: unknown) {
      const message =
        error && typeof error === "object" && "data" in error
          ? String((error as { data?: { message?: string } }).data?.message)
          : "Unable to reset password";
      toast.error(message, { position: toast.POSITION.BOTTOM_RIGHT });
    }
  };

  return (
    <div className="m-5">
      <div className="mt-16 flex items-center justify-center text-customFontColorBlack">
        <div className="mx-4 w-full max-w-md rounded-lg border bg-white p-8 shadow-xl md:mx-auto md:p-10">
          <img className="mx-auto h-10 w-auto" src={APP_LOGO} alt="TutorTrek" />
          <h2 className="mt-8 text-center text-2xl font-bold text-gray-900">
            Reset your password
          </h2>

          <Formik
            initialValues={{ newPassword: "", confirmPassword: "" }}
            validationSchema={resetPasswordSchema}
            onSubmit={handleSubmit}
          >
            <Form className="mt-8 space-y-6">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-900">
                  New password
                </label>
                <Field
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  className="mt-2 block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-700"
                />
                <ErrorMessage
                  name="newPassword"
                  component="div"
                  className="mt-1 text-sm text-red-500"
                />
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-900"
                >
                  Confirm password
                </label>
                <Field
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className="mt-2 block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-700"
                />
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="mt-1 text-sm text-red-500"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !token}
                className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
              >
                {isLoading ? "Saving..." : "Reset password"}
              </button>

              <p className="text-center text-sm">
                <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
                  Back to login
                </Link>
              </p>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
