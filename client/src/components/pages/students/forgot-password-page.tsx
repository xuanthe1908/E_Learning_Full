import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { APP_LOGO } from "../../../constants/common";
import { useForgotPasswordMutation } from "../../../redux/api/baseApi";

const forgotPasswordSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

const ForgotPasswordPage: React.FC = () => {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleSubmit = async (values: { email: string }) => {
    try {
      const response = await forgotPassword({
        email: values.email,
        role: "student",
      }).unwrap();
      toast.success(response?.message || "Password reset email sent", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } catch (error: unknown) {
      const message =
        error && typeof error === "object" && "data" in error
          ? String((error as { data?: { message?: string } }).data?.message)
          : "Unable to send reset email";
      toast.error(message, { position: toast.POSITION.BOTTOM_RIGHT });
    }
  };

  return (
    <div className="m-5">
      <div className="mt-16 flex items-center justify-center text-customFontColorBlack">
        <div className="mx-4 w-full max-w-md rounded-lg border bg-white p-8 shadow-xl md:mx-auto md:p-10">
          <img className="mx-auto h-10 w-auto" src={APP_LOGO} alt="TutorTrek" />
          <h2 className="mt-8 text-center text-2xl font-bold text-gray-900">
            Forgot your password?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email and we will send you a reset link.
          </p>

          <Formik
            initialValues={{ email: "" }}
            validationSchema={forgotPasswordSchema}
            onSubmit={handleSubmit}
          >
            <Form className="mt-8 space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                  Email address
                </label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  className="mt-2 block w-full rounded-md border-0 py-1.5 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-700"
                />
                <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-500" />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60"
              >
                {isLoading ? "Sending..." : "Send reset link"}
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

export default ForgotPasswordPage;
