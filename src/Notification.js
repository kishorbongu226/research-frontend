import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { AiOutlineMenu, AiOutlineClose, AiOutlinePlus, AiOutlineEdit, AiOutlineCheck, AiOutlineSetting } from "react-icons/ai";
import { Folder, Upload, Share, Download, Trash, Menu, User,Bell,Settings } from "lucide-react";
import { useSelector } from "react-redux";
import Logo from './Bama.png';
//import Logo from "./assets/Sathyaa.png";
import DefaultProfileIcon from "./assets/profile.jpg";
import "./Notification.css";
import { useNavigate } from "react-router-dom";

const notifications = [
  { id: 1, text: "You have upcoming activities due", time: "26 days 15 hours ago" },
  { id: 2, text: "Maintenance task completed", time: "3 days ago" },
  { id: 3, text: "New request received", time: "1 hour ago" }
];

const Notification = () => {
  let navigate = useNavigate()
  const selector = useSelector(state=>state)
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setProfileImage(imageURL);
    }
  };
  const [showEditDeleteButtons, setShowEditDeleteButtons] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false); // State for notification popup
  /*const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);*/

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
    if (selector.userDetails.position=="End User"){
      navigate('/enduser')
    }
    else{
      navigate('/dashboard-admin')
    }
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
    <div className="app-container-noti">
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
            {selector.userDetails.position!=="End User" && <button className='nav-link' onClick={handleStock}>Stock</button>}
            {selector.userDetails.dept!=='CSE' && selector.userDetails.dept!=='ECE' && selector.userDetails.position!=="End User" && <button className='nav-link' onClick={handleMain}>Maintenance</button>}
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
          {selector.userDetails.position!=="End User" && <button className="popup-item" onClick={ticket}>🎟 Ticket</button>}
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

      <div className="noti-div">
        <p className="Noti">No Notifiction</p>
      </div>
      
      
      <footer className="footer-noti">
        <div className="footer-section">
          <h3>Contact Us</h3>
          <div className="footer-item">
            <label>Phone</label>
            <span>+123 567 890</span>
          </div>
          <div className="footer-item">
            <label>Email</label>
            <span>support@maintenance.edu</span>
          </div>
          <div className="footer-item">
            <label>Address</label>
            <span>123 Campus Street, Education City</span>
          </div>
        </div>
        <div className="footer-section">
          <h3>Office Hours</h3>
          <div className="footer-item">
            <span>Mon-Fri: 9:00 AM - 5:00 PM</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Notification;