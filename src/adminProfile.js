import prof from "./assets/prof.png";
import person from "./assets/system.jpg";
import system from "./assets/system.jpg";
import Header from "./Header";
import React, { useEffect, useState } from "react";
import professorService from "./services/professorService";
import { useParams } from "react-router-dom";

const AdminProfile = () => {
  const { registerNo } = useParams();

  const auth = JSON.parse(sessionStorage.getItem("auth"));

  const loggedInRegisterNo = auth?.username;

  const studentRegisterNo = registerNo || loggedInRegisterNo;
  const [student, setStudent] = useState(null);

  useEffect(() => {
    if (studentRegisterNo) {
      fetchStudent();
    }
  }, [studentRegisterNo]);

  const fetchStudent = async () => {
    try {
      const response =
        await professorService.getAdminProfessor(studentRegisterNo);
      setStudent(response.data);
    } catch (error) {
      console.error("Error fetching student:", error);
    }
  };
  const css = `
    :root {
      --maroon: #801033;
      --bg-light: #f8f9fa;
      --white: #ffffff;
      --gray-text: #555555;
      --light-gray: #e9ecef;
      --progress-bg: #e0e0e0;
      --progress-fill: #2ecc71;
      --header-purple: #f0e6f2;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: var(--bg-light);
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #333;
      line-height: 1.5;
    }

    .navbar {
      background-color: var(--maroon);
      color: white;
      padding: 12px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .nav-left {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .nav-right {
      display: flex;
      align-items: center;
      gap: 20px;
      font-size: 14px;
      font-weight: 500;
    }

    .nav-link {
      color: white;
      text-decoration: none;
      text-transform: uppercase;
    }

    .main-layout {
      display: flex;
      max-width: 1200px;
      margin: 30px auto;
      padding: 0 20px;
      gap: 30px;
    }

    .container {
      flex: 3;
    }

    .achievements-sidebar {
      flex: 1;
      position: sticky;
      top: 80px;
      height: fit-content;
    }

    .profile-card {
      background: var(--white);
      border-radius: 15px;
      padding: 30px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.05);
      margin-bottom: 30px;
    }

    .profile-header {
      display: flex;
      gap: 30px;
      margin-bottom: 30px;
    }

    .avatar-placeholder {
      width: 160px;
      height: 160px;
      background-color: #ddd;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .profile-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 12px;
      border: none;
    }

    .bio-title {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 10px;
      text-transform: uppercase;
    }

    .bio-text {
      color: var(--gray-text);
      font-size: 15px;
      text-align: left;
    }

    .info-grid {
      background-color: var(--light-gray);
      border-radius: 12px;
      padding: 20px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px 40px;
      font-size: 14px;
    }

    .info-item {
      display: flex;
      justify-content: normal;
    }

    .label {
      font-weight: bold;
    }

    .section-title {
      color: var(--maroon);
      font-size: 20px;
      margin-bottom: 15px;
      font-weight: 600;
      text-align: left;
    }

    .project-header {
      background-color: var(--header-purple);
      padding: 10px 20px;
      border-radius: 8px 8px 0 0;
      font-size: 14px;
      font-weight: 600;
      border: 1px solid #ddd;
      border-bottom: none;
    }

    .project-body {
      background: var(--white);
      padding: 25px;
      border-radius: 0 0 8px 8px;
      border: 1px solid #ddd;
      margin-bottom: 30px;
      display: flex;
      flex-direction: column;
    }

    .rd-content-wrapper {
      display: flex;
      gap: 20px;
      align-items: flex-start;
    }

    .rd-photo {
      width: 160px;
      height: 60px;
      background-color: #eee;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      border: 1px solid #ddd;
    }

    .rd-details-container {
      display: flex;
      flex-grow: 1;
      justify-content: space-between;
      align-items: flex-start;
    }

    .rd-main-info {
      text-align: left;
    }

    .rd-role-info {
      text-align: right;
    }

    .project-name {
      font-size: 22px;
      font-weight: bold;
      margin-bottom: 10px;
    }

    .team-badge {
      display: inline-block;
      margin-top: 8px;
      background-color: #f3f4f6;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
      color: #666;
      border: 1px solid #e5e7eb;
    }

    .role-badge {
      display: inline-block;
      background-color: var(--maroon);
      color: white;
      padding: 6px 14px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: bold;
      text-transform: uppercase;
    }

    .progress-container {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-top: 20px;
    }

    .progress-text {
      font-weight: bold;
      font-size: 16px;
      white-space: nowrap;
    }

    .progress-bar-bg {
      flex-grow: 1;
      height: 12px;
      background-color: var(--progress-bg);
      border-radius: 6px;
      overflow: hidden;
    }

    .progress-bar-fill {
      height: 100%;
      background-color: var(--progress-fill);
    }

    .completed-project-card {
      background: var(--white);
      border-radius: 12px;
      border: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.02);
      overflow: hidden;
      min-height: 100px;
    }

    .completed-card-left {
      display: flex;
      align-items: center;
      gap: 15px;
      padding: 15px 20px;
      flex: 1;
    }

    .completed-card-img {
      width: 100px;
      height: 100px;
      background-color: #f0f0f0;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      border-left: 1px solid #eee;
    }

    .check-icon {
      width: 24px;
      height: 24px;
      background-color: #e8f5e9;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #2e7d32;
      flex-shrink: 0;
      margin-right: 20px;
    }

    .achievement-item {
      display: flex;
      gap: 10px;
      margin-bottom: 15px;
      padding-bottom: 15px;
      border-bottom: 1px solid #eee;
    }

    .medal-icon {
      color: #f1c40f;
      flex-shrink: 0;
    }

    @media (max-width: 900px) {
      .main-layout {
        flex-direction: column;
      }
      .achievements-sidebar {
        position: static;
        order: 2;
      }
    }

    @media (max-width: 600px) {
      .profile-header {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
      .info-grid {
        grid-template-columns: 1fr;
      }
      .rd-content-wrapper {
        flex-direction: column;
        align-items: center;
      }
      .rd-detail-container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        text-align: center;
        width: 100%;
      }
      .rd-main-info, .rd-role-info {
        text-align: center;
      }
      .rd-role-info {
        margin-top: 10px;
      }
      .completed-project-card {
        flex-direction: column;
        align-items: stretch;
      }
      .completed-card-img {
        width: 100%;
        height: 120px;
        border-left: none;
        border-top: 1px solid #eee;
      }
    }

    .rd-details-wrapper{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
  `;

  return (
    <div>
      <style>{css}</style>

      {/* Navbar */}
      <Header />

      <div className="main-layout">
        <div className="container">
          {/* Profile Card */}
          <div className="profile-card">
            <div className="profile-header">
              <div className="avatar-placeholder">
                <img
                  src={
                    student?.imageURL
                      ? student.imageURL
                      : `https://ui-avatars.com/api/?name=${student?.name || "Student"}&background=801033&color=fff`
                  }
                  alt="Profile"
                  className="profile-image"
                />
              </div>
              <div>
                <h1 className="bio-title">{student?.name}</h1>
              </div>
            </div>

            <div className="info-grid">
              <div className="info-item">
                <span className="label">Register No:&nbsp;&nbsp;</span>
                <span>{student?.registerNo}</span>
              </div>

              <div className="info-item">
                <span className="label">Name:&nbsp;&nbsp;</span>
                <span>{student?.name}</span>
              </div>

              <div className="info-item">
                <span className="label">Occupation:&nbsp;&nbsp;</span>
                <span>{student?.Occupation}</span>
              </div>
            </div>
          </div>

          {/* Projects Section */}
          <h2 className="section-title">Current Project</h2>

          {/* Current R&D Box Updated Layout */}
          <div className="project-body">
            <div className="rd-content-wrapper">
              <div className="rd-photo">
                <img
                  src={person}
                  alt="Smart Traffic Management System"
                  style={{
                    width: "100%",
                    height: "60%",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              </div>
              <div className="rd-detail-container">
                <div className="rd-details-wrapper">
                  <div className="rd-main-info">
                    <h3
                      style={{
                        fontSize: "18px",
                        textTransform: "uppercase",
                        fontWeight: "bold",
                      }}
                    >
                      Smart Traffic Management System
                    </h3>
                    <p
                      style={{
                        color: "var(--maroon)",
                        fontWeight: "600",
                        fontSize: "17px",
                      }}
                    >
                      Advanced AI Research Center
                    </p>
                  </div>
                  <div className="rd-role-info">
                    <div className="role-badge">HEAD</div>
                    <br />
                    <div className="team-badge">👥 Team Size: 05</div>
                  </div>
                </div>
                <div>
                  <p className="bio-text">
                    I am a Computer Science Engineering student with a strong
                    interest in technology, web development, and
                    problem-solving. I enjoy learning new tools and technologies
                    and applying them to real-world projects. I am motivated,
                    curious, and always eager to improve my skills through
                    hands-on experience.
                  </p>
                </div>
              </div>
            </div>
            <div className="progress-container" style={{ margin: "20px 0 0" }}>
              <span className="progress-text">Progress: 45%</span>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{ width: "45%", backgroundColor: "#3498db" }}
                ></div>
              </div>
            </div>
          </div>

          {/* Completed Projects Section */}
          <h2 className="section-title" style={{ marginTop: "40px" }}>
            Completed Projects
          </h2>

          {[
            /* eslint-disable */
            {
              center: "NextGen Innovation Hub",
              project: "Automated Library Management System",
              team: "03 Members",
            },
            {
              center: "Centre for Green Technology",
              project: "Solar Powered Water Purification Unit",
              team: "04 Members",
            },
            {
              center: "Robotics Excellence Center",
              project: "Wireless Gesture Controlled Robotic Arm",
              team: "02 Members",
            },
          ].map((item, idx) => (
            <div key={idx} className="completed-project-card">
              <div className="completed-card-img">
                <svg width="30" height="30" fill="#ddd" viewBox="0 0 24 24">
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                </svg>
              </div>
              <div className="completed-card-left">
                <div>
                  <div style={{ fontWeight: "bold" }}>{item.center}</div>
                  <div style={{ fontSize: "13px", color: "#666" }}>
                    {item.project}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#888",
                      marginTop: "4px",
                      fontWeight: "600",
                    }}
                  >
                    👥 Team Size: {item.team}
                  </div>
                </div>
              </div>
              <div className="check-icon">
                <svg
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M5 13l4 4L19 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Achievements Sidebar */}
        <div className="achievements-sidebar">
          <div className="profile-card" style={{ padding: "20px" }}>
            <h2 className="section-title" style={{ fontSize: "18px" }}>
              Achievements
            </h2>

            <div className="achievement-item">
              <div className="medal-icon">🏆</div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                  First Prize
                </div>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  Inter-College Hackathon 2024
                </div>
              </div>
            </div>

            <div className="achievement-item">
              <div className="medal-icon">🥇</div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                  Gold Medalist
                </div>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  Academic Excellence in CSE
                </div>
              </div>
            </div>

            <div className="achievement-item">
              <div className="medal-icon">📜</div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                  Published Paper
                </div>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  International Journal of AI
                </div>
              </div>
            </div>

            <div
              className="achievement-item"
              style={{ border: "none", padding: "0" }}
            >
              <div className="medal-icon">⭐</div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                  Dean's List
                </div>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  Six consecutive semesters
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
