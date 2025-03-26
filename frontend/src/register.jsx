import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import "./styles/Register.css";

function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const navigate = useNavigate();

  // Check password match on every change
  useEffect(() => {
    if (formData.confirmPassword) {
      setPasswordMatch(formData.password === formData.confirmPassword);
    }
  }, [formData.password, formData.confirmPassword]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("emergencyContact.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/register`,
        formData
      );
      console.log("hi");
      if (response.status === 201) {
        console.log("Registration successful");
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration error details:", error.response || error);
      setError(error.response?.data?.message || "Error registering user");
    }
  };

  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="register-header">
          <img
            src="/medicine-icon.svg"
            alt="Medicine Icon"
            className="medicine-icon"
          />
          <h2>Create Account</h2>
          <p>Join MediReminder to manage your medications effectively</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleRegister} className="register-form">
          <div className="form-group">
            <input
              type="text"
              name="fullName"
              placeholder=" "
              value={formData.fullName}
              onChange={handleChange}
              required
            />
            <label>Full Name</label>
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder=" "
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label>Email Address</label>
          </div>

          <div className="form-group">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder=" "
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
            <label>Password</label>
            <button
              type="button"
              className="password-toggle"
              onClick={() => togglePasswordVisibility("password")}
            >
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </button>
          </div>

          <div className="form-group">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder=" "
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength="6"
            />
            <label>Confirm Password</label>
            <button
              type="button"
              className="password-toggle"
              onClick={() => togglePasswordVisibility("confirm")}
            >
              {showConfirmPassword ? (
                <AiOutlineEyeInvisible />
              ) : (
                <AiOutlineEye />
              )}
            </button>
            {formData.confirmPassword && !passwordMatch && (
              <div className="password-match-error">Passwords do not match</div>
            )}
          </div>

          <div className="password-requirements">
            <p>Password must:</p>
            <ul>
              <li className={formData.password.length >= 6 ? "valid" : ""}>
                Be at least 6 characters long
              </li>
            </ul>
          </div>

          <button
            type="submit"
            className="register-button"
            disabled={!passwordMatch || formData.password.length < 6}
          >
            Create Account
          </button>
        </form>

        <div className="login-link">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
