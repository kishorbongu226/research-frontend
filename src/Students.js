import React, { useEffect, useState } from "react";
import Header from "./Header";
import applicationService from "./services/applicationService";
import { useNavigate } from "react-router-dom";

export default function Students() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await applicationService.getApprovedApplications();
        const formatted = (response.data || []).map((app) => ({
          id: app.applicationId,
          name: app.name,
          centerName: app.centerName || "Research Centre",
          registerNo: app.registerNo || "-",
          imageUrl: `https://ui-avatars.com/api/?name=${app.name}&background=7d1935&color=fff&size=200`,
        }));
        setStudents(formatted);
      } catch (err) {
        console.error("Failed to fetch students:", err);
        setError("Unable to load students right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa" }}>
      <style>{`
        .students-shell {
          max-width: 1100px;
          margin: 0 auto;
          padding: 26px 16px 32px;
        }
        .students-title {
          color: #7d1935;
          font-size: 22px;
          font-weight: 800;
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          text-align: left;
        }
        .students-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .student-card {
          background: #fff;
          border-radius: 12px;
          border: 1px solid #eee;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          padding: 14px;
          display: flex;
          gap: 12px;
          align-items: center;
          text-align: left;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .student-card:hover {
          background: #fff6f8;
          transform: translateY(-1px);
        }
        .student-avatar {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
        }
        .student-name {
          font-size: 15px;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 4px;
        }
        .student-meta {
          font-size: 12px;
          color: #6b7280;
          line-height: 1.4;
        }
        .empty-text {
          background: #fff;
          border: 1px dashed #d7b6c1;
          border-radius: 12px;
          padding: 18px;
          color: #666;
          text-align: center;
        }
      `}</style>

      <Header />
      <div className="students-shell">
        <div className="students-title">Students</div>

        {loading ? (
          <div className="empty-text">Loading students...</div>
        ) : error ? (
          <div className="empty-text">{error}</div>
        ) : students.length === 0 ? (
          <div className="empty-text">No students found.</div>
        ) : (
          <div className="students-list">
            {students.map((student) => (
              <div
                className="student-card"
                key={student.id}
                onClick={() => student.registerNo !== "-" && navigate(`/student/${student.registerNo}`)}
              >
                <img
                  src={student.imageUrl}
                  alt={student.name}
                  className="student-avatar"
                />
                <div>
                  <div className="student-name">{student.name}</div>
                  <div className="student-meta">{student.centerName}</div>
                  <div className="student-meta">{student.registerNo}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
