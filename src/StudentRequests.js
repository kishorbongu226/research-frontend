import React, { useEffect, useMemo, useState } from "react";
import Header from "./Header";
import applicationService from "./services/applicationService";

const SEEN_APPROVALS_KEY = "seenApprovalNotifications";

const formatLocalIsoDate = (date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDisplayDate = (dateValue) => {
  if (!dateValue) {
    return "Not scheduled";
  }

  const parsedDate = new Date(`${dateValue}T00:00:00`);
  return parsedDate.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const StudentRequests = () => {
  const auth = JSON.parse(sessionStorage.getItem("auth") || "{}");
  const registerNo = auth?.username;
  const isStudent = auth?.role === "End-User";

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      if (!registerNo || !isStudent) {
        setLoading(false);
        return;
      }

      try {
        const response = await applicationService.getStudentApplications(
          registerNo,
        );
        setApplications(response.data || []);
      } catch (err) {
        console.error("Failed to fetch student applications:", err);
        setError("Unable to load your request status right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [isStudent, registerNo]);

  const todayIso = useMemo(() => formatLocalIsoDate(new Date()), []);

  const visibleApplications = useMemo(() => {
    return applications.filter((application) => {
      if (application.status !== "APPROVED") {
        return true;
      }

      if (!application.slotDate) {
        return true;
      }

      return application.slotDate >= todayIso;
    });
  }, [applications, todayIso]);

  useEffect(() => {
    const approvedIds = visibleApplications
      .filter(
        (application) =>
          application.status === "APPROVED" &&
          application.slotDate &&
          application.slotDate >= todayIso,
      )
      .map((application) => application.applicationId);

    const existing = JSON.parse(
      localStorage.getItem(SEEN_APPROVALS_KEY) || "[]",
    );
    const merged = Array.from(new Set([...existing, ...approvedIds]));
    localStorage.setItem(SEEN_APPROVALS_KEY, JSON.stringify(merged));
    window.dispatchEvent(new Event("approvalNotificationsUpdated"));
  }, [todayIso, visibleApplications]);

  const statusStyles = {
    APPROVED: {
      label: "Approved",
      chipClass: "approved",
      cardClass: "approved-card",
    },
    REJECTED: {
      label: "Declined",
      chipClass: "rejected",
      cardClass: "rejected-card",
    },
    PENDING: {
      label: "Pending",
      chipClass: "pending",
      cardClass: "pending-card",
    },
  };

  return (
    <div className="student-requests-page">
      <style>{`
        .student-requests-page {
          min-height: 100vh;
          background: linear-gradient(180deg, #f8f1f3 0%, #f4f6fb 100%);
          color: #243043;
        }

        .student-requests-shell {
          max-width: 1180px;
          margin: 0 auto;
          padding: 32px 20px 48px;
        }

        .student-hero {
          background: linear-gradient(135deg, #7e1638 0%, #a2244c 100%);
          border-radius: 24px;
          color: white;
          padding: 28px;
          box-shadow: 0 16px 40px rgba(126, 22, 56, 0.22);
          margin-bottom: 28px;
        }

        .student-hero h1 {
          font-size: 32px;
          margin-bottom: 10px;
        }

        .student-hero p {
          max-width: 760px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.9);
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
          margin: 22px 0 8px;
        }

        .summary-card {
          background: rgba(255, 255, 255, 0.14);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 18px;
          padding: 18px;
          backdrop-filter: blur(8px);
        }

        .summary-value {
          font-size: 28px;
          font-weight: 800;
          margin-bottom: 6px;
        }

        .summary-label {
          font-size: 13px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.76);
        }

        .status-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          align-items: start;
        }

        .section-card {
          background: white;
          border: 1px solid #ebdce2;
          border-radius: 22px;
          box-shadow: 0 16px 35px rgba(36, 48, 67, 0.08);
          padding: 22px;
        }

        .section-title {
          font-size: 20px;
          font-weight: 800;
          color: #7e1638;
          margin-bottom: 16px;
        }

        .status-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 14px;
        }

        .status-item {
          border-radius: 18px;
          padding: 20px;
          border: 1px solid #eee;
          box-shadow: 0 10px 24px rgba(36, 48, 67, 0.08);
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .status-item.approved-card {
          background: #f3fbf5;
          border-color: #d0ecd8;
        }

        .status-item.pending-card {
          background: #fffaf0;
          border-color: #f2dfaa;
        }

        .status-item.rejected-card {
          background: #fff3f3;
          border-color: #f1cdcd;
        }

        .status-top {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: flex-start;
        }

        .status-top h3 {
          font-size: 18px;
          margin-bottom: 6px;
          color: #1f2937;
        }

        .status-subtitle {
          color: #5b6470;
          line-height: 1.5;
        }

        .status-meta-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .status-meta-card {
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.72);
          border: 1px solid rgba(126, 22, 56, 0.08);
          padding: 12px 13px;
        }

        .status-meta-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #8b7280;
          margin-bottom: 6px;
          font-weight: 700;
        }

        .status-meta-value {
          color: #263445;
          font-weight: 700;
          line-height: 1.4;
          word-break: break-word;
        }

        .status-chip {
          display: inline-flex;
          align-items: center;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          padding: 7px 12px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          white-space: nowrap;
        }

        .status-chip.approved {
          background: #ddf4e4;
          color: #1b7a36;
        }

        .status-chip.pending {
          background: #fff0c7;
          color: #9b6800;
        }

        .status-chip.rejected {
          background: #f9d9d9;
          color: #b33535;
        }

        .slot-box {
          background: rgba(126, 22, 56, 0.06);
          border: 1px dashed rgba(126, 22, 56, 0.24);
          border-radius: 16px;
          padding: 14px 16px;
        }

        .slot-box strong {
          color: #7e1638;
          display: block;
          margin-bottom: 8px;
        }

        .slot-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          color: #344054;
        }

        .empty-state,
        .error-state {
          padding: 18px;
          border-radius: 16px;
          text-align: center;
          color: #5b6470;
          background: #faf7f8;
          border: 1px dashed #ddc7cf;
        }
      `}</style>

      <Header />

      <div className="student-requests-shell">
        <div className="student-hero">
          <h1>My Project Request Status</h1>
          <p>
            Your approval and rejection dates are saved from the admin action.
            Approved meeting slots automatically skip Saturday and Sunday and
            disappear after the scheduled date is over.
          </p>

          <div className="summary-grid">
            <div className="summary-card">
              <div className="summary-value">{visibleApplications.length}</div>
              <div className="summary-label">Visible Requests</div>
            </div>
            <div className="summary-card">
              <div className="summary-value">
                {visibleApplications.filter((item) => item.status === "PENDING").length}
              </div>
              <div className="summary-label">Pending</div>
            </div>
            <div className="summary-card">
              <div className="summary-value">
                {
                  visibleApplications.filter((item) => item.status === "APPROVED")
                    .length
                }
              </div>
              <div className="summary-label">Approved</div>
            </div>
            <div className="summary-card">
              <div className="summary-value">
                {
                  visibleApplications.filter((item) => item.status === "REJECTED")
                    .length
                }
              </div>
              <div className="summary-label">Declined</div>
            </div>
          </div>
        </div>

        <div className="status-layout">
          <div className="section-card">
            <div className="section-title">Application Timeline</div>

            {loading ? (
              <div className="empty-state">Loading your request status...</div>
            ) : error ? (
              <div className="error-state">{error}</div>
            ) : !isStudent ? (
              <div className="empty-state">
                This page is available only for student accounts.
              </div>
            ) : visibleApplications.length === 0 ? (
              <div className="empty-state">
                No active request cards to show right now.
              </div>
            ) : (
              <div className="status-list">
                {visibleApplications.map((application) => {
                  const config =
                    statusStyles[application.status] || statusStyles.PENDING;

                  return (
                    <div
                      className={`status-item ${config.cardClass}`}
                      key={application.applicationId}
                    >
                      <div className="status-top">
                        <div>
                          <h3>{application.projectName || "Project Request"}</h3>
                          <div className="status-subtitle">
                            {application.centerName || "Research Centre"}
                          </div>
                        </div>
                        <span className={`status-chip ${config.chipClass}`}>
                          {config.label}
                        </span>
                      </div>

                      <div className="status-meta-grid">
                        <div className="status-meta-card">
                          <div className="status-meta-label">Application ID</div>
                          <div className="status-meta-value">
                            {application.applicationId}
                          </div>
                        </div>
                        <div className="status-meta-card">
                          <div className="status-meta-label">Decision Date</div>
                          <div className="status-meta-value">
                            {formatDisplayDate(application.decisionDate)}
                          </div>
                        </div>
                      </div>

                      <div className="status-subtitle">
                        {application.status === "APPROVED" &&
                          "Your request has been approved. Please attend the scheduled slots below."}
                        {application.status === "PENDING" &&
                          "Your request is under review. The faculty team has not made a final decision yet."}
                        {application.status === "REJECTED" &&
                          "This request was declined. You can still apply for another suitable project."}
                      </div>

                      {application.status === "APPROVED" && application.slotDate && (
                        <div className="slot-box">
                          <strong>
                            Slot date: {formatDisplayDate(application.slotDate)}
                          </strong>
                          <div className="slot-list">
                            <span>
                              Slot 1: {application.morningSlot || "10:15 AM to 11:00 AM"}
                            </span>
                            <span>
                              Slot 2: {application.afternoonSlot || "2:00 PM to 2:40 PM"}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRequests;
