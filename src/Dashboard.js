import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import centerService from "./services/centerService";

const MAROON = "#800020";
const DANGER = "#c53030";
let autoId = 300;

// ─── DATA ────────────────────────────────────────────────────────────────────

const INIT_EVENTS = [
  {
    id: 1,
    title: "Annual Science Fest 2025",
    date: "2025-03-15",
    desc: "Biggest science festival with exhibitions, talks and competitions.",
  },
  {
    id: 2,
    title: "International Research Summit",
    date: "2025-04-10",
    desc: "Two-day summit bringing researchers from around the globe.",
  },
  {
    id: 3,
    title: "Innovation & Technology Expo",
    date: "2025-05-20",
    desc: "Showcasing latest innovations from student projects.",
  },
];

// ─── PENCIL SVG ──────────────────────────────────────────────────────────────

function IconPencil() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#ffffff">
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm2.92 1.08H5v-.72l9.06-9.06.72.72-8.86 8.86zM20.71 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
    </svg>
  );
}

// ─── PENCIL BUTTON + DROPDOWN ────────────────────────────────────────────────

function PencilMenu({ onAdd, onEdit, onRemove }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", flexShrink: 0 }}>
      {/* Round pencil button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="pencil-button"
        style={{
          width: 38,
          height: 38,
          borderRadius: "50%",
          backgroundColor: MAROON,
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 8px rgba(128,0,32,0.5)",
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.12)";
          e.currentTarget.style.boxShadow = "0 4px 14px rgba(128,0,32,0.6)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(128,0,32,0.5)";
        }}
        title="Edit"
      >
        <IconPencil />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            backgroundColor: "#ffffff",
            border: "1px solid #e8e8e8",
            borderRadius: 10,
            boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
            overflow: "hidden",
            minWidth: 145,
            zIndex: 99999,
          }}
        >
          <MenuItem
            icon="➕"
            label="Add"
            color="#166534"
            hover="#f0fdf4"
            onClick={() => {
              setOpen(false);
              onAdd();
            }}
          />
          <MenuItem
            icon="✏️"
            label="Edit"
            color="#1e40af"
            hover="#eff6ff"
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
          />
          <MenuItem
            icon="🗑️"
            label="Remove"
            color={DANGER}
            hover="#fff5f5"
            onClick={() => {
              setOpen(false);
              onRemove();
            }}
          />
        </div>
      )}
    </div>
  );
}

function MenuItem({ icon, label, color, hover, onClick }) {
  const [bg, setBg] = useState("#fff");
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setBg(hover)}
      onMouseLeave={() => setBg("#fff")}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 16px",
        fontSize: 13,
        fontWeight: 700,
        color,
        cursor: "pointer",
        backgroundColor: bg,
        borderBottom: "1px solid #f2f2f2",
        transition: "background-color 0.12s",
      }}
    >
      <span style={{ fontSize: 15 }}>{icon}</span>
      {label}
    </div>
  );
}

// ─── MODAL ───────────────────────────────────────────────────────────────────

function Modal({ onClose, width, children }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.55)",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="modal-container"
        style={{
          backgroundColor: "#fff",
          borderRadius: 12,
          padding: "28px 32px",
          width: width || 480,
          maxWidth: "95vw",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 20px 60px rgba(0,0,0,0.28)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function ModalTitle({ children }) {
  return (
    <h3
      className="modal-title"
      style={{
        fontSize: 17,
        fontWeight: 800,
        color: MAROON,
        marginTop: 0,
        marginBottom: 20,
        paddingBottom: 12,
        borderBottom: "2px solid #f5c6d0",
      }}
    >
      {children}
    </h3>
  );
}

function ModalBtns({ children }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        justifyContent: "flex-end",
        marginTop: 22,
        flexWrap: "wrap",
      }}
    >
      {children}
    </div>
  );
}

function Btn({ bg, color, disabled, onClick, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "9px 22px",
        borderRadius: 6,
        border: "none",
        backgroundColor: disabled ? "#bbb" : bg || "#eee",
        color: disabled ? "#fff" : color || "#333",
        fontWeight: 700,
        fontSize: 14,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {children}
    </button>
  );
}

// ─── FORM FIELD ──────────────────────────────────────────────────────────────

function Field({ label, required, error, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label
        style={{
          display: "block",
          fontWeight: 700,
          fontSize: 13,
          marginBottom: 6,
        }}
      >
        {label}
        {required && <span style={{ color: "red" }}> *</span>}
      </label>
      {children}
      {error && (
        <p style={{ color: "red", fontSize: 12, margin: "4px 0 0" }}>{error}</p>
      )}
    </div>
  );
}

function TextBox({ value, onChange, placeholder, hasError }) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: "100%",
        padding: "9px 12px",
        boxSizing: "border-box",
        border: `1.5px solid ${hasError ? "red" : "#ccc"}`,
        borderRadius: 6,
        fontSize: 14,
        outline: "none",
        fontFamily: "Arial, sans-serif",
      }}
    />
  );
}

// ─── PICK LIST ───────────────────────────────────────────────────────────────

function PickList({ items, picked, onPick, showThumb, danger }) {
  return (
    <div style={{ maxHeight: 360, overflowY: "auto", marginBottom: 10 }}>
      {items.map((item) => {
        const sel = picked?.id === item.id;
        return (
          <div
            key={item.id}
            onClick={() => onPick(item)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: 10,
              marginBottom: 8,
              border: `2px solid ${sel ? (danger ? DANGER : MAROON) : "#e0e0e0"}`,
              borderRadius: 8,
              cursor: "pointer",
              backgroundColor: sel ? (danger ? "#fff5f5" : "#fff5f7") : "#fff",
              transition: "border-color 0.15s",
            }}
          >
            {showThumb && (
              <img
                src={item.imgUrl}
                alt=""
                onError={(e) => {
                  e.target.src = `https://picsum.photos/seed/fb${item.id}/60/45`;
                }}
                style={{
                  width: 60,
                  height: 45,
                  objectFit: "cover",
                  borderRadius: 4,
                  flexShrink: 0,
                }}
              />
            )}
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#222" }}>
                {item.name}
              </div>
              {item.date && (
                <div
                  style={{
                    fontSize: 11,
                    color: MAROON,
                    fontWeight: 600,
                    marginTop: 2,
                  }}
                >
                  📅 {item.date}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── CONFIRM MODAL ───────────────────────────────────────────────────────────

function ConfirmModal({ name, onBack, onConfirm }) {
  return (
    <Modal onClose={onBack} width={420}>
      <ModalTitle>🗑️ Confirm Removal</ModalTitle>
      <p style={{ fontSize: 14, marginBottom: 8 }}>
        Are you sure you want to remove:
      </p>
      <p
        style={{
          fontSize: 14,
          fontWeight: 800,
          color: MAROON,
          lineHeight: 1.5,
          marginBottom: 16,
        }}
      >
        "{name}"
      </p>
      <p style={{ fontSize: 13, color: "#888" }}>
        This action cannot be undone.
      </p>
      <ModalBtns>
        <Btn onClick={onBack}>Back</Btn>
        <Btn bg={DANGER} color="#fff" onClick={onConfirm}>
          Yes, Remove
        </Btn>
      </ModalBtns>
    </Modal>
  );
}

// ─── CENTRE FORM ─────────────────────────────────────────────────────────────

function CentreForm({
  heading,

  name,
  setName,
  centerId,
  setCenterId,
  description,
  setDescription,

  file,
  setFile,
  preview,
  setPreview,

  errors,
  onSave,
  onClose,
}) {
  const handleFile = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  return (
    <Modal onClose={onClose}>
      <ModalTitle>{heading}</ModalTitle>

      <Field label="Center Name" required error={errors.name}>
        <TextBox
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter center name"
          hasError={!!errors.name}
        />
      </Field>

      <Field label="Center ID" required error={errors.centerId}>
        <TextBox
          value={centerId}
          onChange={(e) => setCenterId(e.target.value)}
          placeholder="Enter unique center ID"
          hasError={!!errors.centerId}
        />
      </Field>

      <Field label="Description" required error={errors.description}>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "6px",
            border: errors.description ? "1px solid red" : "1px solid #ccc",
          }}
        />
      </Field>

      <Field label="Project Image" required error={errors.file}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          style={{ marginBottom: "8px" }}
        />

        {preview && (
          <img
            src={preview}
            alt="preview"
            style={{
              width: "100%",
              height: "150px",
              objectFit: "cover",
              borderRadius: "8px",
              marginTop: "10px",
            }}
          />
        )}
      </Field>

      <ModalBtns>
        <Btn onClick={onClose}>Cancel</Btn>
        <Btn bg={MAROON} color="#fff" onClick={onSave}>
          Save
        </Btn>
      </ModalBtns>
    </Modal>
  );
}

// ─── EVENT FORM ──────────────────────────────────────────────────────────────

function EventForm({
  heading,
  title,
  setTitle,
  date,
  setDate,
  desc,
  setDesc,
  errors,
  onSave,
  onClose,
}) {
  return (
    <Modal onClose={onClose}>
      <ModalTitle>{heading}</ModalTitle>

      <Field label="Event Title" required error={errors.title}>
        <TextBox
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter event title"
          hasError={!!errors.title}
        />
      </Field>

      <Field label="Event Date" required error={errors.date}>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{
            width: "100%",
            padding: "9px 12px",
            boxSizing: "border-box",
            border: `1.5px solid ${errors.date ? "red" : "#ccc"}`,
            borderRadius: 6,
            fontSize: 14,
            outline: "none",
          }}
        />
        {errors.date && (
          <p style={{ color: "red", fontSize: 12, marginTop: 4 }}>
            {errors.date}
          </p>
        )}
      </Field>

      <Field label="Description">
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          rows={3}
          placeholder="Brief description..."
          style={{
            width: "100%",
            padding: "9px 12px",
            boxSizing: "border-box",
            border: "1.5px solid #ccc",
            borderRadius: 6,
            fontSize: 14,
            outline: "none",
            fontFamily: "Arial, sans-serif",
            resize: "vertical",
          }}
        />
      </Field>

      <ModalBtns>
        <Btn onClick={onClose}>Cancel</Btn>
        <Btn bg={MAROON} color="#fff" onClick={onSave}>
          Save
        </Btn>
      </ModalBtns>
    </Modal>
  );
}

// ─── SECTION HEADER BAR ──────────────────────────────────────────────────────

function SectionBar({ title, rightSlot }) {
  return (
    <div
      className="section-bar"
      style={{
        backgroundColor: "#fff",
        padding: "10px 20px",
        marginBottom: 20,
        borderLeft: `5px solid ${MAROON}`,
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <span
        className="section-title-text"
        style={{ fontSize: 18, fontWeight: 800, color: MAROON }}
      >
        {title}
      </span>
      {rightSlot}
    </div>
  );
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────

export default function Dashboard() {
  const auth = JSON.parse(sessionStorage.getItem("auth"));
  const isAdmin = auth?.role === "Admin";
  console.log(isAdmin)
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const handleCentreClick = (centerId) => {
    navigate(`/centres/${centerId}`);
  };

  const [centres, setCentres] = useState([]);
  useEffect(() => {
    fetchCenters();
  }, []);

  const fetchCenters = async () => {
    try {
      const response = await centerService.getCenters();
      setCentres(response.data);
    } catch (error) {
      console.error("Error fetching centers", error);
    }
  };
  const [events, setEvents] = useState(INIT_EVENTS);

  const [modal, setModal] = useState(null);
  const [picked, setPicked] = useState(null);

  // Centre form state
  const [name, setName] = useState("");
  const [centerId, setCenterId] = useState("");
  const [description, setDescription] = useState("");
  const [projectStatus, setProjectStatus] = useState("PROJECTS_AVAILABLE");
  const [professorId, setProfessorId] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [cErrors, setCErrors] = useState({});

  // Event form state
  const [eTitle, setETitle] = useState("");
  const [eDate, setEDate] = useState("");
  const [eDesc, setEDesc] = useState("");
  const [eErrors, setEErrors] = useState({});

  // ── Centre operations ──────────────────────────────────────────────────────
  const closeC = () => {
    setModal(null);
    setPicked(null);
    setName("");
    setCenterId("");
    setDescription("");
    setProjectStatus("PROJECTS_AVAILABLE");
    setProfessorId("");
    setFile(null);
    setPreview("");
    setCErrors({});
  };

  const openCentreAdd = () => {
    setName("");
    setCenterId("");
    setDescription("");
    setProjectStatus("PROJECTS_AVAILABLE");
    setProfessorId("");
    setFile(null);
    setPreview("");
    setCErrors({});
    setPicked(null);
    setModal("c-add");
  };
  const openCentreEditPick = () => {
    setPicked(null);
    setModal("c-edit-pick");
  };
  const openCentreRemovePick = () => {
    setPicked(null);
    setModal("c-remove-pick");
  };

  const pickCentreForEdit = (c) => {
    setPicked(c);
    setName(c.name);
    setCenterId(c.centerId);
    setDescription(c.description);
    setProjectStatus(c.projectStatus);
    setProfessorId(c.professorId || "");
    setPreview(c.imgUrl);
    setCErrors({});
    setModal("c-edit-form");
  };

  const validateCentre = () => {
    const e = {};
    if (!name.trim()) e.name = "Center name is required.";
    if (!centerId.trim()) e.centerId = "Center ID is required.";
    if (!description.trim()) e.description = "Description is required.";

    if (!file && !preview) e.file = "Image is required.";
    setCErrors(e);
    return Object.keys(e).length === 0;
  };

  const saveCentreAdd = async () => {
    if (!validateCentre()) return;

    const centerData = {
      name: name,
      centerId: centerId,
      description: description,
    };

    try {
      await centerService.createCenter(centerData, file);
      fetchCenters();
      closeC();
    } catch (error) {
      console.error(error);
      alert("Error creating center");
    }
  };

  const saveCentreEdit = async () => {
    if (!validateCentre()) return;

    const centerData = {
      name: name,
      centerId: centerId,
      description: description,
    };

    try {
      await centerService.updateCenter(picked.centerId, centerData, file);
      fetchCenters();
      closeC();
    } catch (error) {
      console.error(error);
    }
  };

  const doRemoveCentre = async () => {
    try {
      await centerService.deleteCenter(picked.centerId);
      fetchCenters();
      closeC();
    } catch (error) {
      console.error(error);
    }
  };

  // ── Event operations ───────────────────────────────────────────────────────
  const closeE = () => {
    setModal(null);
    setPicked(null);
    setETitle("");
    setEDate("");
    setEDesc("");
    setEErrors({});
  };

  const openEventAdd = () => {
    setETitle("");
    setEDate("");
    setEDesc("");
    setEErrors({});
    setPicked(null);
    setModal("e-add");
  };
  const openEventEditPick = () => {
    setPicked(null);
    setModal("e-edit-pick");
  };
  const openEventRemovePick = () => {
    setPicked(null);
    setModal("e-remove-pick");
  };

  const pickEventForEdit = (ev) => {
    setPicked(ev);
    setETitle(ev.title);
    setEDate(ev.date);
    setEDesc(ev.desc);
    setEErrors({});
    setModal("e-edit-form");
  };

  const validateEvent = () => {
    const e = {};
    if (!eTitle.trim()) e.title = "Event title is required.";
    if (!eDate.trim()) e.date = "Event date is required.";
    setEErrors(e);
    return Object.keys(e).length === 0;
  };

  const saveEventAdd = () => {
    if (!validateEvent()) return;
    setEvents((prev) => [
      ...prev,
      { id: ++autoId, title: eTitle.trim(), date: eDate, desc: eDesc.trim() },
    ]);
    closeE();
  };

  const saveEventEdit = () => {
    if (!validateEvent()) return;
    setEvents((prev) =>
      prev.map((ev) =>
        ev.id === picked.id
          ? { ...ev, title: eTitle.trim(), date: eDate, desc: eDesc.trim() }
          : ev,
      ),
    );
    closeE();
  };

  const doRemoveEvent = () => {
    setEvents((prev) => prev.filter((ev) => ev.id !== picked.id));
    closeE();
  };

  const scroll = (dir) =>
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -320 : 320,
      behavior: "smooth",
    });

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      {/* ══════════════════════ RESPONSIVE STYLES ══════════════════════ */}
      <style>{`
        @media (max-width: 768px) {
          .main-content {
            max-width: 100% !important;
            padding: 0 12px !important;
            margin: 12px auto !important;
          }
          
          .section-bar {
            padding: 8px 14px !important;
          }
          
          .section-title-text {
            font-size: 15px !important;
          }
          
          .carousel-container {
            margin-bottom: 24px !important;
          }
          
          .carousel-item {
            min-width: 240px !important;
            height: 140px !important;
          }
          
          .scroll-button {
            width: 32px !important;
            height: 32px !important;
            font-size: 20px !important;
            left: -12px !important;
          }
          
          .scroll-button-right {
            right: -12px !important;
          }
          
          .content-layout {
            flex-direction: column !important;
          }
          
          .grid-area {
            flex: 1 !important;
          }
          
          .centres-grid {
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)) !important;
            gap: 12px !important;
          }
          
          .centre-card {
            padding: 8px !important;
          }
          
          .centre-card-img {
            height: 100px !important;
          }
          
          .centre-card-tag {
            font-size: 9px !important;
          }
          
          .centre-card-title {
            font-size: 10px !important;
          }
          
          .events-sidebar {
            width: 100% !important;
            margin-top: 30px !important;
          }
          
          .events-title {
            font-size: 18px !important;
          }
          
          .event-card {
            padding: 12px !important;
            margin-bottom: 12px !important;
          }
          
          .event-card-title {
            font-size: 12px !important;
          }
          
          .pencil-button {
            width: 32px !important;
            height: 32px !important;
          }
          
          .modal-container {
            padding: 20px 18px !important;
          }
          
          .modal-title {
            font-size: 15px !important;
          }
        }
        
        @media (max-width: 480px) {
          .centres-grid {
            grid-template-columns: 1fr !important;
          }
          
          .carousel-item {
            min-width: 200px !important;
            height: 120px !important;
          }
          
          .section-title-text {
            font-size: 13px !important;
          }
        }
      `}</style>

      <Header />

      {/* ════════════════ CENTRE MODALS ════════════════ */}

      {modal === "c-add" && (
        <CentreForm
          heading="➕ Add New Centre"
          name={name}
          setName={setName}
          centerId={centerId}
          setCenterId={setCenterId}
          description={description}
          setDescription={setDescription}
          projectStatus={projectStatus}
          setProjectStatus={setProjectStatus}
          professorId={professorId}
          setProfessorId={setProfessorId}
          file={file}
          setFile={setFile}
          preview={preview}
          setPreview={setPreview}
          errors={cErrors}
          onSave={saveCentreAdd}
          onClose={closeC}
        />
      )}

      {modal === "c-edit-pick" && (
        <Modal onClose={closeC} width={520}>
          <ModalTitle>✏️ Select Centre to Edit</ModalTitle>
          <PickList
            items={centres}
            picked={picked}
            onPick={(c) => setPicked(c)}
            showThumb
          />
          <ModalBtns>
            <Btn onClick={closeC}>Cancel</Btn>
            <Btn
              bg={MAROON}
              color="#fff"
              disabled={!picked}
              onClick={() => picked && pickCentreForEdit(picked)}
            >
              Next ›
            </Btn>
          </ModalBtns>
        </Modal>
      )}

      {modal === "c-edit-form" && (
        <CentreForm
          heading="✏️ Edit Centre"
          name={name}
          setName={setName}
          centerId={centerId}
          setCenterId={setCenterId}
          description={description}
          setDescription={setDescription}
          projectStatus={projectStatus}
          setProjectStatus={setProjectStatus}
          professorId={professorId}
          setProfessorId={setProfessorId}
          file={file}
          setFile={setFile}
          preview={preview}
          setPreview={setPreview}
          errors={cErrors}
          onSave={saveCentreEdit}
          onClose={closeC}
        />
      )}

      {modal === "c-remove-pick" && (
        <Modal onClose={closeC} width={520}>
          <ModalTitle>🗑️ Select Centre to Remove</ModalTitle>
          <PickList
            items={centres}
            picked={picked}
            onPick={(c) => setPicked(c)}
            showThumb
            danger
          />
          <ModalBtns>
            <Btn onClick={closeC}>Cancel</Btn>
            <Btn
              bg={DANGER}
              color="#fff"
              disabled={!picked}
              onClick={() => picked && setModal("c-remove-confirm")}
            >
              Remove Selected
            </Btn>
          </ModalBtns>
        </Modal>
      )}

      {modal === "c-remove-confirm" && (
        <ConfirmModal
          name={picked?.name}
          onBack={() => setModal("c-remove-pick")}
          onConfirm={doRemoveCentre}
        />
      )}

      {/* ════════════════ EVENT MODALS ════════════════ */}

      {modal === "e-add" && (
        <EventForm
          heading="➕ Add New Event"
          title={eTitle}
          setTitle={setETitle}
          date={eDate}
          setDate={setEDate}
          desc={eDesc}
          setDesc={setEDesc}
          errors={eErrors}
          onSave={saveEventAdd}
          onClose={closeE}
        />
      )}

      {modal === "e-edit-pick" && (
        <Modal onClose={closeE} width={520}>
          <ModalTitle>✏️ Select Event to Edit</ModalTitle>
          <PickList
            items={events}
            picked={picked}
            onPick={(ev) => setPicked(ev)}
          />
          <ModalBtns>
            <Btn onClick={closeE}>Cancel</Btn>
            <Btn
              bg={MAROON}
              color="#fff"
              disabled={!picked}
              onClick={() => picked && pickEventForEdit(picked)}
            >
              Next ›
            </Btn>
          </ModalBtns>
        </Modal>
      )}

      {modal === "e-edit-form" && (
        <EventForm
          heading="✏️ Edit Event"
          title={eTitle}
          setTitle={setETitle}
          date={eDate}
          setDate={setEDate}
          desc={eDesc}
          setDesc={setEDesc}
          errors={eErrors}
          onSave={saveEventEdit}
          onClose={closeE}
        />
      )}

      {modal === "e-remove-pick" && (
        <Modal onClose={closeE} width={520}>
          <ModalTitle>🗑️ Select Event to Remove</ModalTitle>
          <PickList
            items={events}
            picked={picked}
            onPick={(ev) => setPicked(ev)}
            danger
          />
          <ModalBtns>
            <Btn onClick={closeE}>Cancel</Btn>
            <Btn
              bg={DANGER}
              color="#fff"
              disabled={!picked}
              onClick={() => picked && setModal("e-remove-confirm")}
            >
              Remove Selected
            </Btn>
          </ModalBtns>
        </Modal>
      )}

      {modal === "e-remove-confirm" && (
        <ConfirmModal
          name={picked?.title}
          onBack={() => setModal("e-remove-pick")}
          onConfirm={doRemoveEvent}
        />
      )}

      {/* ════════════════ PAGE CONTENT ════════════════ */}
      <main
        className="main-content"
        style={{ maxWidth: "90%", margin: "20px auto", padding: "0 20px" }}
      >
        {/* Recently Viewed Centres */}
        <SectionBar title="RECENTLY VIEWED CENTRES" />

        <div
          className="carousel-container"
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            marginBottom: 40,
          }}
        >
          <button
            onClick={() => scroll("left")}
            className="scroll-button"
            style={{
              position: "absolute",
              left: -20,
              zIndex: 10,
              backgroundColor: "#fff",
              border: "none",
              borderRadius: "50%",
              width: 40,
              height: 40,
              fontSize: 26,
              cursor: "pointer",
              boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ‹
          </button>

          <div
            ref={scrollRef}
            style={{
              display: "flex",
              overflowX: "hidden",
              gap: 20,
              padding: "10px 5px",
              width: "100%",
            }}
          >
            {centres.slice(0, 5).map((c) => (
              <div
                key={c.id}
                onClick={() => handleCentreClick(c.centerId)}
                className="carousel-item"
                // onClick={}
                style={{
                  minWidth: 300,
                  height: 180,
                  borderRadius: 4,
                  flexShrink: 0,
                  overflow: "hidden",
                }}
              >
                <img
                  src={c.imgUrl}
                  alt={c.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="scroll-button scroll-button-right"
            style={{
              position: "absolute",
              right: -20,
              zIndex: 10,
              backgroundColor: "#fff",
              border: "none",
              borderRadius: "50%",
              width: 40,
              height: 40,
              fontSize: 26,
              cursor: "pointer",
              boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ›
          </button>
        </div>

        {/* Centres Overview — pencil on right */}
        <SectionBar
          title="CENTRES OVERVIEW"
          rightSlot={
            isAdmin && (
              <PencilMenu
                onAdd={openCentreAdd}
                onEdit={openCentreEditPick}
                onRemove={openCentreRemovePick}
              />
            )
          }
        />

        <div className="content-layout" style={{ display: "flex", gap: 30 }}>
          {/* Cards grid */}
          <div className="grid-area" style={{ flex: 3 }}>
            <div
              className="centres-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: 20,
              }}
            >
              {centres.map((c) => (
                <div
                  key={c.id}
                  onClick={() => handleCentreClick(c.centerId)}
                  className="centre-card"
                  style={{
                    backgroundColor: "#fff",
                    padding: 10,
                    borderRadius: 4,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <img
                    src={c.imgUrl}
                    alt={c.name}
                    onError={(e) => {
                      e.target.src = `https://picsum.photos/seed/fb${c.id}/220/130`;
                    }}
                    className="centre-card-img"
                    style={{
                      width: "100%",
                      height: 130,
                      objectFit: "cover",
                      marginBottom: 8,
                      borderRadius: 3,
                      display: "block",
                    }}
                  />
                  <span
                    className="centre-card-tag"
                    style={{
                      display: "block",
                      color: "#ff4d4d",
                      fontSize: 10,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      marginBottom: 4,
                    }}
                  >
                    Project Available
                  </span>
                  <h3
                    className="centre-card-title"
                    style={{
                      fontSize: 11,
                      lineHeight: 1.5,
                      fontWeight: 600,
                      margin: 0,
                    }}
                  >
                    {c.name}
                  </h3>
                </div>
              ))}
            </div>
          </div>

          {/* ── EVENTS SIDEBAR ── */}
          <aside
            className="events-sidebar"
            style={{
              width: 280,
              flexShrink: 0,
              backgroundColor: "#fdfdfd",
              padding: 20,
              borderRadius: 4,
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              alignSelf: "flex-start",
            }}
          >
            {/* EVENTS heading row with pencil icon */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 16,
                paddingBottom: 12,
                borderBottom: `2px solid ${MAROON}`,
              }}
            >
              <h2
                className="events-title"
                style={{
                  color: MAROON,
                  fontSize: 20,
                  fontWeight: 800,
                  margin: 0,
                }}
              >
                EVENTS
              </h2>

              {/* ← pencil button for events */}
              {isAdmin && (
                <PencilMenu
                  onAdd={openEventAdd}
                  onEdit={openEventEditPick}
                  onRemove={openEventRemovePick}
                />
              )}
            </div>

            {events.length === 0 && (
              <p
                style={{
                  color: "#aaa",
                  fontSize: 13,
                  textAlign: "center",
                  padding: "20px 0",
                }}
              >
                No events yet.
                <br />
                Click the pencil icon to add one.
              </p>
            )}

            {events.map((ev) => (
              <div
                key={ev.id}
                className="event-card"
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid #eee",
                  borderRadius: 8,
                  padding: 14,
                  marginBottom: 14,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                }}
              >
                <div
                  className="event-card-title"
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: MAROON,
                    marginBottom: 6,
                    lineHeight: 1.4,
                  }}
                >
                  {ev.title}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "#555",
                    fontWeight: 600,
                    marginBottom: 6,
                  }}
                >
                  📅 {ev.date}
                </div>
                {ev.desc && (
                  <div style={{ fontSize: 11, color: "#666", lineHeight: 1.6 }}>
                    {ev.desc}
                  </div>
                )}
              </div>
            ))}
          </aside>
        </div>
      </main>
    </div>
  );
}
