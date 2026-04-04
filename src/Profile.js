import Header from "./Header";
import React, { useEffect, useMemo, useState } from "react";
import studentService from "./services/studentService";
import projectService from "./services/projectService";
import { useNavigate, useParams } from "react-router-dom";

const defaultDescription =
  "Add a short profile summary so faculty and teammates can understand your interests, strengths, and goals.";

const Profile = () => {
  const { registerNo } = useParams();
  const navigate = useNavigate();
  const auth = JSON.parse(sessionStorage.getItem("auth") || "{}");
  const loggedInRegisterNo = auth?.username;
  const studentRegisterNo = registerNo || loggedInRegisterNo;
  const canEditProfile = studentRegisterNo === loggedInRegisterNo;

  const [student, setStudent] = useState(null);
  const [ongoingProjects, setOngoingProjects] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    profileDescription: "",
    achievements: "",
  });

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
      setProfileForm({
        profileDescription: response.data.profileDescription || "",
        achievements: response.data.achievements || "",
      });
    } catch (error) {
      console.error("Error fetching student:", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response =
        await projectService.getProjectsByStudent(studentRegisterNo);
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

  const handleSaveProfile = async () => {
    try {
      setIsSavingProfile(true);
      const response = await studentService.updateStudentProfile(
        studentRegisterNo,
        profileForm,
      );
      setStudent(response.data);
      setProfileForm({
        profileDescription: response.data.profileDescription || "",
        achievements: response.data.achievements || "",
      });
      setIsEditingProfile(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to save profile details");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const achievementItems = useMemo(() => {
    const raw = student?.achievements || "";
    return raw
      .split(/\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean);
  }, [student?.achievements]);

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
      white-space: pre-wrap;
    }

    .profile-actions {
      display: flex;
      gap: 12px;
      margin-top: 16px;
      flex-wrap: wrap;
    }

    .primary-btn,
    .secondary-btn {
      border: none;
      border-radius: 10px;
      padding: 10px 16px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
    }

    .primary-btn {
      background: var(--maroon);
      color: white;
    }

    .secondary-btn {
      background: #edf1f6;
      color: #334155;
    }

    .edit-block {
      margin-top: 18px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .edit-label {
      color: var(--maroon);
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-bottom: 6px;
    }

    .edit-textarea {
      width: 100%;
      min-height: 110px;
      padding: 14px;
      border-radius: 12px;
      border: 1px solid #d6dbe3;
      font: inherit;
      resize: vertical;
    }

    .helper-text {
      font-size: 12px;
      color: #6b7280;
      margin-top: 6px;
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
      padding: 0 18px;
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .completed-project-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 18px rgba(0,0,0,0.08);
    }

    .rd-content-wrapper {
      display: flex;
      gap: 20px;
      align-items: flex-start;
      width: 100%;
      padding: 18px 0;
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
      overflow: hidden;
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
      overflow: hidden;
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
      font-weight: 700;
      min-width: 20px;
    }

    .empty-text {
      color: #6b7280;
      font-size: 14px;
      line-height: 1.6;
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
      .rd-details-container {
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
                  {student?.profileDescription || defaultDescription}
                </p>

                {canEditProfile && !isEditingProfile && (
                  <div className="profile-actions">
                    <button
                      className="primary-btn"
                      onClick={() => setIsEditingProfile(true)}
                    >
                      Edit Description & Achievements
                    </button>
                  </div>
                )}
              </div>
            </div>

            {canEditProfile && isEditingProfile && (
              <div className="edit-block">
                <div>
                  <div className="edit-label">Profile Description</div>
                  <textarea
                    className="edit-textarea"
                    value={profileForm.profileDescription}
                    onChange={(e) =>
                      setProfileForm((prev) => ({
                        ...prev,
                        profileDescription: e.target.value,
                      }))
                    }
                    placeholder="Write a short introduction about yourself"
                  />
                </div>

                <div>
                  <div className="edit-label">Achievements</div>
                  <textarea
                    className="edit-textarea"
                    value={profileForm.achievements}
                    onChange={(e) =>
                      setProfileForm((prev) => ({
                        ...prev,
                        achievements: e.target.value,
                      }))
                    }
                    placeholder="Add one achievement per line"
                  />
                  <div className="helper-text">
                    Enter each achievement on a new line.
                  </div>
                </div>

                <div className="profile-actions">
                  <button
                    className="primary-btn"
                    onClick={handleSaveProfile}
                    disabled={isSavingProfile}
                  >
                    {isSavingProfile ? "Saving..." : "Save Profile"}
                  </button>
                  <button
                    className="secondary-btn"
                    onClick={() => {
                      setProfileForm({
                        profileDescription: student?.profileDescription || "",
                        achievements: student?.achievements || "",
                      });
                      setIsEditingProfile(false);
                    }}
                    disabled={isSavingProfile}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

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
                <span>{student?.applicationCount || 0}</span>
              </div>
            </div>
          </div>

          <h2 className="section-title">Current Project</h2>

          {ongoingProjects.length === 0 ? (
            <p className="empty-text">No ongoing projects</p>
          ) : (
            ongoingProjects.map((project, index) => (
              <div
                key={index}
                className="completed-project-card"
                onClick={() => navigate(`/project/${project.projectId}`)}
              >
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

          <h2 className="section-title" style={{ marginTop: "40px" }}>
            Completed Projects
          </h2>

          {completedProjects.length === 0 ? (
            <p className="empty-text">No completed projects</p>
          ) : (
            completedProjects.map((project, idx) => (
              <div
                key={idx}
                className="completed-project-card"
                onClick={() => navigate(`/project/${project.projectId}`)}
              >
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

                <div className="check-icon">OK</div>
              </div>
            ))
          )}
        </div>

        <div className="achievements-sidebar">
          <div className="profile-card" style={{ padding: "20px" }}>
            <h2 className="section-title" style={{ fontSize: "18px" }}>
              Achievements
            </h2>

            {achievementItems.length === 0 ? (
              <p className="empty-text">
                {canEditProfile
                  ? "Add your achievements from the edit button in your profile section."
                  : "No achievements added yet."}
              </p>
            ) : (
              achievementItems.map((achievement, index) => (
                <div
                  key={`${achievement}-${index}`}
                  className="achievement-item"
                  style={
                    index === achievementItems.length - 1
                      ? { border: "none", paddingBottom: 0, marginBottom: 0 }
                      : {}
                  }
                >
                  <div className="medal-icon">{index + 1}.</div>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                      {achievement}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
