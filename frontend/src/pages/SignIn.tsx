import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import * as apiClient from "../api-client";

export type SignInFormData = {
  email: string;
  password: string;
};

const SignIn: React.FC = () => {
  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<SignInFormData>();

  const mutation = useMutation(apiClient.signIn, {
    onSuccess: async () => {
      showToast({ message: "Sign in Successful!", type: "SUCCESS" });
      await queryClient.invalidateQueries("validateToken");
      navigate(location.state?.from?.pathname || "/");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  // Google Sign-in logic
  const handleGoogleSignIn = () => {
    window.location.href = "https://nhom-32-web.onrender.com/api/loginGoogle";
  };

  // Handle Google callback
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      showToast({ message: "Google Sign-In Successful!", type: "SUCCESS" });
      queryClient.invalidateQueries("validateToken");
      navigate(location.state?.from?.pathname || "/");
    }
  }, [navigate, location.state, queryClient, showToast]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow-lg rounded-md bg-white">
      <h2 className="text-3xl font-bold text-center">Sign In</h2>
      <button
        type="button"
        className="bg-orange-500 text-white py-2 px-4 rounded w-full mt-4 flex items-center justify-center hover:bg-orange-400"
        onClick={handleGoogleSignIn}>
        <img
          src="https://cdn4.iconfinder.com/data/icons/logos-brands-7/512/google_logo-google_icongoogle-512.png"
          alt="Google Logo"
          className="w-6 h-6 mr-2"
        />
        Sign in with Google
      </button>
      <div className="text-center text-gray-500 my-4">or</div>
      <form className="flex flex-col gap-5" onSubmit={onSubmit}>
        <label className="text-gray-700 text-sm font-bold">
          Email
          <input
            type="email"
            className="border rounded w-full py-1 px-2"
            {...register("email", { required: "This field is required" })}
          />
          {errors.email && (
            <span className="text-red-500">{errors.email.message}</span>
          )}
        </label>
        <label className="text-gray-700 text-sm font-bold">
          Password
          <input
            type="password"
            className="border rounded w-full py-1 px-2"
            {...register("password", {
              required: "This field is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          {errors.password && (
            <span className="text-red-500">{errors.password.message}</span>
          )}
        </label>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-500"
        >
          Login
        </button>
      </form>
      <div className="text-center mt-4">
        Not Registered?{" "}
        <Link className="underline text-blue-600" to="/register">
          Create an account here
        </Link>
      </div>
    </div>
  );
};

export default SignIn;