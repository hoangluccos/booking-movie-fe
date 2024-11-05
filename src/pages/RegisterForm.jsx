import React from "react";
import "./RegisterForm.scss";
import {
  FaFacebook,
  FaGoogle,
  FaApple,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { Link } from "react-router-dom";

function RegisterForm() {
  const [showPassword, setShowPassword] = React.useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="register-form-container">
      <div className="background-overlay"></div> {/* Overlay background */}
      <div className="register-form">
        <h2>Create an account</h2>
        <p>
          Already have an account? <Link to="/login">Log in</Link>
        </p>

        <form>
          <div className="form-group">
            <label>What should we call you?</label>
            <input type="text" placeholder="Enter your profile name" />
          </div>

          <div className="form-group">
            <label>What's your email?</label>
            <input type="email" placeholder="Enter your email address" />
          </div>

          <div className="form-group">
            <label>Create a password</label>
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
              />
              <span
                onClick={togglePasswordVisibility}
                className="toggle-password"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <small>
              Use 8 or more characters with a mix of letters, numbers & symbols
            </small>
          </div>

          <p className="terms">
            By creating an account, you agree to the{" "}
            {/* <a href="#">Terms of use</a> and <a href="#">Privacy Policy</a>. */}
          </p>

          <button type="submit" className="btn-create-account">
            Create an account
          </button>
        </form>

        <p className="or">OR Continue with</p>

        <div className="social-buttons">
          <button className="btn-social">
            <FaFacebook /> Facebook
          </button>
          <button className="btn-social">
            <FaGoogle /> Google
          </button>
          <button className="btn-social">
            <FaApple /> Apple
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
