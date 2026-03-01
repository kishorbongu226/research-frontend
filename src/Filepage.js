import React, { useState, useEffect } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineMenu, AiOutlineClose, AiOutlinePlus, AiOutlineEdit, AiOutlineCheck, AiOutlineSetting } from "react-icons/ai";
import { Folder, Upload, Share, Download, Trash, Menu, User,Bell,Eye } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom"; // Import useParams to read URL parameters
import "./file_page.css";
import Logo from "./Bama.png";

const notifications = [
  { id: 1, text: "You have upcoming activities due", time: "26 days 15 hours ago" },
  { id: 2, text: "Maintenance task completed", time: "3 days ago" },
  { id: 3, text: "New request received", time: "1 hour ago" }
];




const Filepage = () => {
  const { folderName } = useParams(); // Read the folderName from URL parameters
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);

  const exampleFiles = [];

  let navigate = useNavigate()
  const [showEditDeleteButtons, setShowEditDeleteButtons] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false); // State for notification popup
  const {heading,folder_name} = useParams()
  /*const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);*/

  const selector = useSelector(state=>state)

  useEffect(() => {
    setFiles(exampleFiles);
  }, [folderName]);

  const handleStock =()=>{
    navigate('/stock')
  }
  const handleReport=()=>{
    navigate('/report')
  }
  
  const handleMain=()=>{
    navigate('/maintenance')
  }
  
  const handleHome=()=>{
    navigate('/dashboard-admin')
  }
  
  const handleProfile=()=>{
    navigate('/profile')
  }
  
  const handleInfo=()=>{
    navigate('/information')
  }
  
  const ticket=()=>{
    navigate('/ticket')
  }
  
  const news=()=>{
    navigate('/news')
  }
  
  const logout=()=>{
    navigate('/')
  }
  
  const toggleEditDeleteButtons = () => {
    setShowEditDeleteButtons(!showEditDeleteButtons);
  };
  
  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
  };
  
  const noti=()=>{
    navigate('/notification')
  }
  
  const calender=()=>{
    navigate('/calender')
  }
  
  const noti_setting=()=>{
    navigate('/noti_setting')
  }

  return (
    <div className="app-container">
      {/* Navbar */}
      <header className="header">
        <div className="left-section">
          <Menu className="menu-icon" size={28} onClick={() => setMenuOpen(!menuOpen)} />
          <div className="logo-wrapper">
            <img src={Logo} alt="logo" className="logo-image" />
          </div>
        </div>

        {/*<nav className="nav">
          {["Dashboard","Service","Report","News"].map((link, index) => (
            <a key={index} href="#" className="nav-link">
              {link}
            </a>
          ))}
        </nav>*/}

        <nav className="nav">
          <ul type="none" className='nav'>
            <button className='nav-link' onClick={handleHome}>Home</button>
            <button className='nav-link' onClick={handleStock}>Stock</button>
            {selector.userDetails.dept!=='CSE' && selector.userDetails.dept!=='ECE' && <button className='nav-link' onClick={handleMain}>Maintenance</button>}
            <button className='nav-link' onClick={handleReport}>Report</button>
            {/*<button className='nav-link' onClick={handleInfo}>Notification</button>*/}
          </ul>
        </nav>
        <div className='space'></div>

        {/*<div className="right-section">
          <User className="profile-icon" size={28} onClick={() => setProfileOpen(!profileOpen)} />
        </div>*/}

        {/* Popup Menus */}
        {menuOpen && (
          <div className="menu-popup">
          <button className="popup-item" onClick={handleHome}>📊 Dashboard</button>
          <button className="popup-item" onClick={ticket}>🎟 Ticket</button>
          <button className="popup-item" onClick={handleProfile}>👤 Profile</button>
          <button className="popup-item" onClick={news}>📰 News</button>
          <button className="popup-item" onClick={handleReport}>📜 Report</button>
          <button className="popup-item" onClick={calender}>📅 Calendar</button>
      
        </div>

        )}
        <div className="right-section">
              
              <div className="notification-wrapper">
                <Bell className="notification-icon" size={28} onClick={toggleNotifications} />
                {/* Notification Popup */}
                {notificationsOpen && (
                  <div className="notification-popup">
                    <div className="notification-header">
                      <h3>Notifications</h3>
                      <div className="notification-actions">
                        {/*<AiOutlineCheck className="tick-icon" />*/}
                        <AiOutlineSetting className="settings-icon" onClick={noti_setting}/>
                      </div>
                    </div>
                    <div className="notification-list">
                      {notifications.map((notification) => (
                        <div key={notification.id} className="notification-item">
                          <p>{notification.text}</p>
                          <span className="notification-time">{notification.time}</span>
                        </div>
                      ))}
                    </div>
                    <button className="see-all-button" onClick={noti}>See all</button>
                  </div>
                )}
              </div>
              
            </div>
            <div>
            <User className="profile-icon" size={28} onClick={() => setProfileOpen(!profileOpen)}/>
            </div>
            
        {profileOpen && (
          <div className="profile-popup">
            <button className="popup-item" onClick={handleHome}>📊 Dashboard</button>
            <button className="popup-item" onClick={handleProfile}>👤 Profile</button>
            <button className="popup-item" onClick={news}>📰 News</button>
            <button className="popup-item" onClick={logout}>🚪 Logout</button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="dashboard-container">
        <h1 className="dashboard-title">{heading}</h1><br></br>
        <h2 className="folder-title-service">{folder_name}</h2> {/* Display the folder name */}

        <div className="quick-actions">
          <div className="hamburger-menu" onClick={() => setQuickActionsOpen(!quickActionsOpen)}>
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
          </div><br></br><br></br>
          {quickActionsOpen && (
            <div className="action-buttons">
              <button className="action-btn">
                <Upload size={18} className="action-icon" /> Upload
              </button>
              <button className="action-btn">
                <Share size={18} className="action-icon" /> Share
              </button>
              <button className="action-btn">
                <Download size={18} className="action-icon" /> Download
              </button>
              {/*<button className="action-btn">
                <Eye size={18} className="action-icon" /> View
              </button>*/}
              <button className="action-btn">
                <Trash size={18} className="action-icon" /> Delete
              </button>
            </div>
          )}
        </div>

        <div className="file-container">
          {files.length > 0 ? (
            files.map((file, index) => (
              <div key={index} className="file-card">
                <Folder className="file-icon" size={20} />
                <div className="file-details">
                  <p className="file-name">{file.name}</p>
                  <p className="file-size">{file.size}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="no-files-msg">No files in this folder.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Filepage;