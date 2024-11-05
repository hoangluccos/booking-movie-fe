import React from "react";
import "./LoginForm.scss";
import profileImage from "../assets/profile.png";
import facebookIcon from "../assets/facebook.png";
import googleIcon from "../assets/google.png";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });
  const onSubmit = (data) => {
    console.log(data);
  };
  return (
    <div className="bg-image">
      <div className="login-modal container text-center p-4">
        <img src={profileImage} alt="Profile" className="profile-img" />
        <h3 className="mt-2">Log in</h3>
        <p>
          Don't have an account?{" "}
          <Link className="text-dark " to="/register">
            Sign up
          </Link>
        </p>
        <div className="social-login">
          <button className="btn btn-outline-secondary d-flex align-items-center justify-content-center mb-2">
            <img src={facebookIcon} alt="Facebook" className="icon" />
            Log in with Facebook
          </button>
          <button className="btn btn-outline-secondary d-flex align-items-center justify-content-center">
            <img src={googleIcon} alt="Google" className="icon" />
            Log in with Google
          </button>
        </div>
        <div className="divider">
          <span>OR</span>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Your email</label>
            <input
              type="email"
              className="form-control"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-danger">{errors.email.message}</p>
            )}
          </div>
          <div className="form-group">
            <label>Your password</label>
            <div className="password-wrapper">
              <input
                type="password"
                className="form-control"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-danger">{errors.password.message}</p>
              )}
              {/* <span className="password-toggle">Hide</span> */}
            </div>
          </div>
          {/* <a href="#" className="forgot-password">
            Forgot your password
          </a> */}
          <button type="submit" className="btn btn-primary w-100 mt-3">
            Log in
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
