import "../app/App.css";
import logo from "../assets/logo.png";
import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export default function CreateAccountDetailsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const identifierFromSignup = location.state?.email || ""; // can be email or phone

  const isEmailSignup = identifierFromSignup.includes("@");

  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(isEmailSignup ? identifierFromSignup : "");
  const [phone, setPhone] = useState(!isEmailSignup ? identifierFromSignup : "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [hint, setHint] = useState("");

  const togglePassword = () => setShowPassword(!showPassword);

  const isPasswordValid =
    password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password);

  const checkAvailability = async (field, value) => {
    if (!value) return;
    try {
      const res = await axios.post("http://localhost:8080/api/auth/check-user", {
        email: value,
      });
      if (res.status === 200) {
        setHint("✅ Available");
      }
    } catch (err) {
      setHint("❌ Already exists");
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    setError("");
    setSuccess("");
    setHint("");

    try {
      await axios.post("http://localhost:8080/api/users/register", {
        name: fullName,
        email,
        phone,
        password,
      });

      setSuccess("Account created successfully!");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <Header />
        <h2 style={titleStyle}>Set up your account</h2>

        {/* Email or Phone (read-only) */}
        {isEmailSignup ? (
          <>
            <label style={labelStyle}>Email Address</label>
            <input
              type="email"
              value={email}
              readOnly
              style={{
                ...inputStyle,
                backgroundColor: "#1e2329",
                color: "#888",
                cursor: "not-allowed",
              }}
            />
          </>
        ) : (
          <>
            <label style={labelStyle}>Phone Number</label>
            <input
              type="text"
              value={phone}
              readOnly
              style={{
                ...inputStyle,
                backgroundColor: "#1e2329",
                color: "#888",
                cursor: "not-allowed",
              }}
            />
          </>
        )}

        {/* Full Name */}
        <label style={labelStyle}>Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Enter your full name"
          style={inputStyle}
        />

        {/* Editable field: phone or email */}
        {!isEmailSignup ? (
          <>
            <label style={{ ...labelStyle, marginTop: "18px" }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => checkAvailability("email", email)}
              placeholder="Enter your email"
              style={inputStyle}
            />
          </>
        ) : (
          <>
            <label style={{ ...labelStyle, marginTop: "18px" }}>Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onBlur={() => {
                if (phone.length === 10) checkAvailability("phone", phone);
              }}
              placeholder="Enter phone number"
              style={inputStyle}
            />
          </>
        )}

        {/* Hint below */}
        {hint && <div style={{ fontSize: "12px", color: hint.startsWith("✅") ? "green" : "red", marginBottom: "10px" }}>{hint}</div>}

        {/* Password */}
        <label style={{ ...labelStyle, marginTop: "18px" }}>Password</label>
        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            style={{
              ...inputStyle,
              paddingRight: "40px",
              borderColor: isPasswordValid ? "#3fb68b" : "#2b3139",
            }}
          />
          <span
            onClick={togglePassword}
            style={{
              position: "absolute",
              top: "50%",
              right: "12px",
              transform: "translateY(-50%)",
              cursor: "pointer",
              fontSize: "14px",
              color: "#888",
            }}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        {/* Password Hints */}
        <ul style={hintStyle}>
          <li>8 to 128 characters</li>
          <li>At least 1 number</li>
          <li>At least 1 uppercase letter</li>
        </ul>

        {error && <p style={{ color: "red", fontSize: "13px" }}>{error}</p>}
        {success && <p style={{ color: "green", fontSize: "13px" }}>{success}</p>}

        <button type="submit" style={submitButtonStyle}>
          Sign Up
        </button>
      </form>
    </div>
  );
}

const Header = () => (
  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "32px" }}>
    <img src={logo} alt="logo" style={{ height: "28px" }} />
    <span style={{ color: "#fcd535", fontWeight: "bold", fontSize: "20px" }}>CHAIN SIREN</span>
  </div>
);

// Styles
const containerStyle = {
  backgroundColor: "#0b0e11",
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontFamily: "sans-serif",
  padding: "16px",
};

const formStyle = {
  backgroundColor: "#181a20",
  padding: "48px 32px",
  borderRadius: "24px",
  width: "380px",
  minHeight: "560px",
  color: "#fff",
  boxShadow: "0 0 0 1px #2b3139",
};

const titleStyle = {
  fontSize: "24px",
  fontWeight: "600",
  marginBottom: "28px",
};

const labelStyle = {
  fontSize: "13px",
  color: "#aaa",
  marginBottom: "6px",
  display: "block",
};

const inputStyle = {
  height: "44px",
  width: "100%",
  borderRadius: "10px",
  border: "1px solid #2b3139",
  backgroundColor: "#0b0e11",
  color: "#fff",
  padding: "10px 14px",
  fontSize: "14px",
  boxSizing: "border-box",
  marginBottom: "4px",
};

const hintStyle = {
  fontSize: "13px",
  color: "#aaa",
  marginTop: "12px",
  marginBottom: "20px",
  paddingLeft: "18px",
};

const submitButtonStyle = {
  width: "100%",
  backgroundColor: "#fcd535",
  color: "#000",
  fontWeight: "600",
  borderRadius: "10px",
  padding: "14px 0",
  fontSize: "16px",
  border: "none",
  cursor: "pointer",
};
