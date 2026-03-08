import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import bgImage from "./college-bg.jpg";
import collegeLogo from "./college-logo.png";
import { useDispatch } from "react-redux";
import { User } from "./Redux/Action";

function Loginpage() {
  const [userID, setUserID] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!userID || !password || !role) {
      setError("⚠️ All fields are required.");
      return;
    }

    try {
      // Create Basic Auth header
      const basicAuth = "Basic " + btoa(`${userID}:${password}`);

      // Test login by hitting a protected endpoint
      const response = await axios.get(
        "http://59.145.65.84:3000/api/v1.0/centers", // any protected endpoint
        {
          headers: { Authorization: basicAuth },
          validateStatus: () => true,
        },
      );

      if (response.status === 200) {
        setMessage("✅ Login successful! Redirecting...");

        // Save credentials safely in sessionStorage
        sessionStorage.setItem(
          "auth",
          JSON.stringify({ username: userID, basicAuth, role }),
        );

        // Optionally store in Redux (without password) for UI
        dispatch(
          User({
            name: userID,
            dept: role,
            position: role,
          }),
        );

        // Redirect based on role
        setTimeout(() => {
          switch (role) {
            case "Admin":
              navigate("/dashboard");
              break;

            default:
              navigate("/dashboard");
          }
        }, 500);
      } else if (response.status === 401) {
        setError("⚠️ Invalid username or password.");
      } else if (response.status === 403) {
        setError("⚠️ You are not allowed to login with this account.");
      } else {
        setError(`⚠️ Login failed with status: ${response.status}`);
      }
    } catch (err) {
      console.error(err);
      setError("⚠️ Server error. Please try again later.");
    }
  };

  return (
    <div
      className="main-container"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="overlay"></div>

      <div className="login-box">
        <div className="college-banner">
          <img src={collegeLogo} alt="College Logo" className="college-logo" />
          <div className="college-text">
            <h1 className="college-title">SATHYABAMA</h1>
            <hr className="title-underline" />
            <h2 className="college-subtitle">
              INSTITUTE OF SCIENCE AND TECHNOLOGY
            </h2>
            <p className="college-desc">(DEEMED TO BE UNIVERSITY)</p>
            <p className="college-category">CATEGORY - 1 UNIVERSITY BY UGC</p>
          </div>
        </div>

        <h2 className="form-title">Management System</h2>

        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Role</label>
            <select
              className="input-field"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="">Select Role</option>

              <option value="Admin">Admin</option>

              <option value="End-User">Student</option>
            </select>
          </div>

          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              className="input-field"
              placeholder="Enter your username"
              value={userID}
              onChange={(e) => setUserID(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            LOG IN
          </button>
        </form>
      </div>
    </div>
  );
}

export default Loginpage;
