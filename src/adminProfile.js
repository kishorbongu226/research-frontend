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
  const [achievements, setAchievements] = useState([]);
  const [achievementText, setAchievementText] = useState("");
  const [achievementImage, setAchievementImage] = useState("");
  const [showAchievementPopup, setShowAchievementPopup] = useState(false);

  const canEditAchievements = loggedInRegisterNo === professorRegisterNo;
  const achievementsStorageKey = `admin-achievements-${professorRegisterNo || "default"}`;

  useEffect(() => {
    if (!professorRegisterNo) {
      return;
    }

    fetchProfessor();
    fetchProjects();
  }, [professorRegisterNo]);

  useEffect(() => {
    if (!professorRegisterNo) {
      return;
    }
    try {
      const saved = localStorage.getItem(achievementsStorageKey);
      setAchievements(saved ? JSON.parse(saved) : []);
    } catch (error) {
      console.error("Error loading achievements:", error);
      setAchievements([]);
    }
  }, [achievementsStorageKey, professorRegisterNo]);

  const persistAchievements = (items) => {
    setAchievements(items);
    localStorage.setItem(achievementsStorageKey, JSON.stringify(items));
  };

  const handleAchievementImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAchievementImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddAchievement = () => {
    const text = achievementText.trim();
    if (!text || !achievementImage) {
      alert("Please add both achievement text and image.");
      return;
    }
    const item = {
      id: Date.now(),
      text,
      image: achievementImage,
    };
    persistAchievements([item, ...achievements]);
    setAchievementText("");
    setAchievementImage("");
    setShowAchievementPopup(false);
  };

  const handleRemoveAchievement = (id) => {
    persistAchievements(achievements.filter((item) => item.id !== id));
  };

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
      border: 1px solid #ead7de;
      border-radius: 12px;
      padding: 20px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px 40px;
      font-size: 14px;
      background: #fff;
    }

    .info-item {
      display: flex;
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

    .achievements-form {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 16px;
    }

    .achievements-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }

    .edit-achievement-btn {
      border: 1px solid #d7b6c1;
      background: #fff;
      color: var(--maroon);
      width: 34px;
      height: 34px;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .popup-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.45);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }

    .popup-card {
      width: 100%;
      max-width: 420px;
      background: #fff;
      border-radius: 12px;
      padding: 18px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    }

    .popup-title {
      font-size: 18px;
      font-weight: 700;
      color: var(--maroon);
      margin-bottom: 12px;
    }

    .popup-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 8px;
    }

    .popup-cancel-btn {
      border: 1px solid #d7b6c1;
      background: #fff;
      color: #6b3949;
      padding: 10px 14px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
    }

    .achievement-input,
    .achievement-textarea {
      width: 100%;
      border: 1px solid #d9c1cb;
      border-radius: 8px;
      padding: 10px 12px;
      font-size: 14px;
      font-family: inherit;
      outline: none;
      background: #fff;
    }

    .achievement-input:focus,
    .achievement-textarea:focus {
      border-color: var(--maroon);
    }

    .achievement-textarea {
      min-height: 80px;
      resize: vertical;
    }

    .add-achievement-btn {
      background: var(--maroon);
      border: none;
      color: #fff;
      padding: 10px 14px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
    }

    .achievement-item {
      display: flex;
      gap: 10px;
      margin-bottom: 12px;
      padding-bottom: 12px;
      border-bottom: 1px solid #eee;
      align-items: flex-start;
    }

    .achievement-image {
      width: 72px;
      height: 72px;
      border-radius: 8px;
      object-fit: cover;
      border: 1px solid #e4e4e4;
      flex-shrink: 0;
    }

    .achievement-item-content {
      flex: 1;
      text-align: left;
    }

    .achievement-text {
      font-size: 14px;
      color: #333;
      font-weight: 600;
    }

    .remove-achievement-btn {
      margin-top: 8px;
      border: none;
      background: #fce8ec;
      color: #8f1e3f;
      padding: 6px 10px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
    }

    .medal-icon {
      color: #f1c40f;
      flex-shrink: 0;
      font-weight: 700;
      min-width: 22px;
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

        <div className="sidebar">
          <div className="profile-card" style={{ padding: "20px" }}>
            <div className="achievements-header">
              <h2 className="section-title" style={{ fontSize: "18px", marginBottom: 0 }}>
                Achievements
              </h2>
              {canEditAchievements && (
                <button
                  type="button"
                  className="edit-achievement-btn"
                  onClick={() => setShowAchievementPopup(true)}
                  title="Add achievement"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                  </svg>
                </button>
              )}
            </div>

            {achievements.length === 0 ? (
              <p className="bio-text">No achievements added yet.</p>
            ) : (
              achievements.map((item, index) => (
                <div
                  key={item.id}
                  className="achievement-item"
                  style={
                    index === achievements.length - 1
                      ? { border: "none", paddingBottom: 0, marginBottom: 0 }
                      : {}
                  }
                >
                  <div className="medal-icon">{index + 1}.</div>
                  <img
                    src={item.image}
                    alt={`Achievement ${index + 1}`}
                    className="achievement-image"
                  />
                  <div className="achievement-item-content">
                    <div className="achievement-text">{item.text}</div>
                    {canEditAchievements && (
                      <button
                        type="button"
                        className="remove-achievement-btn"
                        onClick={() => handleRemoveAchievement(item.id)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {showAchievementPopup && canEditAchievements && (
        <div
          className="popup-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAchievementPopup(false);
            }
          }}
        >
          <div className="popup-card">
            <div className="popup-title">Add Achievement</div>
            <div className="achievements-form">
              <input
                type="file"
                accept="image/*"
                className="achievement-input"
                onChange={handleAchievementImageChange}
              />
              <textarea
                className="achievement-textarea"
                placeholder="Write achievement details"
                value={achievementText}
                onChange={(e) => setAchievementText(e.target.value)}
              />
            </div>
            <div className="popup-actions">
              <button
                type="button"
                className="popup-cancel-btn"
                onClick={() => setShowAchievementPopup(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="add-achievement-btn"
                onClick={handleAddAchievement}
              >
                Add Achievement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfile;
