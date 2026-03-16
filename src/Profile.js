import prof from "./assets/prof.png";
import person from "./assets/system.jpg";
import system from "./assets/system.jpg";
import Header from "./Header";
import React, { useEffect, useState } from "react";
import studentService from "./services/studentService";
import projectService from "./services/projectService";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { registerNo } = useParams();

  const auth = JSON.parse(sessionStorage.getItem("auth"));

  const loggedInRegisterNo = auth?.username;

  const studentRegisterNo = registerNo || loggedInRegisterNo;
  const [student, setStudent] = useState(null);
  const [ongoingProjects, setOngoingProjects] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);

  useEffect(() => {
    if (studentRegisterNo) {
      fetchStudent();
      fetchProjects();
    }
  }, [studentRegisterNo]);

  const fetchStudent = async () => {
    try {
      const response = await studentService.getStudent(studentRegisterNo);
      setStudent(response.data);
    } catch (error) {
      console.error("Error fetching student:", error);
    }
  };
  const fetchProjects = async () => {
    try {
      const response =
        await projectService.getProjectsByStudent(studentRegisterNo);
      console.log("Projects API:", response.data);
      const ongoing = response.data.filter(
        (p) => p.projectStatus === "ONGOING",
      );

      const completed = response.data.filter(
        (p) => p.projectStatus === "COMPLETED",
      );

      setOngoingProjects(ongoing);
      setCompletedProjects(completed);
    } catch (error) {
      console.error("Error fetching projects:", error);
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
      width: 100px;
      height: 100px;
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
      text-align:right;
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
        margin-left:auto;
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
                    student?.profileImageUrl
                      ? student.profileImageUrl
                      : `https://ui-avatars.com/api/?name=${student?.name || "Student"}&background=801033&color=fff`
                  }
                  alt="Profile"
                  className="profile-image"
                />
              </div>
              <div>
                <h1 className="bio-title">{student?.name}</h1>
                <p className="bio-text">
                  I am a Computer Science Engineering student with a strong
                  interest in technology, web development, and problem-solving.
                  I enjoy learning new tools and technologies and applying them
                  to real-world projects. I am motivated, curious, and always
                  eager to improve my skills through hands-on experience.
                </p>
              </div>
            </div>

            <div className="info-grid">
              <div className="info-item">
                <span className="label">Branch:&nbsp;&nbsp;</span>
                <span>{student?.branch}</span>
              </div>
              <div className="info-item">
                <span className="label">Email ID:&nbsp;&nbsp;</span>
                <span>{student?.email}</span>
              </div>
              <div className="info-item">
                <span className="label">Year:&nbsp;&nbsp;</span>
                <span>{student?.year}</span>
              </div>
              <div className="info-item">
                <span className="label">Phone Number:&nbsp;&nbsp;</span>
                <span>{student?.phoneNumber}</span>
              </div>
              <div className="info-item">
                <span className="label">Course:&nbsp;&nbsp;</span>
                <span>{student?.course}</span>
              </div>
              <div className="info-item">
                <span className="label">No. of Project:&nbsp;&nbsp;</span>
                <span>{student?.applications?.length || 0}</span>
              </div>
            </div>
          </div>

          {/* Projects Section */}
          <h2 className="section-title">Current Project</h2>

          {ongoingProjects.length === 0 ? (
            <p>No ongoing projects</p>
          ) : (
            ongoingProjects.map((project, index) => (
              <div key={index} className="completed-project-card">
                <div className="rd-content-wrapper">
                  <div className="rd-photo">
                    <img
                      src={project.projectImageUrl}
                      alt={project.projectName}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  </div>

                  <div className="rd-details-container">
                    <div className="rd-main-info">
                      <h3
                        style={{
                          fontSize: "18px",
                          fontWeight: "bold",
                          padding: 10,
                        }}
                      >
                        {project.projectName}
                      </h3>

                      <p
                        style={{
                          color: "var(--maroon)",
                          fontWeight: "600",
                          fontSize: "16px",
                        }}
                      >
                        {project.centerName}
                      </p>
                    </div>

                    <div className="rd-role-info" style={{ padding: 30 }}>
                      <div className="role-badge">Developer</div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Completed Projects Section */}
          <h2 className="section-title" style={{ marginTop: "40px" }}>
            Completed Projects
          </h2>

          {completedProjects.length === 0 ? (
            <p>No completed projects</p>
          ) : (
            completedProjects.map((project, idx) => (
              <div key={idx} className="completed-project-card">
                <div className="completed-card-img">
                  <img
                    src={project.projectImageUrl}
                    alt={project.projectName}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                </div>

                <div className="completed-card-left">
                  <div>
                    <div style={{ fontWeight: "bold" }}>
                      {project.centerName}
                    </div>

                    <div style={{ fontSize: "13px", color: "#666" }}>
                      {project.projectName}
                    </div>
                  </div>
                </div>

                <div className="check-icon">✔</div>
              </div>
            ))
          )}
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

export default Profile;
