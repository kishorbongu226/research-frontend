import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  Bell,
  User,
  Heart,
  ChevronRight,
  Pencil,
  X,
  Plus,
  Trash2,
  ImagePlus,
} from "lucide-react";
import Header from "./Header";
import staff from "./assets/staff.png";
import nano from "./assets/nano.jpg";
import nano_p from "./assets/nano-project.jpg";
import frozen from "./assets/frozen.jpg";
import sensor from "./assets/sensor.jpg";
import solar from "./assets/solar.jpg";
import { Check } from "lucide-react";
import { useParams } from "react-router-dom";
import centerService from "./services/centerService";
import projectService from "./services/projectService";
import professorService from "./services/professorService";
import facilityService from "./services/facilityService";

// Comprehensive mock data

// ─── Edit Dialog ─────────────────────────────────────────────────────────────
// const EditDialog = ({ centreData, teamProfiles, onSave, onClose }) => {
//   const [title, setTitle] = useState(centreData.name);
//   const [descriptions, setDescriptions] = useState([...centreData.description]);
//   const [logoPreview, setLogoPreview] = useState(centreData.lead.image);
//   const [profiles, setProfiles] = useState(teamProfiles.map((p) => ({ ...p })));
//   const [activeTab, setActiveTab] = useState("general");
//   const logoInputRef = useRef(null);
//   const profileImgRefs = useRef({});

//   const handleLogoChange = (e) => {
//     const file = e.target.files[0];
//     if (file) setLogoPreview(URL.createObjectURL(file));
//   };

//   const handleDescChange = (idx, val) => {
//     const updated = [...descriptions];
//     updated[idx] = val;
//     setDescriptions(updated);
//   };

//   const addDescription = () => setDescriptions([...descriptions, ""]);
//   const removeDescription = (idx) =>
//     setDescriptions(descriptions.filter((_, i) => i !== idx));

//   const handleProfileChange = (id, field, value) =>
//     setProfiles(
//       profiles.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
//     );

//   const handleProfileImgChange = (id, e) => {
//     const file = e.target.files[0];
//     if (file) handleProfileChange(id, "image", URL.createObjectURL(file));
//   };

//   const addProfile = () => {
//     setProfiles([
//       ...profiles,
//       {
//         id: Date.now(),
//         name: "",
//         designation: "",
//         image:
//           "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fit=crop&w=300&h=300",
//       },
//     ]);
//   };

//   const removeProfile = (id) =>
//     setProfiles(profiles.filter((p) => p.id !== id));

//   const handleSave = () => {
//     onSave({ title, descriptions, logoPreview, profiles });
//     onClose();
//   };

//   const tabs = [
//     { id: "general", label: "📝 General Info" },
//     { id: "logo", label: "🖼 Logo / Image" },
//     { id: "team", label: "👥 Team Profiles" },
//   ];

//   return (
//     <>
//       <div
//         className="dialog-overlay"
//         onClick={(e) => e.target === e.currentTarget && onClose()}
//       >
//         <div className="dialog-box">
//           {/* Header */}
//           <div className="dialog-header">
//             <div className="dialog-header-text">
//               <h2>Edit Centre</h2>
//               <p>Editing: {centreData.name}</p>
//             </div>
//             <button className="dialog-close-btn" onClick={onClose}>
//               <X size={16} />
//             </button>
//           </div>

//           {/* Tabs */}
//           <div className="dialog-tabs">
//             {tabs.map((t) => (
//               <button
//                 key={t.id}
//                 className={`dialog-tab${activeTab === t.id ? " active" : ""}`}
//                 onClick={() => setActiveTab(t.id)}
//               >
//                 {t.label}
//               </button>
//             ))}
//           </div>

//           {/* Body */}
//           <div className="dialog-body">
//             {/* ── General Info ── */}
//             {activeTab === "general" && (
//               <>
//                 <div className="form-group">
//                   <label className="form-label">Centre Title</label>
//                   <input
//                     className="form-input"
//                     value={title}
//                     onChange={(e) => setTitle(e.target.value)}
//                     placeholder="Enter centre title"
//                   />
//                 </div>

//                 <div className="form-group">
//                   <label className="form-label">Description Paragraphs</label>
//                   {descriptions.map((desc, idx) => (
//                     <div className="desc-block" key={idx}>
//                       <textarea
//                         className="form-input form-textarea"
//                         value={desc}
//                         onChange={(e) => handleDescChange(idx, e.target.value)}
//                         placeholder={`Paragraph ${idx + 1}`}
//                       />
//                       {descriptions.length > 1 && (
//                         <button
//                           className="icon-btn danger"
//                           onClick={() => removeDescription(idx)}
//                         >
//                           <Trash2 size={15} />
//                         </button>
//                       )}
//                     </div>
//                   ))}
//                   <button className="add-btn" onClick={addDescription}>
//                     <Plus size={14} /> Add Paragraph
//                   </button>
//                 </div>
//               </>
//             )}

//             {/* ── Logo / Image ── */}
//             {activeTab === "logo" && (
//               <div className="form-group">
//                 <label className="form-label">Centre Logo / Lead Photo</label>
//                 <div
//                   className="logo-upload-area"
//                   onClick={() => logoInputRef.current?.click()}
//                 >
//                   <div className="logo-preview-wrap">
//                     <img
//                       src={logoPreview}
//                       alt="Logo preview"
//                       className="logo-preview-img"
//                     />
//                     <div>
//                       <div className="logo-upload-label">
//                         Click to change image
//                       </div>
//                       <div className="logo-upload-hint">
//                         Accepts <strong>JPG, PNG, WEBP</strong> · Recommended
//                         250×200px
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <input
//                   ref={logoInputRef}
//                   type="file"
//                   accept="image/*"
//                   style={{ display: "none" }}
//                   onChange={handleLogoChange}
//                 />
//               </div>
//             )}

//             {/* ── Team Profiles ── */}
//             {activeTab === "team" && (
//               <>
//                 <div className="team-edit-list">
//                   {profiles.map((profile) => (
//                     <div className="team-edit-card" key={profile.id}>
//                       <div
//                         className="team-edit-avatar-wrap"
//                         onClick={() =>
//                           profileImgRefs.current[profile.id]?.click()
//                         }
//                         title="Click to change photo"
//                       >
//                         <img
//                           src={profile.image}
//                           alt={profile.name}
//                           className="team-edit-avatar"
//                         />
//                         <div className="avatar-overlay">
//                           <ImagePlus size={18} />
//                         </div>
//                         <input
//                           ref={(el) =>
//                             (profileImgRefs.current[profile.id] = el)
//                           }
//                           type="file"
//                           accept="image/*"
//                           style={{ display: "none" }}
//                           onChange={(e) =>
//                             handleProfileImgChange(profile.id, e)
//                           }
//                         />
//                       </div>
//                       <div className="team-edit-fields">
//                         <input
//                           className="form-input"
//                           value={profile.name}
//                           onChange={(e) =>
//                             handleProfileChange(
//                               profile.id,
//                               "name",
//                               e.target.value,
//                             )
//                           }
//                           placeholder="Full name"
//                         />
//                         <input
//                           className="form-input"
//                           value={profile.designation}
//                           onChange={(e) =>
//                             handleProfileChange(
//                               profile.id,
//                               "designation",
//                               e.target.value,
//                             )
//                           }
//                           placeholder="Designation"
//                         />
//                       </div>
//                       <button
//                         className="team-remove-btn"
//                         onClick={() => removeProfile(profile.id)}
//                         title="Remove"
//                       >
//                         <Trash2 size={14} />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//                 <button
//                   className="add-btn"
//                   style={{ marginTop: 16 }}
//                   onClick={addProfile}
//                 >
//                   <Plus size={14} /> Add Team Member
//                 </button>
//               </>
//             )}
//           </div>

//           {/* Footer */}
//           <div className="dialog-footer">
//             <button className="btn-cancel" onClick={onClose}>
//               Cancel
//             </button>
//             <button className="btn-save" onClick={handleSave}>
//               Save Changes
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// ─── Facilities Edit Dialog ───────────────────────────────────────────────────

// ─── Sidebar Facilities Search Component ─────────────────────────────────────
const SidebarFacilities = ({ facilityList }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Sort: matched items first (highlighted), non-matched after
  const getSortedFacilities = () => {
    const query = searchQuery.trim().toLowerCase();
    if (!query)
      return facilityList.map((item) => ({ name: item, matched: false }));

    const matched = [];
    const unmatched = [];

    facilityList.forEach((item) => {
      if (item.toLowerCase().includes(query)) {
        matched.push({ name: item, matched: true });
      } else {
        unmatched.push({ name: item, matched: false });
      }
    });

    return [...matched, ...unmatched];
  };

  const sortedFacilities = getSortedFacilities();
  const query = searchQuery.trim().toLowerCase();
  const hasQuery = query.length > 0;
  const matchCount = sortedFacilities.filter((f) => f.matched).length;

  // Highlight matching text within a facility name
  const highlightText = (text, query) => {
    if (!query) return text;
    const index = text.toLowerCase().indexOf(query);
    if (index === -1) return text;
    return (
      <>
        {text.slice(0, index)}
        <mark
          style={{
            background: "#fff3cd",
            color: "#800020",
            fontWeight: 700,
            borderRadius: 2,
            padding: "0 2px",
          }}
        >
          {text.slice(index, index + query.length)}
        </mark>
        {text.slice(index + query.length)}
      </>
    );
  };

  return (
    <div className="facilities-section">
      <h3 className="sidebar-title">Facilities</h3>

      {/* Search Box */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Search facilities..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery ? (
          <button
            onClick={() => setSearchQuery("")}
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#718096",
              display: "flex",
              alignItems: "center",
              padding: 2,
            }}
            title="Clear search"
          >
            <X size={14} />
          </button>
        ) : (
          <svg
            className="search-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        )}
      </div>

      {/* Match count badge */}
      {hasQuery && (
        <div
          style={{
            fontSize: 11,
            color: matchCount > 0 ? "#800020" : "#718096",
            fontWeight: 600,
            marginBottom: 8,
            paddingLeft: 2,
          }}
        >
          {matchCount > 0
            ? `${matchCount} result${matchCount > 1 ? "s" : ""} found`
            : "No matching facilities"}
        </div>
      )}

      {/* Facilities List */}
      <div
        className="facilities-list"
        style={{ overflowY: "auto", maxHeight: "300px" }}
      >
        {sortedFacilities.map((facility, idx) => (
          <div
            key={idx}
            className="facility-item"
            style={
              facility.matched
                ? {
                    borderLeft: "3px solid #800020",
                    background: "#fff8f9",
                    color: "#2d3748",
                  }
                : hasQuery
                  ? { opacity: 0.45 }
                  : {}
            }
          >
            {highlightText(facility.name, query)}
          </div>
        ))}

        {/* Empty state */}
        {sortedFacilities.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "24px 8px",
              color: "#a0aec0",
              fontSize: 13,
            }}
          >
            No facilities available.
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const Centres = () => {
  const auth = JSON.parse(sessionStorage.getItem("auth"));
  const isAdmin = auth?.role === "Admin";
  const isUser = auth?.role === "User";
  const { centerId } = useParams();

  const [centerData, setCenterData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [loadingProjects, setLoadingProjects] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [showAddFacility, setShowAddFacility] = useState(false);

  const [showMoreProfiles, setShowMoreProfiles] = useState(false);
  const [showEditDropdown, setShowEditDropdown] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const editDropdownRef = useRef(null);
  const [teamProfiles, setTeamProfiles] = useState([]);

  // Facilities edit state
  const [showFacilitiesDropdown, setShowFacilitiesDropdown] = useState(false);
  const [showFacilitiesDialog, setShowFacilitiesDialog] = useState(false);
  const facilitiesDropdownRef = useRef(null);
  const [facilityList, setFacilityList] = useState([]);
  const [synthesisFacilities, setSynthesisFacilities] = useState([]);
  const [characterizationFacilities, setCharacterizationFacilities] = useState(
    [],
  );

  // Editable state (nanotechnology only)
  const fetchFacilities = async () => {
    try {
      const res = await facilityService.getFacilitiesByCenter(centerId);

      const normal = [];
      const synthesis = [];
      const characterization = [];

      res.data.forEach((f) => {
        switch (f.facilityType) {
          case "NORMAL":
            normal.push(f);
            break;
          case "SYNTHESIS":
            synthesis.push(f);
            break;
          case "CHARACTERIZATION":
            characterization.push(f);
            break;
        }
      });

      setFacilityList(normal);
      setSynthesisFacilities(synthesis);
      setCharacterizationFacilities(characterization);
    } catch (err) {
      console.error("Error fetching facilities", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const centerRes = await centerService.getCenterById(centerId);
        console.log("CENTER DETAILS:", centerRes.data);
        const projectRes = await projectService.getProjectsByCenter(centerId);
        const professorRes = await professorService.getAdminProfessors();
        setCenterData(centerRes.data);
        setProjects(projectRes.data);
        const professors = professorRes.data.map((prof) => ({
          id: prof.registerNo,
          name: prof.name,
          designation: prof.Occupation,
          image: prof.imageURL,
        }));

        setTeamProfiles(professors);
        await fetchFacilities();
      } catch (err) {
        console.error("Error loading center:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [centerId]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        editDropdownRef.current &&
        !editDropdownRef.current.contains(e.target)
      ) {
        setShowEditDropdown(false);
      }
      if (
        facilitiesDropdownRef.current &&
        !facilitiesDropdownRef.current.contains(e.target)
      ) {
        setShowFacilitiesDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchProjects = async () => {
    try {
      setLoadingProjects(true);
      const res = await projectService.getProjectsByCenter(centerId);
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleEditAction = (action) => {
    setShowEditDropdown(false);
    if (action === "edit") setShowEditDialog(true);
  };

  const handleFacilitiesAction = (action) => {
    setShowFacilitiesDropdown(false);
    if (action === "edit") setShowFacilitiesDialog(true);
  };

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (!centerData) return <div style={{ padding: 20 }}>Center not found</div>;

  return (
    <div className="page-container">
      <style>{`
        * { box-sizing: border-box; }

        /* ── Shared Dialog Styles ── */
        .dialog-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.52);
          z-index: 2000;
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
          backdrop-filter: blur(4px);
          animation: overlayIn 0.2s ease;
        }
        @keyframes overlayIn { from{opacity:0} to{opacity:1} }
        .dialog-box {
          background: white; border-radius: 20px;
          width: 100%; max-width: 780px; max-height: 90vh;
          display: flex; flex-direction: column;
          box-shadow: 0 32px 80px rgba(0,0,0,0.22);
          animation: dialogIn 0.28s cubic-bezier(0.34,1.56,0.64,1);
          overflow: hidden;
        }
        @keyframes dialogIn {
          from { opacity:0; transform:scale(0.92) translateY(20px); }
          to   { opacity:1; transform:scale(1) translateY(0); }
        }
        .dialog-header {
          display: flex; align-items: flex-start; justify-content: space-between;
          padding: 24px 28px 0; flex-shrink: 0;
        }
        .dialog-header-text h2 { font-size: 21px; font-weight: 700; color: #1a202c; margin: 0 0 4px; }
        .dialog-header-text p { font-size: 13px; color: #718096; margin: 0; }
        .dialog-close-btn {
          width: 36px; height: 36px; border-radius: 50%;
          border: 1px solid #e2e8f0; background: white;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #718096; flex-shrink: 0; transition: all 0.2s ease;
        }
        .dialog-close-btn:hover { background:#fff0f3; border-color:#800020; color:#800020; }
        .dialog-tabs {
          display: flex; gap: 4px; padding: 16px 28px 0;
          border-bottom: 2px solid #f0f0f0; flex-shrink: 0;
        }
        .dialog-tab {
          padding: 10px 18px; font-size: 13px; font-weight: 600;
          border: none; background: none; cursor: pointer; color: #718096;
          border-bottom: 2px solid transparent; margin-bottom: -2px;
          border-radius: 8px 8px 0 0; transition: all 0.2s ease;
        }
        .dialog-tab:hover { color:#800020; background:#fff5f7; }
        .dialog-tab.active { color:#800020; border-bottom-color:#800020; background:#fff5f7; }
        .dialog-body { flex: 1; overflow-y: auto; padding: 28px; }
        .form-group { margin-bottom: 24px; }
        .form-label {
          display: block; font-size: 11px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 1px; color: #4a5568; margin-bottom: 8px;
        }
        .form-input {
          width: 100%; padding: 12px 14px;
          border: 2px solid #e2e8f0; border-radius: 10px;
          font-size: 14px; color: #2d3748; outline: none;
          transition: border-color 0.2s ease; font-family: inherit; background: white;
        }
        .form-input:focus { border-color: #800020; }
        .form-textarea { resize: vertical; min-height: 90px; line-height: 1.6; }
        .desc-block { display: flex; gap: 10px; align-items: flex-start; margin-bottom: 12px; }
        .desc-block textarea { flex: 1; }
        .icon-btn {
          width: 36px; height: 36px; border-radius: 8px;
          border: 1px solid #e2e8f0; background: white;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; flex-shrink: 0; transition: all 0.2s ease; margin-top: 2px;
        }
        .icon-btn.danger { color:#e53e3e; }
        .icon-btn.danger:hover { background:#fff5f5; border-color:#e53e3e; }
        .add-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 9px 16px; background: none;
          border: 2px dashed #cbd5e0; border-radius: 10px;
          font-size: 13px; font-weight: 600; color: #718096;
          cursor: pointer; transition: all 0.2s ease;
          width: 100%; justify-content: center; margin-top: 4px; font-family: inherit;
        }
        .add-btn:hover { border-color:#800020; color:#800020; background:#fff5f7; }
        .logo-upload-area {
          border: 2px dashed #cbd5e0; border-radius: 16px;
          padding: 40px 24px; text-align: center; cursor: pointer;
          transition: all 0.2s ease; background: #fafafa;
        }
        .logo-upload-area:hover { border-color:#800020; background:#fff5f7; }
        .logo-preview-wrap { display:flex; flex-direction:column; align-items:center; gap:16px; }
        .logo-preview-img { width:180px; height:150px; border-radius:12px; object-fit:cover; box-shadow:0 4px 16px rgba(0,0,0,0.1); }
        .logo-upload-label { font-size:14px; font-weight:600; color:#2d3748; }
        .logo-upload-hint { font-size:12px; color:#718096; margin-top:4px; }
        .logo-upload-hint strong { color:#800020; }
        .team-edit-list { display:flex; flex-direction:column; gap:14px; }
        .team-edit-card {
          background:#f8f9fa; border-radius:14px; padding:16px;
          display:flex; gap:16px; align-items:flex-start;
          border:1px solid #e2e8f0; transition:border-color 0.2s ease;
        }
        .team-edit-card:hover { border-color:#cbd5e0; }
        .team-edit-avatar-wrap { position:relative; flex-shrink:0; cursor:pointer; }
        .team-edit-avatar { width:72px; height:72px; border-radius:10px; object-fit:cover; display:block; box-shadow:0 2px 8px rgba(0,0,0,0.1); }
        .avatar-overlay {
          position:absolute; inset:0; background:rgba(0,0,0,0.45);
          border-radius:10px; display:flex; align-items:center; justify-content:center;
          opacity:0; transition:opacity 0.2s ease;
        }
        .team-edit-avatar-wrap:hover .avatar-overlay { opacity:1; }
        .avatar-overlay svg { color:white; }
        .team-edit-fields { flex:1; display:flex; flex-direction:column; gap:8px; }
        .team-edit-fields .form-input { padding:9px 12px; font-size:13px; border-radius:8px; }
        .team-remove-btn {
          flex-shrink:0; width:32px; height:32px; border-radius:8px;
          border:1px solid #fbd5d5; background:#fff5f5;
          display:flex; align-items:center; justify-content:center;
          cursor:pointer; color:#e53e3e; transition:all 0.2s ease;
        }
        .team-remove-btn:hover { background:#fed7d7; border-color:#e53e3e; }
        .dialog-footer {
          display:flex; justify-content:flex-end; gap:12px;
          padding:20px 28px; border-top:1px solid #f0f0f0;
          flex-shrink:0; background:white;
        }
        .btn-cancel {
          padding:11px 24px; border:2px solid #e2e8f0; border-radius:10px;
          background:white; font-size:14px; font-weight:600; color:#4a5568;
          cursor:pointer; font-family:inherit; transition:all 0.2s ease;
        }
        .btn-cancel:hover { border-color:#cbd5e0; background:#f7fafc; }
        .btn-save {
          padding:11px 28px;
          background:linear-gradient(135deg, #800020 0%, #8b1e3f 100%);
          border:none; border-radius:10px; font-size:14px; font-weight:600;
          color:white; cursor:pointer; font-family:inherit;
          box-shadow:0 4px 12px rgba(128,0,32,0.3); transition:all 0.2s ease;
        }
        .btn-save:hover { transform:translateY(-1px); box-shadow:0 6px 16px rgba(128,0,32,0.4); }

        .page-container {
          background: linear-gradient(to bottom, #fafafa 0%, #f5f5f5 100%);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', sans-serif;
          color: #2c3e50;
          min-height: 100vh;
          margin: 0; padding: 0;
        }
        .header {
          background: linear-gradient(135deg, #8b1e3f 0%, #a52349 100%);
          color: white; padding: 16px 32px;
          display: flex; justify-content: space-between; align-items: center;
          box-shadow: 0 4px 12px rgba(139,30,63,0.15);
          position: sticky; top: 0; z-index: 100;
        }
        .header-left, .header-right { display: flex; align-items: center; gap: 24px; }
        .logo-container { font-size: 20px; font-weight: 700; letter-spacing: 0.5px; }
        .nav-links { display: flex; gap: 32px; font-size: 14px; font-weight: 500; }
        .nav-links a {
          color: rgba(255,255,255,0.9); text-decoration: none;
          text-transform: uppercase; letter-spacing: 0.5px;
          padding: 8px 0; position: relative; transition: all 0.3s ease;
        }
        .nav-links a:hover { color: white; }
        .nav-links a::after {
          content:''; position: absolute; bottom:0; left:0;
          width:0; height:2px; background:white; transition: width 0.3s ease;
        }
        .nav-links a:hover::after, .active-link::after { width: 100%; }
        .active-link { color: white; }
        .header-right svg { cursor: pointer; transition: transform 0.2s ease; }
        .header-right svg:hover { transform: scale(1.1); }

        .main-wrapper { max-width: 1400px; margin: 0 auto; padding: 40px 24px; }

        .breadcrumb-bar {
          background: #fff; padding: 12px 20px;
          font-size: 18px; font-weight: bold; color: #800020;
          margin-bottom: 20px; border-left: 5px solid #800020;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          display: flex; justify-content: space-between; align-items: center; width: 100%;
        }
        .breadcrumb-bar h2 { color: #800020; margin: 0; font-size: 18px; font-weight: bold; }

        .consultancy-form-btn {
          background: linear-gradient(135deg, #800020 0%, #8b1e3f 100%);
          color: white; border: none; border-radius: 6px;
          padding: 8px 16px; font-size: 14px; font-weight: 600; cursor: pointer;
          transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(128,0,32,0.3);
        }
        .consultancy-form-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(128,0,32,0.4); }

        .content-grid { display: grid; grid-template-columns: 1fr 340px; gap: 40px; align-items: start; }

        .faculty-card {
          background: white; border-radius: 16px; padding: 48px;
          display: flex; gap: 28px; margin-bottom: 20px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          position: relative;
        }
        .faculty-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }

        .profile-side { min-width: 200px; flex-shrink: 0; text-align: center; }
        .profile-img {
          width: 250px; height: 200px; border-radius: 12px; object-fit: cover;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin: 0 auto 20px; display: block;
        }
        .profile-side h3 { font-size: 18px; margin: 0 0 8px 0; color: #2c3e50; font-weight: 600; }
        .profile-side p { font-size: 14px; color: #7f8c8d; margin: 0 0 24px 0; }

        .view-profile-btn {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          border: none; border-radius: 24px; padding: 12px 24px;
          font-size: 13px; color: white; font-weight: 600; cursor: pointer;
          display: inline-flex; align-items: center; justify-content: center; gap: 6px;
          transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(59,130,246,0.3);
        }
        .view-profile-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(59,130,246,0.4); }
        .view-profile-btn:active { transform: translateY(0); }

        .description-side { flex: 1; }
        .description-side h1 { font-size: 28px; margin: 0 0 24px 0; color: #1a202c; font-weight: 700; line-height: 1.3; }
        .description-side p { font-size: 15px; line-height: 1.8; color: #4a5568; text-align: justify; margin-bottom: 16px; }
        .description-side p:last-child { margin-bottom: 0; }

        .section-header {
          background: linear-gradient(135deg, #8b1e3f 0%, #a52349 100%);
          padding: 16px 32px; margin-bottom: 24px; border-radius: 12px;
          box-shadow: 0 2px 8px rgba(139,30,63,0.15);
        }
        .section-header h2 {
          color: white; font-size: 18px; margin: 0;
          text-transform: uppercase; letter-spacing: 2px; font-weight: 700; text-align: left;
        }

        .projects-list { display: flex; flex-direction: column; gap: 20px; }
        .project-card {
          background: white; border-radius: 12px; display: flex; overflow: hidden;
          position: relative; box-shadow: 0 2px 12px rgba(0,0,0,0.08); transition: all 0.3s ease;
        }
        .project-card:hover { transform: translateX(8px); box-shadow: 0 4px 20px rgba(0,0,0,0.12); }
        .project-img-box { width: 200px; height: 140px; flex-shrink: 0; overflow: hidden; background: #f0f0f0; }
        .project-img-box img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease; }
        .project-card:hover .project-img-box img { transform: scale(1.05); }
        .project-info { padding: 24px; flex: 1; display: flex; flex-direction: column; justify-content: space-between; position: relative; }
        .project-info-top { display: flex; justify-content: space-between; align-items: start; gap: 16px; }
        .project-info h4 { margin: 0 0 12px 0; font-size: 20px; font-weight: 600; color: #2c3e50; text-align: left; }
        .project-info p { margin: 0; font-size: 16px; color: #7f8c8d; line-height: 1.5; text-align: left; }
        .project-info p strong { color: #4a5568; font-weight: 600; }
        .heart-icon { color: #cbd5e0; cursor: pointer; transition: all 0.3s ease; flex-shrink: 0; }
        .heart-icon:hover { color: #fc8181; transform: scale(1.2); }
        .view-more-link {
          position: absolute; bottom: 24px; right: 24px;
          color: #3b82f6; font-size: 13px; font-weight: 600;
          border: none; background: none; cursor: pointer;
          display: inline-flex; align-items: center; gap: 4px;
          padding: 8px 0; transition: gap 0.3s ease;
        }
        .view-more-link:hover { gap: 8px; text-decoration: underline; }

        .sidebar {
          background: white; padding: 32px; border-radius: 16px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.08); position: sticky; top: 100px;
        }
        .sidebar-title {
          color: #8b1e3f; font-size: 13px; font-weight: 700; letter-spacing: 2px;
          margin: 0 0 32px 0; text-align: center; text-transform: uppercase;
        }
        .sidebar-item { margin-bottom: 28px; }
        .sidebar-item:last-child { margin-bottom: 0; }
        .sidebar-img-box {
          aspect-ratio: 4/3; background: #f0f0f0; border-radius: 12px; overflow: hidden;
          margin-bottom: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); transition: transform 0.3s ease;
        }
        .sidebar-item:hover .sidebar-img-box { transform: translateY(-4px); }
        .sidebar-img-box img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease; }
        .sidebar-item:hover .sidebar-img-box img { transform: scale(1.05); }
        .sidebar-item p { font-size: 12px; font-weight: 600; text-transform: uppercase; color: #4a5568; margin: 0; text-align: center; letter-spacing: 0.5px; }

        .facilities-section { margin-bottom: 32px; }
        .search-box { position: relative; margin-bottom: 8px; }
        .search-input {
          width: 100%; padding: 12px 36px 12px 16px;
          border: 2px solid #e2e8f0; border-radius: 8px;
          font-size: 12px; outline: none; transition: border-color 0.3s ease;
          font-family: inherit;
        }
        .search-input:focus { border-color: #8b1e3f; }
        .search-icon { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: #718096; }
        .facilities-list { display: flex; flex-direction: column; gap: 8px; max-height: 300px; overflow-y: auto; padding-right: 4px; }
        .facility-item {
          padding: 12px; background: #f8f9fa; border-radius: 8px;
          transition: all 0.25s ease; cursor: pointer;
          font-size: 12px; font-weight: 500; color: #2d3748; line-height: 1.4;
          border-left: 3px solid transparent;
        }
        .facility-item:hover { background: #e2e8f0; border-left-color: #800020; transform: translateX(4px); }

        .demo-controls { position: fixed; bottom: 24px; right: 24px; display: flex; flex-direction: column; gap: 12px; z-index: 50; }
        .demo-btn {
          padding: 12px 20px; font-size: 12px; font-weight: 600; cursor: pointer;
          background: white; border: 2px solid #e2e8f0; border-radius: 8px;
          text-transform: uppercase; letter-spacing: 0.5px;
          transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .demo-btn:hover { background: #8b1e3f; color: white; border-color: #8b1e3f; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(139,30,63,0.3); }

        @media (max-width: 1200px) {
          .content-grid { grid-template-columns: 1fr; }
          .sidebar { position: relative; top: 0; }
        }
        @media (max-width: 768px) {
          .header { padding: 12px 16px; }
          .nav-links { display: none; }
          .main-wrapper { padding: 24px 16px; }
          .faculty-card { flex-direction: column; align-items: center; padding: 32px 24px; gap: 24px; }
          .profile-side { width: 100%; min-width: auto; }
          .description-side h1 { font-size: 22px; text-align: center; }
          .project-card { flex-direction: column; }
          .project-img-box { width: 100%; height: 200px; }
          .breadcrumb-bar { padding: 12px 20px; }
          .breadcrumb-bar h2 { font-size: 18px; }
          .demo-controls { bottom: 16px; right: 16px; }
        }
        @media (max-width: 480px) {
          .faculty-card { padding: 24px 16px; }
          .section-header { padding: 12px 20px; }
          .sidebar { padding: 24px 16px; }
        }

        .facilities-section {
          background: white; border-radius: 16px; padding: 32px;
          margin-bottom: 40px; box-shadow: 0 4px 16px rgba(0,0,0,0.08);
        }
        .facilities-title { font-size: 24px; font-weight: 700; color: #2c3e50; margin: 0 0 24px 0; }
        .facilities-cards {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 24px; margin-bottom: 40px;
        }
        .facility-card-main {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  max-height: 260px;
  overflow-y: auto;
}
  .facility-card-main::-webkit-scrollbar {
  width: 5px;
}

.facility-card-main::-webkit-scrollbar-thumb {
  background: #800020;
  border-radius: 4px;
}
        .facility-card-main:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); border-color: #8b1e3f; }
        .facility-card-main .facility-icon { font-size: 48px; margin-bottom: 16px; display: block; }
        .facility-card-main h4 { font-size: 18px; font-weight: 600; color: #2c3e50; margin: 0 0 12px 0; }
        .facility-card-main p { font-size: 14px; color: #7f8c8d; line-height: 1.6; margin: 0; }
        @media (max-width: 768px) { .facilities-cards { grid-template-columns: 1fr; } }

        .team-section {
          background: white; border-radius: 16px; padding: 32px;
          margin-bottom: 40px; box-shadow: 0 4px 16px rgba(0,0,0,0.08);
        }
        .team-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-bottom: 24px; }
        .team-card {
          background: #f8f9fa; border-radius: 12px; padding: 24px; text-align: center;
          transition: all 0.3s ease; border: 1px solid #e2e8f0;
          width: 100%;
          height: 260px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          box-sizing: border-box;
          overflow: hidden;
        }
        .team-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); border-color: #8b1e3f; }
        .team-profile-img {
          width: 120px; height: 120px;
          border-radius: 12px; object-fit: cover;
          flex-shrink: 0;
          margin: 0 0 16px 0;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          display: block;
        }
        .team-name {
          font-size: 15px; font-weight: 600; color: #2c3e50;
          margin: 0 0 6px 0;
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .team-designation {
          font-size: 13px; color: #7f8c8d; margin: 0; line-height: 1.4;
          width: 100%;
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
        @media (max-width: 900px) { .team-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px) { .team-grid { grid-template-columns: repeat(2, 1fr); } }
        .more-btn-container { text-align: center; padding-top: 16px; }
        .more-btn {
          background: linear-gradient(135deg, #800020 0%, #8b1e3f 100%);
          color: white; border: none; border-radius: 8px; padding: 12px 32px;
          font-size: 14px; font-weight: 600; cursor: pointer;
          transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(128,0,32,0.3);
        }
        .more-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(128,0,32,0.4); }
        .hidden-profiles { overflow: hidden; max-height: 0; opacity: 0; transition: max-height 0.5s ease, opacity 0.3s ease; }
        .hidden-profiles.expanded { max-height: 1000px; opacity: 1; }

        .floating-project-btn {
          position: fixed; bottom: 30px; right: 30px; height: 50px;
          background: linear-gradient(135deg, #800020 0%, #8b1e3f 100%);
          border: none; border-radius: 25px; color: white;
          font-size: 14px; font-weight: 600; cursor: pointer;
          box-shadow: 0 4px 12px rgba(128,0,32,0.3);
          transition: all 0.3s ease; z-index: 1000;
          display: flex; align-items: center; justify-content: center; padding: 0 20px;
        }
        .floating-project-btn:hover { transform: scale(1.05); box-shadow: 0 6px 16px rgba(128,0,32,0.4); }
        .floating-project-btn:active { transform: scale(0.98); }
        @media (max-width: 768px) {
          .floating-project-btn { bottom: 20px; right: 20px; min-width: 100px; height: 45px; font-size: 12px; padding: 0 16px; border-radius: 22px; }
        }

        /* Edit icon + dropdown */
        .card-edit-wrapper { position: absolute; top: 16px; right: 16px; z-index: 10; }
        .card-edit-btn {
          width: 32px; height: 32px; border-radius: 8px;
          border: 1px solid #e2e8f0; background: white;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: #718096;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08); transition: all 0.2s ease;
        }
        .card-edit-btn:hover { background: #f7f7f7; color: #800020; border-color: #800020; }
        .card-edit-dropdown {
          position: absolute; top: calc(100% + 6px); right: 0;
          background: white; border: 1px solid #e2e8f0; border-radius: 10px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12); min-width: 140px; overflow: hidden;
          animation: dropdownFadeIn 0.15s ease;
        }
        @keyframes dropdownFadeIn {
          from { opacity:0; transform:translateY(-6px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .card-edit-dropdown button {
          display: block; width: 100%; padding: 10px 16px;
          text-align: left; background: none; border: none;
          font-size: 13px; font-weight: 500; color: #2d3748;
          cursor: pointer; transition: background 0.15s ease;
        }
        .card-edit-dropdown button:hover { background: #f7f7f7; }
        .card-edit-dropdown button.remove-action { color: #e53e3e; }
        .card-edit-dropdown button.remove-action:hover { background: #fff5f5; }
        .card-edit-dropdown hr { margin: 0; border: none; border-top: 1px solid #e2e8f0; }

        /* Scrollbar styling for facilities list */
        .facilities-list::-webkit-scrollbar { width: 4px; }
        .facilities-list::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; }
        .facilities-list::-webkit-scrollbar-thumb { background: #cbd5e0; border-radius: 4px; }
        .facilities-list::-webkit-scrollbar-thumb:hover { background: #800020; }
      `}</style>

      {/* Edit Dialog */}

      {/* Facilities Edit Dialog */}

      {/* Page Header */}
      <Header />

      <div className="main-wrapper">
        <div className="breadcrumb-bar">
          <h2>CENTRES OF ACADEMIC EXCELLENCE</h2>
        </div>

        <div className="content-grid">
          <div className="main-col">
            {/* Faculty Card */}
            <div className="faculty-card">
              <div className="profile-side">
                <img
                  src={centerData.imgUrl}
                  alt={centerData.centerName}
                  className="profile-img"
                />
              </div>
              <div className="description-side">
                <h1>{centerData.centerName}</h1>
                <p>{centerData.centerDescription}</p>
              </div>
            </div>
            {/* <div style={{ marginTop: 20 }}>
              <h3>Director Details</h3>
              <p>
                <strong>Name:</strong> {centerData.professorName}
              </p>
              <p>
                <strong>Occupation:</strong> {centerData.professorOccupation}
              </p>
            </div> */}

            {/* Team Profiles */}
            <div className="team-section">
              <div className="team-grid">
                {teamProfiles.slice(0, 4).map((profile) => (
                  <div
                    key={profile.id}
                    className="team-card"
                    onClick={() => navigate(`/profile/${profile.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={profile.image}
                      alt={profile.name}
                      className="team-profile-img"
                    />
                    <h3 className="team-name">{profile.name}</h3>
                    <p className="team-designation">{profile.designation}</p>
                  </div>
                ))}
              </div>
              <div
                className={`hidden-profiles ${showMoreProfiles ? "expanded" : ""}`}
              >
                <div className="team-grid">
                  {teamProfiles.slice(4).map((profile) => (
                    <div
                      key={profile.id}
                      className="team-card"
                      onClick={() => navigate(`/profile/${profile.id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <img
                        src={profile.image}
                        alt={profile.name}
                        className="team-profile-img"
                      />
                      <h3 className="team-name">{profile.name}</h3>
                      <p className="team-designation">{profile.designation}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="more-btn-container">
                <button
                  className="more-btn"
                  onClick={() => setShowMoreProfiles(!showMoreProfiles)}
                >
                  {showMoreProfiles ? "Show Less" : "More"}
                </button>
              </div>
            </div>

            {/* Facilities */}
            <div
              className="breadcrumb-bar"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <h2>FACILITIES</h2>

              {isAdmin && (
                <button
                  className="more-btn"
                  style={{ padding: "6px 16px" }}
                  onClick={() => setShowAddFacility(true)}
                >
                  + Add Facility
                </button>
              )}
            </div>
            <div className="facilities-cards">
              {/* Synthesis Facilities */}
              <div className="facility-card-main">
                <h4>Synthesis Facilities</h4>

                {synthesisFacilities.map((f) => (
                  <div
                    key={f.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 6,
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <Check size={16} color="#2f855a" />
                      {f.facilityName}
                    </span>

                    {/* {isAdmin && (
                      <button
                        style={{
                          color: "red",
                          border: "none",
                          background: "none",
                          cursor: "pointer",
                        }}
                        onClick={async () => {
                          await facilityService.deleteFacility(f.id);
                          fetchFacilities();
                        }}
                      >
                        ✕
                      </button>
                    )} */}
                  </div>
                ))}
              </div>

              {/* Characterization Facilities */}
              <div className="facility-card-main">
                <h4>Characterization Facilities</h4>

                {characterizationFacilities.map((f) => (
                  <div
                    key={f.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 6,
                    }}
                  >
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <Check size={16} color="#2f855a" />
                      {f.facilityName}
                    </span>

                    {/* {isAdmin && (
                      <button
                        style={{
                          color: "red",
                          border: "none",
                          background: "none",
                          cursor: "pointer",
                        }}
                        onClick={async () => {
                          await facilityService.deleteFacility(f.id);
                          fetchFacilities();
                        }}
                      >
                        ✕
                      </button>
                    )} */}
                  </div>
                ))}
              </div>
            </div>

            {/* Projects */}
            <div className="breadcrumb-bar">
              <h2>PROJECTS</h2>
            </div>
            <div className="projects-list" id="projects-list">
              {loadingProjects ? (
                <p>Loading projects...</p>
              ) : projects.length === 0 ? (
                <p>No projects available</p>
              ) : (
                projects.map((proj) => (
                  <div key={proj.projectId} className="project-card">
                    <div className="project-img-box">
                      <img src={proj.imageUrl} alt={proj.title} />
                    </div>
                    <div className="project-info">
                      <div className="project-info-top">
                        <div>
                          <h4>{proj.title}</h4>
                          <p>
                            <strong>Skills Required:</strong>{" "}
                            {proj.skillRequirements}
                          </p>

                          <p>
                            <strong>Status:</strong>{" "}
                            <span
                              style={{
                                padding: "4px 10px",
                                borderRadius: "12px",
                                fontSize: "12px",
                                fontWeight: "600",
                                background:
                                  proj.projectStatus === "ONGOING"
                                    ? "#fffbea"
                                    : "#edf2f7",
                                color:
                                  proj.projectStatus === "ONGOING"
                                    ? "#b7791f"
                                    : "#4a5568",
                              }}
                            >
                              {proj.projectStatus}
                            </span>
                          </p>
                        </div>
                        <Heart size={20} className="heart-icon" />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                          marginTop: "12px",
                        }}
                      >
                        <button
                          className="view-more-link"
                          style={{ position: "static" }}
                          onClick={() => navigate(`/project/${proj.projectId}`)}
                        >
                          View More →
                        </button>

                        {isAdmin && proj.projectStatus !== "COMPLETED" && (
                          <button
                            style={{
                              padding: "6px 12px",
                              borderRadius: "6px",
                              border: "none",
                              background: "#2f855a",
                              color: "white",
                              fontSize: "12px",
                              cursor: "pointer",
                            }}
                            onClick={async () => {
                              try {
                                await projectService.markProjectCompleted(
                                  proj.projectId,
                                );
                                fetchProjects();
                              } catch (err) {
                                console.error(err);
                              }
                            }}
                          >
                            Mark Completed
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sidebar — uses the new SidebarFacilities component */}
          <aside className="sidebar">
            <SidebarFacilities
              facilityList={facilityList.map((f) => f.facilityName)}
            />

            <h3 className="sidebar-title" style={{ marginTop: "40px" }}>
              Recent Successful Projects
            </h3>
          </aside>
        </div>
      </div>

      <div className="demo-controls"></div>

      {isAdmin && (
        <button
          className="floating-project-btn"
          onClick={() => setShowAddProject(true)}
        >
          + Add Project
        </button>
      )}
      {showAddProject && (
        <AddProjectDialog
          centerId={centerId}
          onClose={() => setShowAddProject(false)}
          onSuccess={fetchProjects}
        />
      )}

      {showAddFacility && (
        <AddFacilityDialog
          onClose={() => setShowAddFacility(false)}
          onSave={async (name, type) => {
            try {
              await facilityService.addFacility({
                centerId,
                facilityName: name,
                facilityType: type,
              });

              fetchFacilities();
              setShowAddFacility(false);
            } catch (err) {
              console.error(err);
              alert("Error adding facility");
            }
          }}
        />
      )}
    </div>
  );
};
const AddProjectDialog = ({ centerId, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    projectId: "",
    title: "",
    description: "",
    responsibilities: "",
    skillRequirements: "",
  });

  const [file, setFile] = useState(null);

  const handleSubmit = async () => {
    try {
      await projectService.createProject({ ...form, centerId }, file);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error adding project");
    }
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <div className="dialog-header">
          <h2>Add Project</h2>
          <button className="dialog-close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="dialog-body">
          <input
            className="form-input"
            placeholder="Project ID"
            onChange={(e) => setForm({ ...form, projectId: e.target.value })}
          />
          <input
            className="form-input"
            placeholder="Title"
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <textarea
            className="form-input form-textarea"
            placeholder="Description"
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input
            className="form-input"
            placeholder="Skill Requirements"
            onChange={(e) =>
              setForm({ ...form, skillRequirements: e.target.value })
            }
          />
          <input
            className="form-input"
            placeholder="responsibilities"
            onChange={(e) =>
              setForm({ ...form, responsibilities: e.target.value })
            }
          />
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        </div>

        <div className="dialog-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-save" onClick={handleSubmit}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
const AddFacilityDialog = ({ onClose, onSave }) => {
  const [name, setName] = useState("");
  const [type, setType] = useState("NORMAL");

  const handleSave = () => {
    if (!name.trim()) {
      alert("Facility name required");
      return;
    }

    onSave(name, type);
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <div className="dialog-header">
          <h2>Add Facility</h2>
          <button className="dialog-close-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="dialog-body">
          <input
            className="form-input"
            placeholder="Facility Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <select
            className="form-input"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="NORMAL">Normal</option>
            <option value="SYNTHESIS">Synthesis</option>
            <option value="CHARACTERIZATION">Characterization</option>
          </select>
        </div>

        <div className="dialog-footer">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>

          <button className="btn-save" onClick={handleSave}>
            Add
          </button>
        </div>
      </div>
    </div>
  );
};
export default Centres;
