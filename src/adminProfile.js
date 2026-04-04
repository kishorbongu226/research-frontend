import Header from "./Header";
import React, { useEffect, useState } from "react";
import professorService from "./services/professorService";
import { useNavigate, useParams } from "react-router-dom";

const AdminProfile = () => {
  const { registerNo } = useParams();
  const navigate = useNavigate();
  const auth = JSON.parse(sessionStorage.getItem("auth") || "{}");
  const loggedInRegisterNo = auth?.username;
  const professorRegisterNo = registerNo || loggedInRegisterNo;

  const [professor, setProfessor] = useState(null);
  const [ongoingProjects, setOngoingProjects] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  useEffect(() => {
    if (!professorRegisterNo) {
      return;
    }

    fetchProfessor();
    fetchProjects();
  }, [professorRegisterNo]);

  const fetchProfessor = async () => {
    try {
      const response =
        await professorService.getAdminProfessor(professorRegisterNo);
      setProfessor(response.data);
    } catch (error) {
      console.error("Error fetching professor:", error);
    }
  };

  const fetchProjects = async () => {
    try {
      setLoadingProjects(true);
      const response =
        await professorService.getAdminProjects(professorRegisterNo);
      const projects = response.data || [];

      setOngoingProjects(
        projects.filter((project) => project.projectStatus === "ONGOING"),
      );
      setCompletedProjects(
        projects.filter((project) => project.projectStatus === "COMPLETED"),
      );
    } catch (error) {
      console.error("Error fetching professor projects:", error);
    } finally {
      setLoadingProjects(false);
    }
  };

  const resolveImage = (project) =>
    project.imageUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(project.title || "Project")}&background=801033&color=fff`;

  const css = `
    :root {
      --maroon: #801033;
      --bg-light: #f8f9fa;
      --white: #ffffff;
      --gray-text: #555555;
      --light-gray: #e9ecef;
      --progress-bg: #e0e0e0;
      --progress-fill: #3498db;
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

    .sidebar {
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
      align-items: center;
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
      overflow: hidden;
    }

    .profile-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 12px;
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
    }

    .staff-contact-card {
      background: #f7f4f5;
      border: 1px solid #ead7de;
      border-radius: 14px;
      padding: 22px;
      margin-top: 18px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px 28px;
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

    .project-body {
      background: var(--white);
      padding: 25px;
      border-radius: 12px;
      border: 1px solid #ddd;
      margin-bottom: 22px;
      display: flex;
      flex-direction: column;
      box-shadow: 0 3px 12px rgba(0,0,0,0.04);
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .project-body:hover,
    .completed-project-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 22px rgba(0,0,0,0.08);
    }

    .rd-content-wrapper {
      display: flex;
      gap: 20px;
      align-items: flex-start;
    }

    .rd-photo {
      width: 170px;
      height: 115px;
      background-color: #eee;
      border-radius: 8px;
      overflow: hidden;
      flex-shrink: 0;
      border: 1px solid #ddd;
    }

    .rd-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .rd-detail-container {
      flex: 1;
    }

    .rd-details-wrapper {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      gap: 20px;
      margin-bottom: 10px;
    }

    .rd-main-info {
      text-align: left;
      flex: 1;
    }

    .rd-role-info {
      text-align: right;
      flex-shrink: 0;
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
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
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
      overflow: hidden;
    }

    .completed-card-img img {
      width: 100%;
      height: 100%;
      object-fit: cover;
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

    .empty-project-card {
      background: #fff;
      border: 1px dashed #d7b6c1;
      border-radius: 12px;
      padding: 22px;
      color: #666;
      text-align: left;
      margin-bottom: 20px;
    }

    @media (max-width: 900px) {
      .main-layout {
        flex-direction: column;
      }

      .sidebar {
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

      .staff-contact-card {
        grid-template-columns: 1fr;
      }

      .rd-content-wrapper {
        flex-direction: column;
      }

      .rd-details-wrapper {
        flex-direction: column;
      }

      .rd-role-info {
        text-align: left;
      }

      .completed-project-card {
        flex-direction: column;
        align-items: stretch;
      }

      .completed-card-img {
        width: 100%;
        height: 140px;
      }
    }
  `;

  return (
    <div>
      <style>{css}</style>
      <Header />

      <div className="main-layout">
        <div className="container">
          <div className="profile-card">
            <div className="profile-header">
              <div className="avatar-placeholder">
                <img
                  src={
                    professor?.imageURL
                      ? professor.imageURL
                      : `https://ui-avatars.com/api/?name=${professor?.name || "Professor"}&background=801033&color=fff`
                  }
                  alt="Profile"
                  className="profile-image"
                />
              </div>
              <div>
                <h1 className="bio-title">{professor?.name}</h1>
                <p className="bio-text">
                  Leads research initiatives, mentors project teams, and
                  oversees project execution across current and completed work.
                </p>
              </div>
            </div>

            <div className="info-grid">
              <div className="info-item">
                <span className="label">Name:&nbsp;&nbsp;</span>
                <span>{professor?.name}</span>
              </div>

              <div className="info-item">
                <span className="label">Current Projects:&nbsp;&nbsp;</span>
                <span>{ongoingProjects.length}</span>
              </div>
            </div>

            <div className="staff-contact-card">
              <div className="info-item">
                <span className="label">Designation:&nbsp;&nbsp;</span>
                <span>{professor?.designation || professor?.Occupation}</span>
              </div>
              <div className="info-item">
                <span className="label">Personal Email ID:&nbsp;&nbsp;</span>
                <span>{professor?.personalEmail || "-"}</span>
              </div>
              <div className="info-item">
                <span className="label">
                  Highest Qualification:&nbsp;&nbsp;
                </span>
                <span>{professor?.highestQualification || "-"}</span>
              </div>
              <div className="info-item">
                <span className="label">Official Email ID:&nbsp;&nbsp;</span>
                <span>{professor?.officialEmail || "-"}</span>
              </div>
              <div className="info-item">
                <span className="label">Phone Number:&nbsp;&nbsp;</span>
                <span>{professor?.phoneNumber || "-"}</span>
              </div>
            </div>
          </div>

          <h2 className="section-title">Current Projects</h2>

          {loadingProjects ? (
            <div className="empty-project-card">
              Loading current projects...
            </div>
          ) : ongoingProjects.length === 0 ? (
            <div className="empty-project-card">
              No ongoing projects are assigned to this admin yet.
            </div>
          ) : (
            ongoingProjects.map((project) => (
              <div
                key={project.projectId}
                className="project-body"
                onClick={() => navigate(`/project/${project.projectId}`)}
              >
                <div className="rd-content-wrapper">
                  <div className="rd-photo">
                    <img src={resolveImage(project)} alt={project.title} />
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
                          {project.title}
                        </h3>
                        <p
                          style={{
                            color: "var(--maroon)",
                            fontWeight: "600",
                            fontSize: "17px",
                          }}
                        >
                          {project.centerName}
                        </p>
                      </div>
                      <div className="rd-role-info">
                        <div className="role-badge">HEAD</div>
                        <br />
                        <div className="team-badge">
                          {project.projectStatus}
                        </div>
                      </div>
                    </div>
                    <p className="bio-text">
                      {project.description ||
                        "Project description is not available yet."}
                    </p>
                  </div>
                </div>
                <div className="progress-container">
                  <span className="progress-text">Progress: Active</span>
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                </div>
              </div>
            ))
          )}

          <h2 className="section-title" style={{ marginTop: "40px" }}>
            Completed Projects
          </h2>

          {loadingProjects ? (
            <div className="empty-project-card">
              Loading completed projects...
            </div>
          ) : completedProjects.length === 0 ? (
            <div className="empty-project-card">
              No completed projects are available for this admin yet.
            </div>
          ) : (
            completedProjects.map((project) => (
              <div
                key={project.projectId}
                className="completed-project-card"
                onClick={() => navigate(`/project/${project.projectId}`)}
              >
                <div className="completed-card-img">
                  <img src={resolveImage(project)} alt={project.title} />
                </div>
                <div className="completed-card-left">
                  <div>
                    <div style={{ fontWeight: "bold" }}>
                      {project.centerName}
                    </div>
                    <div style={{ fontSize: "13px", color: "#666" }}>
                      {project.title}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#888",
                        marginTop: "4px",
                        fontWeight: "600",
                      }}
                    >
                      Director: {project.directorName}
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
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
