import Header from "./Header";
import React, { useState, useEffect } from "react";
import projectService from "./services/projectService";
const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectService.getAllProjects();

      const formatted = response.data.map((project, index) => ({
        id: project.projectId,
        title: project.title,
        fundingAgency: project.fundingAgency || "N/A",
        pi: project.directorName,
        coPI: "-",
        year: project.year || "N/A",
        status: project.projectStatus,
        course: project.centerName,
      }));

      setProjects(formatted);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  };

  const filteredProjects =
    activeTab === "all"
      ? projects
      : projects.filter((p) => p.status.toLowerCase() === activeTab);

  return (
    <div className="page-container">
      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .page-container {
          background: #f5f5f5;
          min-height: 100vh;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
        }

        .main-wrapper {
          max-width: 1600px;
          margin: 0 auto;
          padding: 30px 40px;
        }

        /* Header Section */
        .page-header {
          background: white;
          padding: 10px 20px;
          margin-bottom: 30px;
          border-left: 6px solid #8b1538;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          text-align: left;
        }

        .page-header h1 {
          color: #8b1538;
          font-size: 24px;
          font-weight: 700;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* Filter Tabs */
        .filter-tabs {
          display: flex;
          gap: 12px;
          margin-bottom: 25px;
          flex-wrap: wrap;
        }

        .filter-tab {
          padding: 10px 24px;
          background: white;
          border: 2px solid #e0e0e0;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          color: #555;
          transition: all 0.3s ease;
        }

        .filter-tab:hover {
          border-color: #8b1538;
          color: #8b1538;
        }

        .filter-tab.active {
          background: linear-gradient(135deg, #8b1538 0%, #a52349 100%);
          color: white;
          border-color: #8b1538;
        }

        /* Table Container */
        .table-container {
          background: white;
          border-radius: 10px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.08);
          overflow: hidden;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        /* Table Styles */
        .projects-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }

        .projects-table thead {
          background: linear-gradient(135deg, #8b1538 0%, #a52349 100%);
        }

        .projects-table thead th {
          color: white;
          font-weight: 700;
          text-align: left;
          padding: 18px 20px;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-right: 1px solid rgba(255,255,255,0.1);
        }

        .projects-table thead th:last-child {
          border-right: none;
        }

        .projects-table tbody tr {
          border-bottom: 1px solid #f0f0f0;
          transition: background-color 0.2s ease;
        }

        .projects-table tbody tr:hover {
          background-color: #fdf3f5;
        }

        .projects-table tbody tr:last-child {
          border-bottom: none;
        }

        .projects-table tbody td {
          padding: 20px;
          color: #333;
          line-height: 1.6;
          vertical-align: top;
        }

        /* Column Specific Styles */
        .col-sno {
          width: 60px;
          text-align: center;
          font-weight: 700;
          color: #8b1538;
        }

        .col-title {
          min-width: 350px;
          max-width: 450px;
          font-weight: 600;
          color: #1a202c;
        }

        .col-funding {
          min-width: 140px;
          color: #555;
        }

        .col-pi {
          min-width: 160px;
          font-weight: 500;
          color: #2c3e50;
        }

        .col-copi {
          min-width: 160px;
          color: #555;
        }

        .col-course {
          min-width: 140px;
          color: #555;
          font-weight: 500;
        }

        .col-year {
          min-width: 100px;
          text-align: center;
          font-weight: 600;
          color: #2c3e50;
        }

        .col-status {
          min-width: 100px;
          text-align: center;
        }

        /* Status Badge */
        .status-badge {
          display: inline-block;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .status-badge.ongoing {
          background: #e3f2fd;
          color: #1976d2;
        }

        .status-badge.completed {
          background: #e8f5e9;
          color: #388e3c;
        }

        /* Empty State */
        .empty-state {
          padding: 60px 20px;
          text-align: center;
          color: #999;
        }

        .empty-state-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .empty-state-text {
          font-size: 16px;
          font-weight: 500;
        }

        /* Project Count */
        .project-count {
          padding: 15px 25px;
          background: #f8f9fa;
          border-top: 1px solid #e0e0e0;
          color: #666;
          font-size: 13px;
          font-weight: 600;
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .main-wrapper {
            padding: 20px 20px;
          }

          .projects-table {
            font-size: 13px;
          }

          .projects-table thead th,
          .projects-table tbody td {
            padding: 14px 16px;
          }
        }

        @media (max-width: 768px) {
          .page-header h1 {
            font-size: 18px;
          }

          .filter-tabs {
            gap: 8px;
          }

          .filter-tab {
            padding: 8px 16px;
            font-size: 12px;
          }

          .main-wrapper {
            padding: 15px 12px;
          }

          .projects-table {
            font-size: 12px;
          }

          .projects-table thead th {
            font-size: 11px;
            padding: 12px 10px;
          }

          .projects-table tbody td {
            padding: 12px 10px;
          }

          .col-title {
            min-width: 250px;
          }

          .status-badge {
            font-size: 10px;
            padding: 5px 12px;
          }
        }

        @media (max-width: 480px) {
          .page-header {
            padding: 15px 20px;
          }

          .page-header h1 {
            font-size: 16px;
          }
        }
      `}</style>

      <Header />

      <div className="main-wrapper">
        {/* Page Header */}
        <div className="page-header">
          <h1>Centres of Academic Excellence</h1>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs">
          <button
            className={`filter-tab ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All Projects ({projects.length})
          </button>
          <button
            className={`filter-tab ${activeTab === "ongoing" ? "active" : ""}`}
            onClick={() => setActiveTab("ongoing")}
          >
            Ongoing ({projects.filter((p) => p.status === "ONGOING").length})
          </button>
          <button
            className={`filter-tab ${activeTab === "completed" ? "active" : ""}`}
            onClick={() => setActiveTab("completed")}
          >
            Completed ({projects.filter((p) => p.status === "Completed").length}
            )
          </button>
        </div>

        {/* Table Container */}
        <div className="table-container">
          <div className="table-wrapper">
            <table className="projects-table">
              <thead>
                <tr>
                  <th className="col-sno">S. No.</th>
                  <th className="col-title">Project Title</th>
                  <th className="col-funding">Funding Agency / Scheme</th>
                  <th className="col-pi">PI</th>
                  <th className="col-copi">Co-PI/Mentor</th>
                  <th className="col-course">Course</th>
                  <th className="col-year">Year(s)</th>
                  <th className="col-status">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project, index) => (
                    <tr key={project.id}>
                      <td className="col-sno">{index + 1}</td>
                      <td className="col-title">{project.title}</td>
                      <td className="col-funding">{project.fundingAgency}</td>
                      <td className="col-pi">{project.pi}</td>
                      <td className="col-copi">{project.coPI || "-"}</td>
                      <td className="col-course">{project.course}</td>
                      <td className="col-year">{project.year}</td>
                      <td className="col-status">
                        <span
                          className={`status-badge ${project.status.toLowerCase()}`}
                        >
                          {project.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8">
                      <div className="empty-state">
                        <div className="empty-state-icon">📋</div>
                        <div className="empty-state-text">
                          No projects found
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Project Count Footer */}
          {filteredProjects.length > 0 && (
            <div className="project-count">
              Showing {filteredProjects.length} project
              {filteredProjects.length !== 1 ? "s" : ""}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Projects;
