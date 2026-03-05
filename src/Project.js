import React, { useState, useRef } from "react";
import Header from "./Header";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import projectService from "./services/projectService";

const defaultMembers = [
  { name: "Dr. A. Sharma", role: "Head" },
  { name: "Dr. S. Patel", role: "Reaseach Scientist" },
  { name: "Mrs. R. Kumar", role: "Research Scientist" },
];

const defaultResponsibilities = [
  "Design and develop antibacterial nanofibre materials",
  "Fabricate nanofibres using electrospinning techniques",
  "Incorporate antibacterial agents (silver, zinc oxide, bio-polymers)",
  "Test antibacterial effectiveness against microorganisms",
  "Perform material characterization and analysis",
  "Maintain laboratory safety and quality standards",
  "Document results and support research publications",
];

const defaultSkills = [
  "Basic knowledge of Nanotechnology & Materials Science",
  "Understanding of Polymer Science",
  "Familiarity with Electrospinning techniques",
  "Basics of Microbiology & Antibacterial testing",
  "Laboratory experimentation and safety practices",
  "Data analysis and research documentation skills",
  "Problem-solving and analytical thinking",
];

const TOTAL_REPORTS = 4;

const Project = () => {
  const { projectId } = useParams();

  const [title, setTitle] = useState("");
  const [description1, setDescription1] = useState("");
  const [description2, setDescription2] = useState("");
  const [members, setMembers] = useState([]);
  const [responsibilities, setResponsibilities] = useState([]);
  const [skills, setSkills] = useState([]);
  const [involvedStudents, setInvolvedStudents] = useState([]);
  const [totalStudents, setTotalStudents] = useState(6);
  const [imageUrl, setImageUrl] = useState("");

  const [liked, setLiked] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTab, setEditTab] = useState("basic");
  const [draft, setDraft] = useState({});

  const [uploadedReports, setUploadedReports] = useState([]);
  const [showReportsDropdown, setShowReportsDropdown] = useState(false);
  const [pendingLastReport, setPendingLastReport] = useState(null);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [isProjectCompleted, setIsProjectCompleted] = useState(false);
  const reportInputRef = useRef(null);

  const handleReportUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("File size exceeds 10MB limit.");
      return;
    }
    if (uploadedReports.length >= TOTAL_REPORTS) {
      alert("Maximum reports already uploaded.");
      return;
    }
    const url = URL.createObjectURL(file);
    const reportObj = {
      name: file.name,
      date: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      size: (file.size / 1024).toFixed(1) + " KB",
      url,
    };
    // If this is the last report, show confirmation dialog
    if (uploadedReports.length === TOTAL_REPORTS - 1) {
      setPendingLastReport(reportObj);
      setShowCompletionDialog(true);
    } else {
      setUploadedReports((prev) => [...prev, reportObj]);
    }
    e.target.value = "";
  };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await projectService.getProjectById(projectId);
        const data = response.data;

        setTitle(data.title);
        setDescription1(data.description);
        setMembers([{ name: data.directorName, role: "Director" }]);
        setImageUrl(data.imageUrl);

        setResponsibilities(
          data.responsibilities
            ? data.responsibilities.split(",").map((item) => item.trim())
            : [],
        );

        setSkills(
          data.skillRequirements
            ? data.skillRequirements.split(",").map((item) => item.trim())
            : [],
        );

        // 🔥 NEW API CALL
        const studentsRes =
          await projectService.getStudentsByProject(projectId);

        const students = studentsRes.data.map((s) => ({
          name: s.name,
          dept: s.branch,
          year: s.year,
          img: s.profileImageUrl,
        }));

        setInvolvedStudents(students);
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleCompletionConfirm = () => {
    setUploadedReports((prev) => [...prev, pendingLastReport]);
    setPendingLastReport(null);
    setShowCompletionDialog(false);
    setIsProjectCompleted(true);
  };

  const handleCompletionCancel = () => {
    setPendingLastReport(null);
    setShowCompletionDialog(false);
  };

  const handleDownloadReport = (report) => {
    const a = document.createElement("a");
    a.href = report.url;
    a.download = report.name;
    a.click();
  };

  const progressPercent = Math.round(
    (uploadedReports.length / TOTAL_REPORTS) * 100,
  );

  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showErrorMsg, setShowErrorMsg] = useState(false);
  const [triedSubmit, setTriedSubmit] = useState(false);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    registerNumber: "",
    email: "",
    phoneNumber: "",
    branch: "",
    course: "",
    year: "",
    graduation: "",
  });

  const openEditModal = () => {
    setDraft({
      title,
      description1,
      description2,
      members: members.map((m) => ({ ...m })),
      responsibilities: [...responsibilities],
      skills: [...skills],
      involvedStudents: involvedStudents.map((s) => ({ ...s })),
      totalStudents,
    });
    setEditTab("basic");
    setShowEditModal(true);
  };

  const saveEdit = () => {
    setTitle(draft.title);
    setDescription1(draft.description1);
    setDescription2(draft.description2);
    setMembers(draft.members);
    setResponsibilities(draft.responsibilities);
    setSkills(draft.skills);
    setInvolvedStudents(draft.involvedStudents);
    setTotalStudents(Number(draft.totalStudents) || 6);
    setShowEditModal(false);
  };

  const updateDraftMember = (i, field, val) => {
    const m = [...draft.members];
    m[i] = { ...m[i], [field]: val };
    setDraft((d) => ({ ...d, members: m }));
  };
  const addDraftMember = () =>
    setDraft((d) => ({
      ...d,
      members: [...d.members, { name: "", role: "" }],
    }));
  const removeDraftMember = (i) =>
    setDraft((d) => ({
      ...d,
      members: d.members.filter((_, idx) => idx !== i),
    }));
  const updateDraftList = (listKey, i, val) => {
    const arr = [...draft[listKey]];
    arr[i] = val;
    setDraft((d) => ({ ...d, [listKey]: arr }));
  };
  const addDraftListItem = (listKey) =>
    setDraft((d) => ({ ...d, [listKey]: [...d[listKey], ""] }));
  const removeDraftListItem = (listKey, i) =>
    setDraft((d) => ({
      ...d,
      [listKey]: d[listKey].filter((_, idx) => idx !== i),
    }));
  const updateDraftStudent = (i, field, val) => {
    const s = [...draft.involvedStudents];
    s[i] = { ...s[i], [field]: val };
    setDraft((d) => ({ ...d, involvedStudents: s }));
  };
  const addDraftStudent = () =>
    setDraft((d) => ({
      ...d,
      involvedStudents: [
        ...d.involvedStudents,
        {
          name: "",
          dept: "",
          year: "",
          img: "https://randomuser.me/api/portraits/men/1.jpg",
        },
      ],
    }));
  const removeDraftStudent = (i) =>
    setDraft((d) => ({
      ...d,
      involvedStudents: d.involvedStudents.filter((_, idx) => idx !== i),
    }));

  const MAX_STUDENTS = 6;
  const [showTeamFull, setShowTeamFull] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleApplyClick = () => {
    if (involvedStudents.length >= MAX_STUDENTS) {
      setShowTeamFull(true);
      return;
    }
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };
  const resetForm = () => {
    setUploadedFile(null);
    setTriedSubmit(false);
    setShowErrorMsg(false);
    setFormData({
      name: "",
      registerNumber: "",
      email: "",
      phoneNumber: "",
      branch: "",
      course: "",
      year: "",
      graduation: "",
    });
  };
  const validateEmail = (email) =>
    String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
  const handleSubmit = async () => {
    setTriedSubmit(true);

    const allFieldsFilled = Object.values(formData).every(
      (v) => v.trim() !== "",
    );

    if (!allFieldsFilled || !validateEmail(formData.email) || !uploadedFile) {
      setShowErrorMsg(true);
      return;
    }

    try {
      const applicationData = {
        name: formData.name,
        registerNo: formData.registerNumber,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        branch: formData.branch,
        course: formData.course,
        year: formData.year,
        graduation: formData.graduation,
        projectId: projectId, // 🔥 important
      };

      await projectService.applyForProject(applicationData, uploadedFile);

      setShowErrorMsg(false);
      setShowModal(false);
      setShowSuccess(true);
    } catch (error) {
      console.error("Application submission failed:", error);
      alert("Failed to submit application");
    }
  };
  const handleCloseSuccess = () => {
    setShowSuccess(false);
    resetForm();
  };
  const validateAndSetFile = (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("File size exceeds 2MB limit.");
      return;
    }
    setUploadedFile(file);
  };
  const isInvalid = (fieldName) => {
    if (!triedSubmit) return false;
    if (
      fieldName === "email" &&
      formData.email.trim() !== "" &&
      !validateEmail(formData.email)
    )
      return true;
    return formData[fieldName].trim() === "";
  };

  const editTabs = [
    { id: "basic", label: "📝 Basic Info" },
    { id: "members", label: "👥 Leadership" },
    { id: "responsibilities", label: "⚙️ Responsibilities" },
    { id: "skills", label: "🎯 Skills" },
    { id: "students", label: "🎓 Students" },
  ];

  /* Shared students panel — reused in both sidebar and mobile inline section */
  const StudentsPanel = () => (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">Involved Students</div>
        <div className="student-count">
          {involvedStudents.length}/{totalStudents}
        </div>
      </div>
      <div className="sidebar-list">
        {involvedStudents.map((s, i) => (
          <div className="sidebar-student" key={i}>
            <img className="student-photo" src={s.img} alt={s.name} />
            <div className="student-info">
              <div className="student-name">{s.name}</div>
              <div className="student-dept">{s.dept}</div>
              <div className="student-year">{s.year}</div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );

  return (
    <div className="main-wrapper">
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f0f0f0; min-height: 100vh; }

        /* ── PAGE LAYOUT ── */
        .page-layout {
          display: flex;
          align-items: flex-start;
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 28px 28px 48px 28px;
          gap: 24px;
        }
        .main-content { flex: 1; min-width: 0; }

        /* ── HERO CARD ── */
        .hero-card {
          background: white;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
          display: flex;
          margin-bottom: 26px;
          padding: 24px;
          gap: 24px;
          align-items: flex-start;
          position: relative;
          border: 1px solid #e8e8e8;
        }
        .hero-img-wrap { width: 310px; height: 240px; flex-shrink: 0; border-radius: 10px; overflow: hidden; }
        .hero-img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .hero-body { flex: 1; display: flex; flex-direction: column; padding-right: 32px; }
        .hero-title { font-size: 26px; font-weight: 800; color: #1a1a1a; margin-bottom: 16px; line-height: 1.25; letter-spacing: -0.3px; }
        .hero-description { font-size: 13.5px; line-height: 1.75; color: #555; text-align: justify; }
        .hero-description p + p { margin-top: 14px; }
        .hero-like-btn {
          position: absolute; top: 18px; right: 18px;
          width: 36px; height: 36px; border-radius: 50%;
          background: #f5f5f5; border: 1px solid #e0e0e0;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; cursor: pointer; transition: all 0.2s ease;
          color: #aaa; line-height: 1;
        }
        .hero-like-btn:hover { background: #fff0f3; border-color: #8a1538; color: #8a1538; transform: scale(1.1); }
        .hero-like-btn.liked { background: #fff0f3; border-color: #8a1538; color: #8a1538; }

        /* ── SECTION HEADING ── */
        .section-heading { font-size: 17px; font-weight: 700; color: #1a1a1a; margin-bottom: 14px; }

        /* ── MEMBERS STRIP ── */
        .members-strip { display: flex; gap: 14px; margin-bottom: 26px; align-items: stretch; }
        .member-card {
          flex: 1; background: #e6e6e6; border-radius: 12px;
          padding: 18px 12px 14px; display: flex; flex-direction: column;
          align-items: center; gap: 9px; cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .member-card:hover { transform: translateY(-3px); box-shadow: 0 6px 14px rgba(0,0,0,0.12); }
        .member-card.active { background: #8a1538; color: white; }
        .member-avatar {
          width: 52px; height: 52px; border-radius: 50%; background: #bbb;
          display: flex; align-items: center; justify-content: center;
          font-size: 26px; color: #777;
        }
        .member-card.active .member-avatar { background: rgba(255,255,255,0.25); color: white; }
        .member-name { font-size: 13px; font-weight: 700; line-height: 1.3; text-align: center; }
        .member-role { font-size: 11.5px; opacity: 0.82; line-height: 1.3; text-align: center; }
        .arrow-btn {
          width: 36px; height: 36px; border-radius: 50%;
          background: #8a1538; color: white;
          display: flex; align-items: center; justify-content: center;
          font-size: 20px; font-weight: bold; cursor: pointer;
          flex-shrink: 0; align-self: center; border: none;
        }

        /* ── INFO CARDS ── */
        .cards-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
        .info-card { background: white; border-radius: 12px; padding: 22px 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); }
        .card-title { color: #8a1538; font-size: 15px; font-weight: 700; margin-bottom: 14px; }
        .check-list { list-style: none; display: flex; flex-direction: column; gap: 9px; }
        .check-list li { display: flex; align-items: flex-start; gap: 9px; font-size: 13px; color: #333; line-height: 1.55; }
        .check-list li::before { content: '✓'; color: #333; font-weight: 700; flex-shrink: 0; margin-top: 1px; }

        /* ── PROGRESS BOX ── */
        .progress-box {
          background: white;
          border-radius: 14px;
          padding: 22px 24px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
          border: 1px solid #e8e8e8;
          margin-bottom: 24px;
        }
        .progress-box-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 14px;
          gap: 12px;
        }
        .progress-box-title { font-size: 16px; font-weight: 800; color: #1a1a1a; letter-spacing: -0.2px; }
        .progress-box-right {
          display: flex;
          align-items: center;
          gap: 10px;
          position: relative;
          flex-shrink: 0;
        }
        .progress-upload-btn {
          display: flex; align-items: center; gap: 7px;
          background: #8a1538; color: white; border: none;
          padding: 9px 18px; border-radius: 8px;
          font-size: 13px; font-weight: 600; cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          font-family: inherit; white-space: nowrap;
        }
        .progress-upload-btn:hover { background: #6b0f2a; transform: translateY(-1px); }
        .progress-upload-btn:disabled { background: #ccc; cursor: not-allowed; transform: none; }
        .progress-dropdown-btn {
          width: 36px; height: 36px; border-radius: 8px;
          background: #f5f5f5; border: 1.5px solid #e0e0e0;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; font-size: 13px; color: #555;
          transition: all 0.2s; flex-shrink: 0;
        }
        .progress-dropdown-btn:hover,
        .progress-dropdown-btn.open { background: #fff0f3; border-color: #8a1538; color: #8a1538; }
        .progress-dropdown-btn .chevron { transition: transform 0.25s ease; display: inline-block; }
        .progress-dropdown-btn.open .chevron { transform: rotate(180deg); }
        .progress-dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 300px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.15);
          border: 1px solid #e8e8e8;
          z-index: 200;
          overflow: hidden;
          animation: dropFade 0.2s ease;
        }
        @keyframes dropFade { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }
        .dropdown-menu-head {
          padding: 12px 16px 10px;
          border-bottom: 1px solid #f0e8eb;
          display: flex; align-items: center; justify-content: space-between;
        }
        .dropdown-menu-head-title { font-size: 12px; font-weight: 700; color: #8a1538; letter-spacing: 0.8px; text-transform: uppercase; }
        .dropdown-menu-head-count { font-size: 11px; color: #999; font-weight: 600; }
        .dropdown-empty { padding: 24px 16px; text-align: center; color: #aaa; font-size: 13px; }
        .dropdown-empty-icon { font-size: 28px; margin-bottom: 8px; display: block; }
        .dropdown-report-item {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 16px; border-bottom: 1px solid #f5f5f5;
          transition: background 0.15s;
        }
        .dropdown-report-item:last-child { border-bottom: none; }
        .dropdown-report-item:hover { background: #fdf6f8; }
        .report-pdf-icon {
          width: 36px; height: 36px; background: #fff0f3;
          border-radius: 8px; display: flex; align-items: center;
          justify-content: center; font-size: 18px; flex-shrink: 0;
          border: 1px solid #f5c6d0;
        }
        .report-details { flex: 1; min-width: 0; }
        .report-name { font-size: 13px; font-weight: 600; color: #1a1a1a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .report-meta { font-size: 11px; color: #999; margin-top: 2px; }
        .report-index { font-size: 11px; font-weight: 700; color: #8a1538; background: #fff0f3; padding: 3px 7px; border-radius: 6px; flex-shrink: 0; }
        .report-download-btn {
          flex-shrink: 0; width: 30px; height: 30px; border-radius: 7px;
          background: #f5f5f5; border: 1.5px solid #e0e0e0;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.18s; font-size: 14px; color: #555;
        }
        .report-download-btn:hover { background: #8a1538; border-color: #8a1538; color: white; transform: translateY(-1px); box-shadow: 0 3px 8px rgba(138,21,56,0.25); }

        .progress-desc-row {
          display: flex; align-items: center;
          justify-content: space-between; margin-bottom: 10px; gap: 10px;
        }
        .progress-desc-text { font-size: 13.5px; color: #555; font-weight: 500; }
        .progress-count-badge {
          font-size: 13px; font-weight: 700; color: #8a1538;
          background: #fff0f3; padding: 4px 12px;
          border-radius: 20px; border: 1.5px solid #f5c6d0;
          white-space: nowrap; flex-shrink: 0;
        }
        .progress-track { width: 100%; height: 10px; background: #f0f0f0; border-radius: 999px; overflow: hidden; }
        .progress-fill {
          height: 100%; border-radius: 999px;
          transition: width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative; overflow: hidden;
        }
        .progress-fill::after {
          content: ''; position: absolute;
          top: 0; left: -100%; right: 0; bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          animation: shimmer 2s infinite;
        }
        @keyframes shimmer { to { left: 100%; } }
        .progress-percent-label { font-size: 11.5px; color: #999; margin-top: 7px; text-align: right; font-weight: 600; }

        /* ── APPLY BTN ── */
        .apply-btn {
          background: #8a1538; color: white; border: none;
          padding: 12px 30px; border-radius: 8px;
          font-size: 14px; font-weight: 600; cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          display: block;
        }
        .apply-btn:hover { background: #6b0f2a; transform: translateY(-1px); }

        /* ── DESKTOP SIDEBAR ── */
        .sidebar-wrapper {
          position: relative;
          width: 250px;
          flex-shrink: 0;
          margin-top: 5%;
        }
        .sidebar-edit-btn {
          position: absolute; top: -46px; right: 0px;
          width: 38px; height: 38px; border-radius: 50%;
          background: #8a1538; border: none;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: all 0.22s ease;
          box-shadow: 0 3px 10px rgba(138,21,56,0.35);
          z-index: 10;
        }
        .sidebar-edit-btn:hover { background: #6b0f2a; transform: scale(1.1); box-shadow: 0 5px 16px rgba(138,21,56,0.45); }
        .sidebar-edit-btn svg { width: 17px; height: 17px; fill: white; }

        .sidebar {
          background: white; border-radius: 14px; overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
        }
        .sidebar-sticky { position: sticky; top: 82px; }
        .sidebar-header {
          padding: 16px 18px 14px; border-bottom: 2px solid #f0f0f0;
          display: flex; justify-content: space-between; align-items: center;
        }
        .sidebar-title { color: #8a1538; font-size: 13px; font-weight: 800; letter-spacing: 1.3px; text-transform: uppercase; }
        .student-count { background: #8a1538; color: white; font-size: 11px; font-weight: 700; padding: 4px 8px; border-radius: 12px; letter-spacing: 0.5px; }
        .sidebar-list { display: flex; flex-direction: column; }
        .sidebar-student {
          display: flex; align-items: center; gap: 13px;
          padding: 14px 16px; border-bottom: 1px solid #f4f4f4;
          cursor: pointer; transition: background 0.2s;
        }
        .sidebar-student:last-child { border-bottom: none; }
        .sidebar-student:hover { background: #fdf6f8; }
        .student-photo { width: 56px; height: 56px; border-radius: 8px; object-fit: cover; flex-shrink: 0; background: #e0e0e0; }
        .student-info { flex: 1; min-width: 0; }
        .student-name { font-size: 13.5px; font-weight: 700; color: #1a1a1a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .student-dept { font-size: 12px; color: #666; margin-top: 2px; }
        .student-year { font-size: 12px; color: #666; margin-top: 1px; }

        /* ── MOBILE-ONLY STUDENTS INLINE & EDIT BTN ── */
        .mobile-students-section { display: none; margin-bottom: 24px; }
        .mobile-edit-btn-wrap { display: none; justify-content: flex-end; margin-bottom: 10px; }
        .mobile-edit-btn {
          display: flex; align-items: center; justify-content: center;
          width: 38px; height: 38px; border-radius: 50%;
          background: #8a1538; border: none;
          cursor: pointer; transition: all 0.22s ease;
          box-shadow: 0 3px 10px rgba(138,21,56,0.35);
        }
        .mobile-edit-btn:hover { background: #6b0f2a; transform: scale(1.1); box-shadow: 0 5px 16px rgba(138,21,56,0.45); }
        .mobile-edit-btn svg { width: 17px; height: 17px; fill: white; }

        /* ── MODALS ── */
        .modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.55);
          backdrop-filter: blur(4px); display: flex;
          justify-content: center; align-items: center;
          z-index: 1000; padding: 20px;
          animation: fadeIn 0.25s ease;
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleIn { from { transform: scale(0); } to { transform: scale(1); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }

        .edit-modal-box {
          background: white; width: 100%; max-width: 780px;
          border-radius: 20px; overflow: hidden;
          display: flex; flex-direction: column; max-height: 90vh;
          box-shadow: 0 28px 70px rgba(0,0,0,0.3); animation: slideUp 0.35s ease;
        }
        .edit-modal-head {
          background: linear-gradient(135deg, #8a1538 0%, #6b0f2a 100%);
          padding: 22px 28px; display: flex;
          align-items: center; justify-content: space-between; flex-shrink: 0;
        }
        .edit-modal-head h2 { color: white; font-size: 20px; font-weight: 700; display: flex; align-items: center; gap: 10px; }
        .edit-modal-head h2 span { font-size: 20px; }
        .modal-close {
          width: 34px; height: 34px; border-radius: 50%;
          background: rgba(255,255,255,0.2); border: none;
          color: white; font-size: 22px; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s, transform 0.25s; flex-shrink: 0;
        }
        .modal-close:hover { background: rgba(255,255,255,0.32); transform: rotate(90deg); }
        .edit-tabs {
          display: flex; background: #faf8f8;
          border-bottom: 2px solid #f0e8eb; flex-shrink: 0; overflow-x: auto;
        }
        .edit-tab {
          padding: 13px 18px; font-size: 13px; font-weight: 600;
          cursor: pointer; color: #888; border-bottom: 3px solid transparent;
          margin-bottom: -2px; white-space: nowrap; transition: all 0.2s;
          background: none; border-left: none; border-right: none; border-top: none;
          font-family: inherit;
        }
        .edit-tab:hover { color: #8a1538; background: #fff5f7; }
        .edit-tab.active { color: #8a1538; border-bottom-color: #8a1538; background: white; }
        .edit-body { padding: 28px 32px; overflow-y: auto; flex-grow: 1; }
        .edit-body::-webkit-scrollbar { width: 5px; }
        .edit-body::-webkit-scrollbar-track { background: #f5f5f5; }
        .edit-body::-webkit-scrollbar-thumb { background: #8a1538; border-radius: 10px; }
        .edit-section-label { font-size: 13px; font-weight: 700; color: #444; margin-bottom: 8px; letter-spacing: 0.3px; }
        .edit-input {
          width: 100%; padding: 10px 14px; border: 2px solid #e5e7eb;
          border-radius: 9px; font-size: 14px; background: #fafafa;
          font-family: inherit; transition: border-color 0.2s, box-shadow 0.2s; color: #1a1a1a;
        }
        .edit-input:focus { outline: none; border-color: #8a1538; background: white; box-shadow: 0 0 0 3px rgba(138,21,56,0.09); }
        .edit-textarea { resize: vertical; min-height: 90px; line-height: 1.6; }
        .edit-field-group { margin-bottom: 20px; }
        .edit-row { display: flex; gap: 10px; align-items: flex-start; margin-bottom: 10px; }
        .edit-row .edit-input { flex: 1; }
        .remove-btn {
          flex-shrink: 0; width: 34px; height: 38px; border-radius: 8px;
          background: #fff0f3; border: 1px solid #f5c6d0; color: #8a1538;
          font-size: 18px; cursor: pointer; display: flex; align-items: center;
          justify-content: center; transition: all 0.18s; font-weight: bold;
        }
        .remove-btn:hover { background: #8a1538; color: white; border-color: #8a1538; }
        .add-btn {
          display: flex; align-items: center; gap: 7px;
          padding: 9px 16px; background: #fff5f7;
          border: 1.5px dashed #c5607a; border-radius: 8px;
          color: #8a1538; font-size: 13px; font-weight: 600;
          cursor: pointer; transition: all 0.18s; margin-top: 4px; font-family: inherit;
        }
        .add-btn:hover { background: #8a1538; color: white; border-style: solid; border-color: #8a1538; }
        .student-edit-row {
          display: grid; grid-template-columns: 1fr 1fr 1fr auto;
          gap: 8px; align-items: center; margin-bottom: 10px;
          padding: 12px; background: #fafafa; border-radius: 10px; border: 1px solid #eee;
        }
        .edit-footer {
          padding: 18px 32px 22px; background: #fafafa;
          border-top: 1px solid #eee; display: flex;
          justify-content: flex-end; gap: 12px; flex-shrink: 0;
        }
        .cancel-btn {
          padding: 11px 24px; border-radius: 9px; border: 2px solid #ddd;
          background: white; font-size: 14px; font-weight: 600; color: #666;
          cursor: pointer; transition: all 0.18s; font-family: inherit;
        }
        .cancel-btn:hover { border-color: #bbb; color: #333; }
        .save-btn {
          padding: 11px 30px; border-radius: 9px;
          background: linear-gradient(135deg, #8a1538, #6b0f2a);
          color: white; border: none; font-size: 14px; font-weight: 700;
          cursor: pointer; transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(138,21,56,0.28); font-family: inherit;
        }
        .save-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(138,21,56,0.38); }
        .member-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }

        .modal-box {
          background: white; width: 100%; max-width: 860px;
          border-radius: 18px; overflow: hidden; display: flex;
          flex-direction: column; max-height: 92vh;
          box-shadow: 0 24px 64px rgba(0,0,0,0.28); animation: slideUp 0.35s ease;
        }
        .modal-head {
          background: linear-gradient(135deg, #8a1538 0%, #6b0f2a 100%);
          padding: 26px 32px; display: flex;
          align-items: center; justify-content: center;
          position: relative; flex-shrink: 0;
        }
        .modal-head h2 { color: white; font-size: 22px; font-weight: 700; }
        .modal-head .modal-close { position: absolute; right: 22px; top: 50%; transform: translateY(-50%); }
        .modal-head .modal-close:hover { transform: translateY(-50%) rotate(90deg); }
        .form-body { padding: 36px 40px; overflow-y: auto; flex-grow: 1; }
        .form-body::-webkit-scrollbar { width: 6px; }
        .form-body::-webkit-scrollbar-thumb { background: #8a1538; border-radius: 10px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; margin-bottom: 28px; }
        .form-group label { display: block; font-size: 13px; font-weight: 600; color: #333; margin-bottom: 7px; }
        .form-control {
          width: 100%; padding: 11px 14px; border: 2px solid #e5e7eb;
          border-radius: 9px; font-size: 14px; background: #fafafa;
          font-family: inherit; transition: border-color 0.2s;
        }
        .form-control:focus { outline: none; border-color: #8a1538; background: white; box-shadow: 0 0 0 3px rgba(138,21,56,0.10); }
        .form-control.error { border-color: #ef4444; background: #fef2f2; }
        .upload-label { display: block; font-size: 13px; font-weight: 600; color: #333; margin-bottom: 10px; }
        .upload-box {
          border: 2px dashed #d1d5db; border-radius: 14px;
          padding: 36px; text-align: center; background: #fafafa;
          cursor: pointer; transition: border-color 0.25s, background 0.25s;
        }
        .upload-box:hover { border-color: #8a1538; background: #fff9fa; }
        .upload-box.has-file { border-style: solid; border-color: #8a1538; background: linear-gradient(135deg, #fff9fa, #fff0f3); }
        .upload-box.error { border-color: #ef4444; background: #fef2f2; }
        .upload-icon { font-size: 44px; margin-bottom: 12px; display: block; animation: float 3s ease-in-out infinite; }
        .upload-text { font-size: 14px; color: #666; font-weight: 500; margin-bottom: 16px; }
        .upload-box.has-file .upload-text { color: #8a1538; font-weight: 600; }
        .browse-btn {
          background: linear-gradient(135deg, #8a1538, #6b0f2a);
          color: white; border: none; padding: 9px 30px;
          border-radius: 7px; font-size: 14px; font-weight: 600;
          cursor: pointer; margin-bottom: 10px; transition: transform 0.2s;
          box-shadow: 0 2px 8px rgba(138,21,56,0.2);
        }
        .browse-btn:hover { transform: translateY(-2px); }
        .upload-hint { font-size: 11.5px; color: #9ca3af; margin-top: 8px; }
        .submit-area {
          text-align: center; padding: 22px 40px 28px;
          background: #fafafa; border-top: 1px solid #e5e7eb; flex-shrink: 0;
        }
        .submit-btn {
          background: linear-gradient(135deg, #8a1538, #6b0f2a);
          color: white; border: none; width: 100%; max-width: 380px;
          padding: 15px; border-radius: 11px; font-size: 15px; font-weight: 700;
          cursor: pointer; transition: transform 0.2s;
          box-shadow: 0 4px 12px rgba(138,21,56,0.28);
        }
        .submit-btn:hover { transform: translateY(-2px); }
        .error-msg-text {
          display: inline-block; margin-top: 12px; color: #ef4444;
          font-size: 13.5px; font-weight: 600; background: #fef2f2;
          padding: 7px 16px; border-radius: 7px;
        }
        .success-modal {
          background: white; border-radius: 18px; overflow: hidden;
          max-width: 420px; width: 90%;
          box-shadow: 0 24px 60px rgba(0,0,0,0.28);
          animation: slideUp 0.35s ease; text-align: center; padding-bottom: 36px;
        }
        .success-modal-head { background: linear-gradient(135deg, #8a1538, #6b0f2a); padding: 18px 24px; text-align: left; }
        .success-modal-head h2 { color: white; font-size: 17px; font-weight: 600; }
        .success-icon {
          width: 76px; height: 76px;
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 50%; display: flex; align-items: center;
          justify-content: center; font-size: 38px; color: white;
          margin: 28px auto 18px; box-shadow: 0 4px 18px rgba(16,185,129,0.3);
          animation: scaleIn 0.45s ease;
        }
        .success-title { font-size: 20px; font-weight: 700; color: #1a1a1a; margin-bottom: 10px; }
        .success-msg { font-size: 14px; color: #666; line-height: 1.6; padding: 0 28px; margin-bottom: 24px; }
        .ok-btn {
          background: linear-gradient(135deg, #8a1538, #6b0f2a);
          color: white; border: none; padding: 12px 40px;
          border-radius: 8px; font-size: 14px; font-weight: 600;
          cursor: pointer; transition: transform 0.2s;
          box-shadow: 0 4px 12px rgba(138,21,56,0.28);
        }
        .ok-btn:hover { transform: translateY(-2px); }

        /* ── TEAM FULL DIALOG ── */
        .team-full-modal {
          background: white;
          border-radius: 18px;
          overflow: hidden;
          max-width: 400px;
          width: 92%;
          box-shadow: 0 24px 60px rgba(0,0,0,0.28);
          animation: slideUp 0.35s ease;
          text-align: center;
          padding-bottom: 32px;
        }
        .team-full-modal-head {
          background: linear-gradient(135deg, #8a1538, #6b0f2a);
          padding: 18px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .team-full-modal-head h2 { color: white; font-size: 16px; font-weight: 700; }
        .team-full-icon {
          width: 72px; height: 72px;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 34px; color: white;
          margin: 26px auto 16px;
          box-shadow: 0 4px 18px rgba(239,68,68,0.35);
          animation: scaleIn 0.45s ease;
        }
        .team-full-title { font-size: 19px; font-weight: 800; color: #1a1a1a; margin-bottom: 8px; }
        .team-full-msg {
          font-size: 14px; color: #666; line-height: 1.65;
          padding: 0 28px; margin-bottom: 24px;
        }
        .team-full-msg strong { color: #8a1538; }
        .team-full-close-btn {
          background: linear-gradient(135deg, #8a1538, #6b0f2a);
          color: white; border: none; padding: 11px 36px;
          border-radius: 8px; font-size: 14px; font-weight: 600;
          cursor: pointer; transition: transform 0.2s;
          box-shadow: 0 4px 12px rgba(138,21,56,0.28);
        }
        .team-full-close-btn:hover { transform: translateY(-2px); }

        @media (max-width: 600px) {
          .team-full-modal { border-radius: 20px; width: 92%; }
          .team-full-msg { padding: 0 18px; font-size: 13px; }
        }
        .divider { height: 1px; background: #f0e8eb; margin: 20px 0; }

        /* ── COMPLETION CONFIRMATION DIALOG ── */
        .completion-dialog-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          z-index: 2000; padding: 20px;
          animation: fadeIn 0.2s ease;
        }
        .completion-dialog {
          background: white;
          border-radius: 18px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 24px 60px rgba(0,0,0,0.25);
          overflow: hidden;
          animation: dialogPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        @keyframes dialogPop {
          from { opacity: 0; transform: scale(0.88) translateY(16px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .completion-dialog-icon-wrap {
          background: linear-gradient(135deg, #fff7e6, #fff0d0);
          padding: 28px 24px 18px;
          display: flex; flex-direction: column;
          align-items: center; gap: 10px;
          border-bottom: 1px solid #f5e8cc;
        }
        .completion-dialog-icon {
          width: 62px; height: 62px;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 28px;
          box-shadow: 0 6px 18px rgba(245,158,11,0.35);
          animation: iconBounce 0.5s 0.15s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        @keyframes iconBounce {
          from { transform: scale(0); }
          to   { transform: scale(1); }
        }
        .completion-dialog-badge {
          font-size: 11px; font-weight: 700; letter-spacing: 1px;
          text-transform: uppercase; color: #d97706;
          background: #fef3c7; padding: 3px 10px;
          border-radius: 20px; border: 1.5px solid #fde68a;
        }
        .completion-dialog-body {
          padding: 22px 26px 10px;
          text-align: center;
        }
        .completion-dialog-title {
          font-size: 17px; font-weight: 800; color: #1a1a1a;
          margin-bottom: 10px; line-height: 1.3;
        }
        .completion-dialog-message {
          font-size: 13.5px; color: #666; line-height: 1.65;
        }
        .completion-dialog-message strong { color: #1a1a1a; }
        .completion-dialog-actions {
          display: flex; gap: 10px;
          padding: 18px 24px 24px;
        }
        .completion-btn-no {
          flex: 1; padding: 12px;
          border-radius: 10px; border: 2px solid #e5e7eb;
          background: white; font-size: 14px; font-weight: 700;
          color: #666; cursor: pointer;
          transition: all 0.18s; font-family: inherit;
        }
        .completion-btn-no:hover { border-color: #bbb; color: #333; background: #f9f9f9; }
        .completion-btn-yes {
          flex: 1.4; padding: 12px;
          border-radius: 10px; border: none;
          background: linear-gradient(135deg, #8a1538, #6b0f2a);
          font-size: 14px; font-weight: 700;
          color: white; cursor: pointer;
          transition: all 0.18s; font-family: inherit;
          box-shadow: 0 4px 12px rgba(138,21,56,0.3);
        }
        .completion-btn-yes:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(138,21,56,0.4); }

        /* ── COMPLETED BUTTON STATE ── */
        .apply-btn.completed {
          background: linear-gradient(135deg, #10b981, #059669);
          cursor: default; pointer-events: none;
          box-shadow: 0 4px 14px rgba(16,185,129,0.3);
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .apply-btn.completed:hover { transform: none; background: linear-gradient(135deg, #10b981, #059669); }

        /* ════════════════════════════════════════
           TABLET  ≤ 900px
        ════════════════════════════════════════ */
        @media (max-width: 900px) {
          /* Hide desktop sidebar, show mobile controls */
          .sidebar-wrapper { display: none; }
          .mobile-students-section { display: block; }
          .mobile-edit-btn-wrap { display: flex; }

          .page-layout { padding: 20px 16px 40px 16px; gap: 18px; }

          /* Hero: stack image above text */
          .hero-card { flex-direction: column; padding: 16px; gap: 16px; }
          .hero-img-wrap { width: 100%; height: 210px; }
          .hero-body { padding-right: 0; }
          .hero-title { font-size: 22px; }
          .hero-like-btn { top: 12px; right: 12px; }

          /* Members: horizontal scroll */
          .members-strip { overflow-x: auto; padding-bottom: 6px; flex-wrap: nowrap; -webkit-overflow-scrolling: touch; }
          .member-card { min-width: 115px; flex: 0 0 115px; }

          /* Info cards still 2 col */
          .cards-grid { gap: 14px; }

          /* Form */
          .form-body { padding: 24px 20px; }
          .form-grid { gap: 16px; }
          .submit-area { padding: 18px 20px 24px; }
          .modal-head { padding: 20px 24px; }
          .modal-head h2 { font-size: 18px; }

          /* Edit modal */
          .edit-modal-head { padding: 18px 20px; }
          .edit-modal-head h2 { font-size: 17px; }
          .edit-body { padding: 20px 18px; }
          .edit-footer { padding: 14px 18px 18px; }
          .student-edit-row { grid-template-columns: 1fr 1fr; }
        }

        /* ════════════════════════════════════════
           MOBILE  ≤ 600px
        ════════════════════════════════════════ */
        @media (max-width: 600px) {
          .page-layout { padding: 12px 12px 36px 12px; flex-direction: column; }

          /* Hero */
          .hero-card { padding: 14px; gap: 12px; border-radius: 12px; margin-bottom: 18px; }
          .hero-img-wrap { height: 175px; }
          .hero-title { font-size: 18px; margin-bottom: 10px; }
          .hero-description { font-size: 13px; }
          .hero-like-btn { width: 30px; height: 30px; font-size: 14px; top: 10px; right: 10px; }

          /* Progress box */
          .progress-box { padding: 14px; border-radius: 12px; margin-bottom: 18px; }
          .progress-box-header { flex-wrap: wrap; gap: 8px; margin-bottom: 10px; }
          .progress-box-title { font-size: 14px; width: 100%; }
          .progress-box-right { width: 100%; justify-content: flex-end; }
          .progress-upload-btn { padding: 8px 14px; font-size: 12px; }
          .progress-dropdown-menu {
            width: calc(100vw - 48px);
            max-width: 280px;
            right: 0;
            left: auto;
          }
          .progress-desc-row { flex-direction: column; align-items: flex-start; gap: 6px; }
          .progress-desc-text { font-size: 12.5px; }
          .progress-count-badge { font-size: 12px; padding: 3px 10px; }

          /* Section heading */
          .section-heading { font-size: 15px; margin-bottom: 10px; }

          /* Members */
          .members-strip { gap: 10px; margin-bottom: 18px; }
          .member-card { min-width: 90px; flex: 0 0 90px; padding: 12px 8px 10px; gap: 6px; border-radius: 10px; }
          .member-avatar { width: 40px; height: 40px; font-size: 20px; }
          .member-name { font-size: 11px; }
          .member-role { font-size: 10px; }
          .arrow-btn { width: 30px; height: 30px; font-size: 16px; }

          /* Info cards: single column */
          .cards-grid { grid-template-columns: 1fr; gap: 14px; margin-bottom: 18px; }
          .info-card { padding: 16px 14px; border-radius: 10px; }
          .card-title { font-size: 14px; margin-bottom: 10px; }
          .check-list li { font-size: 12.5px; }

          /* Inline students grid on mobile */
          .mobile-students-section { border-radius: 12px; overflow: hidden; margin-bottom: 18px; }
          .mobile-students-section .sidebar { border-radius: 12px; }
          .mobile-students-section .sidebar-list { display: grid; grid-template-columns: 1fr 1fr; }
          .mobile-students-section .sidebar-student {
            padding: 10px 10px; gap: 8px;
            border-right: 1px solid #f4f4f4;
          }
          .mobile-students-section .sidebar-student:nth-child(even) { border-right: none; }
          .student-photo { width: 42px; height: 42px; border-radius: 6px; }
          .student-name { font-size: 12px; }
          .student-dept { font-size: 10.5px; }
          .student-year { font-size: 10.5px; }

          /* Apply button: full width */
          .apply-btn { width: 100%; padding: 14px; font-size: 15px; border-radius: 10px; text-align: center; }

          /* Mobile edit button */
          .mobile-edit-btn { width: 34px; height: 34px; }
          .mobile-edit-btn svg { width: 15px; height: 15px; }

          /* Modals: slide up from bottom */
          .modal-overlay { padding: 0; align-items: flex-end; }
          .modal-box { border-radius: 20px 20px 0 0; max-height: 95vh; }
          .edit-modal-box { border-radius: 20px 20px 0 0; max-height: 95vh; }
          .success-modal { border-radius: 20px; width: 92%; }
          .modal-overlay.center-modal { align-items: center; padding: 20px; }

          .modal-head { padding: 16px 18px; }
          .modal-head h2 { font-size: 15px; }
          .form-body { padding: 16px 14px; }
          .form-grid { grid-template-columns: 1fr; gap: 14px; }
          .form-control { padding: 10px 12px; font-size: 14px; }
          .upload-box { padding: 22px 16px; }
          .upload-icon { font-size: 32px; margin-bottom: 10px; }
          .upload-text { font-size: 13px; margin-bottom: 12px; }
          .browse-btn { padding: 8px 22px; font-size: 13px; }
          .submit-area { padding: 14px 14px 20px; }
          .submit-btn { font-size: 14px; padding: 13px; }
          .error-msg-text { font-size: 12.5px; padding: 6px 12px; }

          /* Edit modal on mobile */
          .edit-modal-head { padding: 14px 16px; }
          .edit-modal-head h2 { font-size: 14px; }
          .edit-tab { padding: 10px 12px; font-size: 11.5px; }
          .edit-body { padding: 16px 14px; }
          .edit-footer { padding: 12px 14px 16px; gap: 10px; }
          .cancel-btn { padding: 9px 18px; font-size: 13px; }
          .save-btn { padding: 9px 22px; font-size: 13px; }
          .student-edit-row { grid-template-columns: 1fr; }
          .member-grid { grid-template-columns: 1fr; }
        }

        /* ════════════════════════════════════════
           SMALL MOBILE  ≤ 380px
        ════════════════════════════════════════ */
        @media (max-width: 380px) {
          .page-layout { padding: 10px 10px 28px 10px; }
          .hero-img-wrap { height: 148px; }
          .hero-title { font-size: 16px; }
          .progress-dropdown-menu { width: calc(100vw - 40px); }
          .mobile-students-section .sidebar-list { grid-template-columns: 1fr; }
          .mobile-students-section .sidebar-student { border-right: none; }
          .member-card { min-width: 80px; flex: 0 0 80px; }
          .cards-grid { gap: 10px; }
          .form-control { font-size: 13px; }
        }
      `}</style>

      <Header />

      <div className="page-layout">
        <div className="main-content">
          <div className="mobile-edit-btn-wrap">
            <button
              className="mobile-edit-btn"
              onClick={openEditModal}
              title="Edit project details"
            >
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
              </svg>
            </button>
          </div>

          {/* Hero Card */}
          <div className="hero-card">
            <button
              className={"hero-like-btn" + (liked ? " liked" : "")}
              onClick={() => setLiked(!liked)}
              title={liked ? "Unlike" : "Like"}
            >
              {liked ? "♥" : "♡"}
            </button>
            <div className="hero-img-wrap">
              <img src={imageUrl} className="hero-img" alt="project" />
            </div>
            <div className="hero-body">
              <div className="hero-title">{title}</div>
              <div className="hero-description">
                <p>{description1}</p>
                {description2 && <p>{description2}</p>}
              </div>
            </div>
          </div>

          {/* Progress Box */}
          {/* <div className="progress-box">
            <div className="progress-box-header">
              <div className="progress-box-title">Progress</div>
              <div className="progress-box-right">
                <input type="file" accept=".pdf" hidden ref={reportInputRef} onChange={handleReportUpload} />
                <button
                  className="progress-upload-btn"
                  onClick={() => reportInputRef.current.click()}
                  disabled={uploadedReports.length >= TOTAL_REPORTS}
                  title={uploadedReports.length >= TOTAL_REPORTS ? 'All reports uploaded' : 'Upload PDF report'}
                >
                  <span>📄</span> Upload PDF
                </button>
                <button
                  className={`progress-dropdown-btn${showReportsDropdown ? ' open' : ''}`}
                  onClick={() => setShowReportsDropdown(v => !v)}
                  title="View uploaded reports"
                >
                  <span className="chevron">▾</span>
                </button>
                {showReportsDropdown && (
                  <div className="progress-dropdown-menu">
                    <div className="dropdown-menu-head">
                      <span className="dropdown-menu-head-title">Uploaded Reports</span>
                      <span className="dropdown-menu-head-count">{uploadedReports.length} / {TOTAL_REPORTS}</span>
                    </div>
                    {uploadedReports.length === 0 ? (
                      <div className="dropdown-empty">
                        <span className="dropdown-empty-icon">📭</span>
                        No reports uploaded yet
                      </div>
                    ) : (
                      uploadedReports.map((r, i) => (
                        <div className="dropdown-report-item" key={i}>
                          <div className="report-pdf-icon">📄</div>
                          <div className="report-details">
                            <div className="report-name">{r.name}</div>
                            <div className="report-meta">{r.date} &nbsp;·&nbsp; {r.size}</div>
                          </div>
                          <div className="report-index">#{i + 1}</div>
                          <button className="report-download-btn" onClick={() => handleDownloadReport(r)} title="Download PDF">⬇</button>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="progress-desc-row">
              <div className="progress-desc-text">Total number of reports to be uploaded</div>
              <div className="progress-count-badge">{uploadedReports.length} / {TOTAL_REPORTS}</div>
            </div>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${progressPercent}%`,
                  background: progressPercent === 100
                    ? 'linear-gradient(90deg, #10b981, #059669)'
                    : progressPercent >= 50
                    ? 'linear-gradient(90deg, #f59e0b, #d97706)'
                    : 'linear-gradient(90deg, #8a1538, #c0254d)',
                }}
              />
            </div>
            <div className="progress-percent-label">{progressPercent}% complete</div>
          </div> */}

          {/* Members */}
          <div className="section-heading">Centre Leadership &amp; Members</div>
          <div className="members-strip">
            {members.map((m, i) => (
              <div className={`member-card${i === 0 ? " active" : ""}`} key={i}>
                <div className="member-avatar">👤</div>
                <div className="member-name">{m.name}</div>
                <div className="member-role">{m.role}</div>
              </div>
            ))}
            <button className="arrow-btn">›</button>
          </div>

          {/* Info cards */}
          <div className="cards-grid">
            <div className="info-card">
              <div className="card-title">Work / Responsibilities:</div>
              <ul className="check-list">
                {responsibilities.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
            <div className="info-card">
              <div className="card-title">Skill Requirement:</div>
              <ul className="check-list">
                {skills.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Mobile-only: Involved Students (after skills, before Apply) */}
          <div className="mobile-students-section">
            <StudentsPanel />
          </div>

          <button
            className={"apply-btn" + (isProjectCompleted ? " completed" : "")}
            onClick={!isProjectCompleted ? handleApplyClick : undefined}
          >
            {isProjectCompleted ? (
              <>
                <span>✓</span> Project Completed
              </>
            ) : (
              "Apply now"
            )}
          </button>
        </div>

        {/* Desktop Sidebar */}
        <div className="sidebar-wrapper">
          <button
            className="sidebar-edit-btn"
            onClick={openEditModal}
            title="Edit project details"
          >
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
            </svg>
          </button>
          <div className="sidebar-sticky">
            <StudentsPanel />
          </div>
        </div>
      </div>

      {/* Completion Confirmation Dialog */}
      {showCompletionDialog && (
        <div className="completion-dialog-overlay">
          <div className="completion-dialog">
            <div className="completion-dialog-icon-wrap">
              <div className="completion-dialog-icon">⚠️</div>
              <div className="completion-dialog-badge">Final Report</div>
            </div>
            <div className="completion-dialog-body">
              <div className="completion-dialog-title">
                Upload only if the project is completed
              </div>
              <div className="completion-dialog-message">
                You are about to upload the{" "}
                <strong>
                  last report ({TOTAL_REPORTS}/{TOTAL_REPORTS})
                </strong>
                . This will mark the project as <strong>completed</strong>. Are
                you sure you want to proceed?
              </div>
            </div>
            <div className="completion-dialog-actions">
              <button
                className="completion-btn-no"
                onClick={handleCompletionCancel}
              >
                No, Cancel
              </button>
              <button
                className="completion-btn-yes"
                onClick={handleCompletionConfirm}
              >
                Yes, Complete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && draft && (
        <div
          className="modal-overlay"
          onClick={(e) =>
            e.target === e.currentTarget && setShowEditModal(false)
          }
        >
          <div className="edit-modal-box">
            <div className="edit-modal-head">
              <h2>
                <span>✏️</span> Edit Project Details
              </h2>
              <button
                className="modal-close"
                onClick={() => setShowEditModal(false)}
              >
                ×
              </button>
            </div>
            <div className="edit-tabs">
              {editTabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`edit-tab${editTab === tab.id ? " active" : ""}`}
                  onClick={() => setEditTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="edit-body">
              {editTab === "basic" && (
                <div>
                  <div className="edit-field-group">
                    <div className="edit-section-label">Project Title</div>
                    <input
                      className="edit-input"
                      value={draft.title}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, title: e.target.value }))
                      }
                      placeholder="Enter project title"
                    />
                  </div>
                  <div className="edit-field-group">
                    <div className="edit-section-label">
                      Description — Paragraph 1
                    </div>
                    <textarea
                      className="edit-input edit-textarea"
                      value={draft.description1}
                      onChange={(e) =>
                        setDraft((d) => ({
                          ...d,
                          description1: e.target.value,
                        }))
                      }
                      placeholder="First paragraph..."
                    />
                  </div>
                  <div className="edit-field-group">
                    <div className="edit-section-label">
                      Description — Paragraph 2
                    </div>
                    <textarea
                      className="edit-input edit-textarea"
                      value={draft.description2}
                      onChange={(e) =>
                        setDraft((d) => ({
                          ...d,
                          description2: e.target.value,
                        }))
                      }
                      placeholder="Second paragraph..."
                    />
                  </div>
                </div>
              )}
              {editTab === "members" && (
                <div>
                  <div
                    className="edit-section-label"
                    style={{ marginBottom: 14 }}
                  >
                    Centre Leadership &amp; Members
                  </div>
                  {draft.members.map((m, i) => (
                    <div key={i} className="edit-row">
                      <div className="member-grid" style={{ flex: 1 }}>
                        <input
                          className="edit-input"
                          value={m.name}
                          onChange={(e) =>
                            updateDraftMember(i, "name", e.target.value)
                          }
                          placeholder="Name (e.g. Dr. A. Sharma)"
                        />
                        <input
                          className="edit-input"
                          value={m.role}
                          onChange={(e) =>
                            updateDraftMember(i, "role", e.target.value)
                          }
                          placeholder="Role (e.g. Director)"
                        />
                      </div>
                      <button
                        className="remove-btn"
                        onClick={() => removeDraftMember(i)}
                        title="Remove"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button className="add-btn" onClick={addDraftMember}>
                    ＋ Add Member
                  </button>
                </div>
              )}
              {editTab === "responsibilities" && (
                <div>
                  <div
                    className="edit-section-label"
                    style={{ marginBottom: 14 }}
                  >
                    Work / Responsibilities
                  </div>
                  {draft.responsibilities.map((r, i) => (
                    <div key={i} className="edit-row">
                      <input
                        className="edit-input"
                        value={r}
                        onChange={(e) =>
                          updateDraftList("responsibilities", i, e.target.value)
                        }
                        placeholder={`Responsibility ${i + 1}`}
                      />
                      <button
                        className="remove-btn"
                        onClick={() =>
                          removeDraftListItem("responsibilities", i)
                        }
                        title="Remove"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    className="add-btn"
                    onClick={() => addDraftListItem("responsibilities")}
                  >
                    ＋ Add Responsibility
                  </button>
                </div>
              )}
              {editTab === "skills" && (
                <div>
                  <div
                    className="edit-section-label"
                    style={{ marginBottom: 14 }}
                  >
                    Skill Requirements
                  </div>
                  {draft.skills.map((s, i) => (
                    <div key={i} className="edit-row">
                      <input
                        className="edit-input"
                        value={s}
                        onChange={(e) =>
                          updateDraftList("skills", i, e.target.value)
                        }
                        placeholder={`Skill ${i + 1}`}
                      />
                      <button
                        className="remove-btn"
                        onClick={() => removeDraftListItem("skills", i)}
                        title="Remove"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    className="add-btn"
                    onClick={() => addDraftListItem("skills")}
                  >
                    ＋ Add Skill
                  </button>
                </div>
              )}
              {editTab === "students" && (
                <div>
                  <div
                    className="edit-field-group"
                    style={{ marginBottom: 20 }}
                  >
                    <div className="edit-section-label">
                      Total Students in Team
                    </div>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <input
                        className="edit-input"
                        type="number"
                        min="1"
                        max="100"
                        value={draft.totalStudents}
                        onChange={(e) =>
                          setDraft((d) => ({
                            ...d,
                            totalStudents: e.target.value,
                          }))
                        }
                        placeholder="e.g. 6"
                        style={{ maxWidth: 120 }}
                      />
                      <span style={{ fontSize: 13, color: "#666" }}>
                        Currently{" "}
                        <strong style={{ color: "#8a1538" }}>
                          {draft.involvedStudents
                            ? draft.involvedStudents.length
                            : 0}
                        </strong>{" "}
                        / <strong>{draft.totalStudents || 0}</strong> students
                        added
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      height: 1,
                      background: "#f0e8eb",
                      marginBottom: 18,
                    }}
                  />
                  <div
                    className="edit-section-label"
                    style={{ marginBottom: 14 }}
                  >
                    Involved Students
                  </div>
                  {draft.involvedStudents.map((s, i) => (
                    <div key={i} className="student-edit-row">
                      <input
                        className="edit-input"
                        value={s.name}
                        onChange={(e) =>
                          updateDraftStudent(i, "name", e.target.value)
                        }
                        placeholder="Student name"
                      />
                      <input
                        className="edit-input"
                        value={s.dept}
                        onChange={(e) =>
                          updateDraftStudent(i, "dept", e.target.value)
                        }
                        placeholder="Department"
                      />
                      <input
                        className="edit-input"
                        value={s.year}
                        onChange={(e) =>
                          updateDraftStudent(i, "year", e.target.value)
                        }
                        placeholder="Year (e.g. 2nd Year)"
                      />
                      <button
                        className="remove-btn"
                        onClick={() => removeDraftStudent(i)}
                        title="Remove"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button className="add-btn" onClick={addDraftStudent}>
                    ＋ Add Student
                  </button>
                </div>
              )}
            </div>
            <div className="edit-footer">
              <button
                className="cancel-btn"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button className="save-btn" onClick={saveEdit}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Application Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-head">
              <h2>Project Application Form</h2>
              <button className="modal-close" onClick={handleCloseModal}>
                ×
              </button>
            </div>
            <div className="form-body">
              <div className="form-grid">
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={
                      "form-control" + (isInvalid("name") ? " error" : "")
                    }
                    placeholder="Enter your name"
                  />
                </div>
                <div className="form-group">
                  <label>Register Number *</label>
                  <input
                    type="text"
                    name="registerNumber"
                    value={formData.registerNumber}
                    onChange={handleInputChange}
                    className={
                      "form-control" +
                      (isInvalid("registerNumber") ? " error" : "")
                    }
                    placeholder="Enter your register number"
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={
                      "form-control" + (isInvalid("email") ? " error" : "")
                    }
                    placeholder="Enter your email"
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className={
                      "form-control" +
                      (isInvalid("phoneNumber") ? " error" : "")
                    }
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="form-group">
                  <label>Branch *</label>
                  <select
                    name="branch"
                    value={formData.branch}
                    onChange={handleInputChange}
                    className={
                      "form-control" + (isInvalid("branch") ? " error" : "")
                    }
                  >
                    <option value="">Select your branch</option>
                    <option>Computer Science</option>
                    <option>Electronics</option>
                    <option>Mechanical</option>
                    <option>Biotechnology</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Course *</label>
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleInputChange}
                    className={
                      "form-control" + (isInvalid("course") ? " error" : "")
                    }
                  >
                    <option value="">Select your course</option>
                    <option>B.E / B.Tech</option>
                    <option>M.E / M.Tech</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Year *</label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className={
                      "form-control" + (isInvalid("year") ? " error" : "")
                    }
                  >
                    <option value="">Select your year</option>
                    <option>1st Year</option>
                    <option>2nd Year</option>
                    <option>3rd Year</option>
                    <option>4th Year</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Graduation *</label>
                  <select
                    name="graduation"
                    value={formData.graduation}
                    onChange={handleInputChange}
                    className={
                      "form-control" + (isInvalid("graduation") ? " error" : "")
                    }
                  >
                    <option value="">Select your graduation</option>
                    <option>2024</option>
                    <option>2025</option>
                    <option>2026</option>
                    <option>2027</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="upload-label">Upload Resume *</label>
                <div
                  className={
                    "upload-box" +
                    (uploadedFile ? " has-file" : "") +
                    (triedSubmit && !uploadedFile ? " error" : "")
                  }
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    validateAndSetFile(e.dataTransfer.files[0]);
                  }}
                >
                  <span className="upload-icon">☁️</span>
                  <div className="upload-text">
                    {uploadedFile
                      ? `✓ ${uploadedFile.name}`
                      : "Drag & drop your resume here, or click browse"}
                  </div>
                  <input
                    type="file"
                    hidden
                    ref={fileInputRef}
                    onChange={(e) => validateAndSetFile(e.target.files[0])}
                    accept=".pdf"
                  />
                  <button
                    className="browse-btn"
                    onClick={() =>
                      uploadedFile
                        ? setUploadedFile(null)
                        : fileInputRef.current.click()
                    }
                  >
                    {uploadedFile ? "Remove File" : "Browse Files"}
                  </button>
                  <div className="upload-hint">
                    Only PDF file is allowed • Max file size: 2MB
                  </div>
                </div>
              </div>
            </div>
            <div className="submit-area">
              <button className="submit-btn" onClick={handleSubmit}>
                SUBMIT APPLICATION
              </button>
              {showErrorMsg && (
                <span className="error-msg-text">
                  ⚠ Please complete all required fields
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="modal-overlay">
          <div className="success-modal">
            <div className="success-modal-head">
              <h2>Application Submitted!</h2>
            </div>
            <div className="success-icon">✓</div>
            <div className="success-title">Success!</div>
            <p className="success-msg">
              Your application has been submitted successfully. We will review
              your profile and get back to you shortly.
            </p>
            <button className="ok-btn" onClick={handleCloseSuccess}>
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Team Full Dialog */}
      {showTeamFull && (
        <div className="modal-overlay">
          <div className="team-full-modal">
            <div className="team-full-modal-head">
              <h2>Application Closed</h2>
              <button
                className="modal-close"
                onClick={() => setShowTeamFull(false)}
              >
                ×
              </button>
            </div>
            <div className="team-full-icon">🚫</div>
            <div className="team-full-title">Sorry, the team is full!</div>
            <p className="team-full-msg">
              This project has reached its maximum capacity of{" "}
              <strong>{MAX_STUDENTS} students</strong>. No more applications are
              being accepted at this time.
            </p>
            <button
              className="team-full-close-btn"
              onClick={() => setShowTeamFull(false)}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Project;
