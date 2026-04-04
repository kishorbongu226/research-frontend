import React, { useState, useRef, useEffect } from "react";
import sathya from "./assets/sathayabama.png";
import { useNavigate } from "react-router-dom";
import applicationService from "./services/applicationService";

const formatLocalIsoDate = (date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const Header = () => {
  const auth = JSON.parse(sessionStorage.getItem("auth") || "{}");
  const role = auth?.role;
  const isStudent = role === "End-User";
  const registerNo = auth?.username;
  const seenApprovalsKey = "seenApprovalNotifications";
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const hamburgerRef = useRef(null);
  const [approvalCount, setApprovalCount] = useState(0);
  const todayIso = formatLocalIsoDate(new Date());

  const goToProfile = () => {
    if (role === "Admin") {
      navigate("/adminProfile");
    } else {
      navigate("/profile");
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    localStorage.removeItem(seenApprovalsKey);
    setApprovalCount(0);
    setSidebarOpen(false);
    window.dispatchEvent(new Event("approvalNotificationsUpdated"));
    navigate("/", { replace: true });
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(e.target)
      ) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  useEffect(() => {
    const updateApprovalCount = async () => {
      if (!isStudent || !registerNo) {
        setApprovalCount(0);
        return;
      }

      try {
        const response =
          await applicationService.getStudentApplications(registerNo);
        const approvedIds = (response.data || [])
          .filter(
            (application) =>
              application.status === "APPROVED" &&
              application.slotDate &&
              application.slotDate >= todayIso,
          )
          .map((application) => application.applicationId);

        const seen = JSON.parse(localStorage.getItem(seenApprovalsKey) || "[]");
        const unseenCount = approvedIds.filter((id) => !seen.includes(id)).length;
        setApprovalCount(unseenCount);
      } catch (error) {
        console.error("Failed to fetch approval notifications:", error);
      }
    };

    updateApprovalCount();
    window.addEventListener("approvalNotificationsUpdated", updateApprovalCount);

    return () => {
      window.removeEventListener(
        "approvalNotificationsUpdated",
        updateApprovalCount,
      );
    };
  }, [isStudent, registerNo, todayIso]);

  const styles = {
    container: {
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f5f5f5",
      margin: 0,
      padding: 0,
      color: "#333",
    },
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0,0,0,0.4)",
      zIndex: 998,
      opacity: sidebarOpen ? 1 : 0,
      pointerEvents: sidebarOpen ? "all" : "none",
      transition: "opacity 0.3s ease",
    },
    sidebar: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "260px",
      height: "100vh",
      backgroundColor: "#fff",
      zIndex: 999,
      display: "flex",
      flexDirection: "column",
      boxShadow: "4px 0 20px rgba(0,0,0,0.15)",
      transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
      transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    },
    sidebarHeader: {
      backgroundColor: "rgb(130, 18, 55)",
      color: "white",
      padding: "20px 20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      minHeight: "80px",
    },
    sidebarLogo: {
      height: "45px",
    },
    closeBtn: {
      background: "none",
      border: "none",
      color: "white",
      fontSize: "24px",
      cursor: "pointer",
      padding: "4px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "4px",
      lineHeight: 1,
    },
    sidebarNav: {
      flex: 1,
      padding: "16px 0",
      overflowY: "auto",
    },
    sidebarItem: {
      display: "flex",
      alignItems: "center",
      gap: "14px",
      padding: "14px 24px",
      fontSize: "15px",
      fontWeight: "500",
      color: "#333",
      cursor: "pointer",
      textDecoration: "none",
      transition: "background 0.15s, color 0.15s",
      borderLeft: "3px solid transparent",
    },
    sidebarItemHover: {
      backgroundColor: "#fdf0f3",
      color: "rgb(130, 18, 55)",
      borderLeft: "3px solid rgb(130, 18, 55)",
    },
    sidebarIcon: {
      width: "20px",
      height: "20px",
      fill: "currentColor",
      flexShrink: 0,
    },
    sidebarFooter: {
      padding: "16px 0",
      borderTop: "1px solid #eee",
    },
    logoutItem: {
      display: "flex",
      alignItems: "center",
      gap: "14px",
      padding: "14px 24px",
      fontSize: "15px",
      fontWeight: "500",
      color: "#e53935",
      cursor: "pointer",
      transition: "background 0.15s",
      borderLeft: "3px solid transparent",
    },
    header: {
      backgroundColor: "rgb(130, 18, 55)",
      color: "white",
      padding: "10px 40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 1000,
      boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
    },
    logoSection: {
      display: "flex",
      alignItems: "center",
      gap: "15px",
    },
    logo: {
      height: "60px",
    },
    hamburger: {
      fontSize: "26px",
      cursor: "pointer",
      background: "none",
      border: "none",
      color: "white",
      padding: "4px",
      display: "flex",
      alignItems: "center",
      borderRadius: "4px",
      transition: "background 0.15s",
    },
    nav: {
      display: "flex",
      gap: "25px",
      alignItems: "center",
    },
    navItem: {
      color: "white",
      textDecoration: "none",
      fontWeight: "500",
      fontSize: "14px",
      textTransform: "uppercase",
      cursor: "pointer",
    },
    iconGroup: {
      display: "flex",
      gap: "15px",
      alignItems: "center",
    },
  };

  const navItems = isStudent
    ? [
        {
          label: "My Status",
          path: "/request",
          icon: (
            <svg style={styles.sidebarIcon} viewBox="0 0 24 24">
              <path d="M19 3H5a2 2 0 0 0-2 2v14l4-3h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm-8 9H7v-2h4v2zm6-4H7V6h10v2z" />
            </svg>
          ),
        },
        {
          label: "Calendar",
          path: "/request",
          icon: (
            <svg style={styles.sidebarIcon} viewBox="0 0 24 24">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
            </svg>
          ),
        },
      ]
    : [
        {
          label: "Application",
          path: "/application",
          icon: (
            <svg style={styles.sidebarIcon} viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z" />
            </svg>
          ),
        },
        {
          label: "Calendar",
          path: "/application",
          icon: (
            <svg style={styles.sidebarIcon} viewBox="0 0 24 24">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
            </svg>
          ),
        },
        {
          label: "Students",
          path: "/application",
          icon: (
            <svg style={styles.sidebarIcon} viewBox="0 0 24 24">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            </svg>
          ),
        },
      ];

  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <div style={styles.container}>
      <div style={styles.overlay} />

      <div ref={sidebarRef} style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <img
            src={sathya}
            alt="Sathyabama Logo"
            style={styles.sidebarLogo}
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/160x45?text=SATHYABAMA";
            }}
          />
          <button style={styles.closeBtn} onClick={() => setSidebarOpen(false)}>
            x
          </button>
        </div>

        <nav style={styles.sidebarNav}>
          {navItems.map((item, index) => (
            <div
              key={index}
              onClick={() => {
                navigate(item.path);
                setSidebarOpen(false);
              }}
              style={{
                ...styles.sidebarItem,
                ...(hoveredItem === index ? styles.sidebarItemHover : {}),
              }}
              onMouseEnter={() => setHoveredItem(index)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {item.icon}
              {item.label}
            </div>
          ))}
        </nav>

        <div style={styles.sidebarFooter}>
          <div
            onClick={handleLogout}
            style={{
              ...styles.logoutItem,
              ...(hoveredItem === "logout"
                ? {
                    backgroundColor: "#fff5f5",
                    borderLeft: "3px solid #e53935",
                  }
                : {}),
            }}
            onMouseEnter={() => setHoveredItem("logout")}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <svg
              style={{ ...styles.sidebarIcon, fill: "#e53935" }}
              viewBox="0 0 24 24"
            >
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
            </svg>
            Log Out
          </div>
        </div>
      </div>

      <header style={styles.header}>
        <div style={styles.logoSection}>
          <button
            ref={hamburgerRef}
            style={styles.hamburger}
            onClick={() => setSidebarOpen((prev) => !prev)}
          >
            =
          </button>
          <img
            src={sathya}
            alt="Sathyabama Logo"
            style={styles.logo}
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/200x60?text=SATHYABAMA";
            }}
          />
        </div>
        <nav style={styles.nav}>
          <a href="/dashboard" style={styles.navItem}>
            Home
          </a>
          <a href="/about" style={styles.navItem}>
            About
          </a>
          <a href="/projects" style={styles.navItem}>
            Project
          </a>
          <div onClick={goToProfile}>
            <svg
              style={{ cursor: "pointer", fill: "white" }}
              width="28"
              height="28"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
          <div style={styles.iconGroup}>
            <div
              onClick={() => {
                if (isStudent) {
                  navigate("/request");
                }
              }}
              style={{ position: "relative", cursor: isStudent ? "pointer" : "default" }}
            >
              <svg
                style={{ cursor: isStudent ? "pointer" : "default", fill: "white" }}
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
              </svg>
              {isStudent && approvalCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-6px",
                    right: "-8px",
                    minWidth: "18px",
                    height: "18px",
                    borderRadius: "999px",
                    background: "#f7c948",
                    color: "#5b0f26",
                    fontSize: "11px",
                    fontWeight: "800",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 5px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                  }}
                  title="Upcoming approved meeting slots"
                >
                  {approvalCount}
                </span>
              )}
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Header;
