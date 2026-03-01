import React, { useState } from "react";
import "./News.css";
import Logo from "./assets/Bama.png"; 
import { Bell, Menu, User, X } from "lucide-react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlineSetting } from "react-icons/ai";

const notifications = [
  { id: 1, text: "You have upcoming activities due", time: "26 days 15 hours ago" },
  { id: 2, text: "Maintenance task completed", time: "3 days ago" },
  { id: 3, text: "New request received", time: "1 hour ago" }
];

const News = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [updates, setUpdates] = useState([
    {
      title: "New Maintenance Protocol Released",
      completionDate: "2025-02-10",
      description: "Updated safety protocols for handling electrical equipment maintenance...",
    },
    {
      title: "Equipment Inspection Schedule Update",
      completionDate: "2025-02-09",
      description: "Monthly inspection schedule for heavy machinery has been revised...",
    },
  ]);

  // Form state
  const [newTitle, setNewTitle] = useState("");
  const [newCompletionDate, setNewCompletionDate] = useState("");
  const [newDescription, setNewDescription] = useState("");
  let navigate = useNavigate()
  const selector = useSelector(state=>state)
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

  // Handle Add/Edit Submit
  const handleSubmit = () => {
    if (newTitle && newCompletionDate && newDescription) {
      const newUpdate = {
        title: newTitle,
        completionDate: newCompletionDate,
        description: newDescription,
      };

      if (editIndex !== null) {
        const updatedUpdates = [...updates];
        updatedUpdates[editIndex] = newUpdate;
        setUpdates(updatedUpdates);
        setEditIndex(null);
      } else {
        setUpdates([newUpdate, ...updates]); 
      }

      setModalOpen(false);
      resetForm();
    }
  };

  // Handle Delete
  const handleDelete = () => {
    if (deleteIndex !== null) {
      setUpdates(updates.filter((_, index) => index !== deleteIndex));
      setDeleteIndex(null);
      setDeleteModalOpen(false);
    }
  };

  // Open Edit Modal
  const handleEdit = (index) => {
    const update = updates[index];
    setNewTitle(update.title);
    setNewCompletionDate(update.completionDate);
    setNewDescription(update.description);
    setEditIndex(index);
    setModalOpen(true);
  };

  // Open Delete Modal
  const handleDeleteClick = (index) => {
    setDeleteIndex(index);
    setDeleteModalOpen(true);
  };

  // Reset Form
  const resetForm = () => {
    setNewTitle("");
    setNewCompletionDate("");
    setNewDescription("");
  };

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
    <div className="app-container">
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

      <div className="news-container">
        <h2 className="news-title">Latest News</h2>
        <div className="news-card">
          <div className="news-header">
            <h3>Latest Updates</h3>
            {selector.userDetails.position!="End User" &&<button className="add-button-news" onClick={() => { setModalOpen(true); resetForm(); }}>
              ➕ Add Update
            </button>}
          </div>
          {updates.map((update, index) => (
            <div key={index} className="news-item-news">
              <div className="news-content">
                <h4 className="title-news">{update.title}</h4>
                <p className="news-meta">Completed at: {update.completionDate}</p>
                <p className="news-description">{update.description}</p>
              </div>
              {selector.userDetails.position!="End User" &&<div className="news-actions-news">
                <FaEdit className="edit-icon-news" onClick={() => handleEdit(index)} />
                <FaTrash className="delete-icon-news" onClick={() => handleDeleteClick(index)} />
              </div>}
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="modal-overlay-news">
          <div className="modal-news">
            <div className="modal-header-news">
              <h3>{editIndex !== null ? "Edit Update" : "Add Update"}</h3>
              <X className="close-icon-news" size={24} onClick={() => setModalOpen(false)} />
            </div>
            <input
              type="text"
              placeholder="Title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="modal-input"
            />
            <input
              type="date"
              value={newCompletionDate}
              onChange={(e) => setNewCompletionDate(e.target.value)}
              className="modal-input"
            />
            <textarea
              placeholder="Description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="modal-textarea"
            />
            <button className="submit-button" onClick={handleSubmit}>
              {editIndex !== null ? "Update" : "Submit"}
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="modal-overlay-news">
          <div className="delete-modal-news">
            <h3>Are you sure you want to delete this news ?</h3>
            <div className="delete-actions-nrws">
              <button className="delete-confirm-news" onClick={handleDelete}>Yes</button>
              <button className="delete-cancel-news" onClick={() => setDeleteModalOpen(false)}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default News;