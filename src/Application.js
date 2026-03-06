import React, { useState, useEffect } from "react";
import Header from "./Header";
import applicationService from "./services/applicationService";

// Main App Component
export default function App() {
  const [applications, setApplications] = useState([]);

  const [approvedList, setApprovedList] = useState([]);
   // later replace with Redux

  const fetchApprovedApplications = async () => {
    try {
      const response =
        await applicationService.getApprovedApplications();

      const formatted = response.data.map((app) => ({
        id: app.applicationId,
        studentName: app.name,
        centreName: app.centerName,
        imageUrl: `https://ui-avatars.com/api/?name=${app.name}&background=7d1935&color=fff&size=200`,
      }));

      setApprovedList(formatted);
    } catch (error) {
      console.error("Failed to fetch approved:", error);
    }
  };

  // Toggle expansion of application bar
  const toggleExpand = (id) => {
    setApplications((apps) =>
      apps.map((app) =>
        app.id === id ? { ...app, expanded: !app.expanded } : app,
      ),
    );
  };

  const fetchPendingApplications = async () => {
    try {
      // 🔥 Replace with logged-in professor id

      const response =
        await applicationService.getPendingApplications();

      const formattedData = response.data.map((app) => ({
        id: app.applicationId, // must be DB id
        studentName: app.name,
        registerNumber: app.registerNo,
        email: app.email,
        phone: app.phoneNumber,
        branch: app.branch,
        course: app.course,
        year: app.year,
        graduation: app.graduation,
        centreName: app.centerName,
        projectName: app.projectName,
        imageUrl: `https://ui-avatars.com/api/?name=${app.name}&background=7d1935&color=fff&size=200`,
        status: app.status,
        expanded: false,
      }));

      setApplications(formattedData);
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    }
  };

  useEffect(() => {
    fetchPendingApplications();
    fetchApprovedApplications();
  }, []);
  // Handle Approval
  const handleApprove = async (e, id) => {
    e.stopPropagation();

    try {
      await applicationService.approveApplication(id);

      // Refresh from DB
      await fetchPendingApplications();
      await fetchApprovedApplications();
    } catch (error) {
      console.error("Approval failed:", error);
      alert("Failed to approve application");
    }
  };

  // Handle Disapproval
  const handleDisapprove = async (e, id) => {
    e.stopPropagation();

    try {
      const professorId = 2; // 🔥 Replace with logged-in professor id

      await applicationService.declineApplication(id, professorId);
    } catch (error) {
      console.error("Decline failed:", error);
      alert("Failed to reject application");
    }
  };

  return (
    <div className="container">
      <style>{`
        body {
          margin: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background-color: #f8f9fa;
          color: #333;
        }

        /* Header Styling matching image */
        header {
          background-color: #7d1935;
          color: white;
          padding: 10px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .logo-placeholder {
          background: white;
          border-radius: 4px;
          padding: 5px;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: #7d1935;
          font-size: 10px;
          text-align: center;
        }

        .university-name {
          line-height: 1.2;
        }

        .university-name h1 {
          margin: 0;
          font-size: 1.2rem;
          letter-spacing: 1px;
        }

        .university-name p {
          margin: 0;
          font-size: 0.7rem;
          text-transform: uppercase;
        }

        nav a {
          color: white;
          text-decoration: none;
          margin-left: 20px;
          font-size: 0.9rem;
          font-weight: 500;
        }

        /* Main Content Layout */
        .main-layout {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 30px;
          padding: 40px;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* Left Section: Applications */
        .applications-section h2 {
          color: #7d1935;
          font-size: 1.1rem;
          text-transform: uppercase;
          border-bottom: 2px solid #eee;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }

        .app-item {
          background: white;
          border-radius: 8px;
          margin-bottom: 15px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          overflow: hidden;
          border: 1px solid #e0e0e0;
        }

        .app-bar {
          padding: 15px 25px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          transition: background 0.2s;
        }

        .app-bar:hover {
          background-color: #fcfcfc;
        }

        .app-bar-info {
          display: flex;
          flex-direction: column;
          gap: 4px;
          text-align: left;
        }

        .centre-label {
          color: #7d1935;
          font-weight: 700;
          font-size: 1rem;
        }

        .student-sub-label {
          font-size: 0.85rem;
          color: #666;
        }

        .action-group {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.85rem;
          transition: 0.2s;
        }

        .btn-approve {
          background-color: #28a745;
          color: white;
        }

        .btn-approve:hover {
          background-color: #218838;
        }

        .btn-disapprove {
          background-color: #dc3545;
          color: white;
        }

        .btn-disapprove:hover {
          background-color: #c82333;
        }

        .chevron {
          width: 20px;
          height: 20px;
          transition: transform 0.3s;
        }

        .chevron.down {
          transform: rotate(180deg);
        }

        /* Dropdown Detail Content */
        .app-details {
          padding: 25px;
          border-top: 1px solid #eee;
          background: #fafafa;
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 30px;
        }

        .student-card {
          text-align: center;
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }

        .student-avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: 3px solid #7d1935;
          margin-bottom: 15px;
        }

        .view-profile-link {
          color: #007bff;
          text-decoration: none;
          font-size: 0.85rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
        }

        .details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .info-field label {
          display: block;
          font-size: 0.75rem;
          color: #888;
          text-transform: uppercase;
          margin-bottom: 4px;
          text-align: left;
        }

        .info-field p {
          margin: 0;
          font-weight: 500;
          font-size: 0.95rem;
          text-align: left;
        }

        .resume-attachment {
          margin-top: 20px;
          grid-column: span 2;
          padding: 15px;
          background: white;
          border: 1px dashed #7d1935;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .pdf-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .pdf-icon { color: #dc3545; font-size: 1.5rem; }

        .download-btn {
          background: none;
          border: 1px solid #7d1935;
          color: #7d1935;
          padding: 6px 12px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-weight: 600;
        }

        /* Sidebar: Approved Students */
        .sidebar {
          background: white;
          border-radius: 12px;
          padding: 25px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          height: fit-content;
        }

        .sidebar h3 {
          margin-top: 0;
          color: #7d1935;
          font-size: 0.9rem;
          text-transform: uppercase;
          margin-bottom: 20px;
          letter-spacing: 0.5px;
        }

        .approved-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .approved-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #eee;
        }

        .approved-info h4 {
          margin: 0;
          font-size: 0.9rem;
          color: #333;
        }

        .approved-info p {
          margin: 0;
          font-size: 0.75rem;
          color: #888;
        }

        .empty-state {
          text-align: center;
          color: #999;
          font-size: 0.85rem;
          padding: 20px;
        }

        /* Utility Icons (SVG) */
        .icon { width: 16px; height: 16px; fill: currentColor; }
      `}</style>

      <Header />

      <div className="main-layout">
        {/* Applications List */}
        <section className="applications-section">
          <h2>Project Applications</h2>

          {applications.length === 0 ? (
            <div className="empty-state">No pending applications found.</div>
          ) : (
            applications.map((app) => (
              <div className="app-item" key={app.id}>
                <div className="app-bar" onClick={() => toggleExpand(app.id)}>
                  <div className="app-bar-info">
                    <span className="centre-label">{app.centreName}</span>
                    <span className="student-sub-label">
                      Submitted by: {app.studentName} ({app.registerNumber})
                    </span>
                  </div>

                  <div className="action-group">
                    <button
                      className="btn btn-approve"
                      onClick={(e) => handleApprove(e, app.id)}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-disapprove"
                      onClick={(e) => handleDisapprove(e, app.id)}
                    >
                      Reject
                    </button>
                    <svg
                      className={`chevron ${app.expanded ? "down" : ""}`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#777"
                      strokeWidth="2"
                    >
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {app.expanded && (
                  <div className="app-details">
                    <div className="left-profile">
                      <div className="student-card">
                        <img
                          src={app.imageUrl}
                          alt="student"
                          className="student-avatar"
                        />
                        <a href="#" className="view-profile-link">
                          View Profile
                          <svg
                            className="icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M9 18l6-6-6-6" />
                          </svg>
                        </a>
                      </div>
                    </div>

                    <div className="right-details">
                      <div className="details-grid">
                        <div className="info-field">
                          <label>Full Name</label>
                          <p>{app.studentName}</p>
                        </div>
                        <div className="info-field">
                          <label>Register Number</label>
                          <p>{app.registerNumber}</p>
                        </div>
                        <div className="info-field">
                          <label>Email Address</label>
                          <p>{app.email}</p>
                        </div>
                        <div className="info-field">
                          <label>Contact</label>
                          <p>{app.phone}</p>
                        </div>
                        <div className="info-field">
                          <label>Department / Branch</label>
                          <p>{app.branch}</p>
                        </div>
                        <div className="info-field">
                          <label>Course & Year</label>
                          <p>
                            {app.course} - {app.year}
                          </p>
                        </div>
                      </div>

                      <div className="resume-attachment">
                        <div className="pdf-info">
                          <span className="pdf-icon">📄</span>
                          <div>
                            <p
                              style={{
                                margin: 0,
                                fontWeight: 600,
                                fontSize: "0.9rem",
                              }}
                            >
                              Student_Resume_{app.registerNumber}.pdf
                            </p>
                            <span
                              style={{ fontSize: "0.75rem", color: "#888" }}
                            >
                              PDF Document • 1.2 MB
                            </span>
                          </div>
                        </div>
                        <button className="download-btn">
                          <svg
                            className="icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4m7-7h6m-6 0l6 6m-6-6v6" />
                          </svg>
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </section>

        {/* Sidebar: Approved List */}
        <aside className="sidebar">
          <h3>Recent Approved Students</h3>
          {approvedList.length === 0 ? (
            <p className="empty-state">No approvals in this session.</p>
          ) : (
            approvedList.map((approved) => (
              <div className="approved-card" key={approved.id}>
                <img
                  src={approved.imageUrl}
                  alt="approved"
                  className="approved-avatar"
                />
                <div className="approved-info">
                  <h4>{approved.studentName}</h4>
                  <p>{approved.centreName}</p>
                </div>
              </div>
            ))
          )}
        </aside>
      </div>
    </div>
  );
}
