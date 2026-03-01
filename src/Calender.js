import React, { useState } from "react";
import { AiOutlineSetting } from "react-icons/ai";
import { Menu, User, Bell } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import Logo from './Bama.png';
import "./Calender.css";

const notifications = [
  { id: 1, text: "You have upcoming activities due", time: "26 days 15 hours ago" },
  { id: 2, text: "Maintenance task completed", time: "3 days ago" },
  { id: 3, text: "New request received", time: "1 hour ago" }
];

const Calender = () => {
  const navigate = useNavigate();
  const selector = useSelector((state) => state);
  const currentDate = new Date();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const years = Array.from({ length: 7 }, (_, i) => currentDate.getFullYear() - 2 + i);

  const handleMonthChange = (event) => setSelectedMonth(parseInt(event.target.value));
  const handleYearChange = (event) => setSelectedYear(parseInt(event.target.value));

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

  const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();
  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const exportCalendar = () => {
    const data = [["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]];
    let row = [];
    for (let i = 0; i < calendarDays.length; i++) {
      row.push(calendarDays[i] || "");
      if ((i + 1) % 7 === 0) {
        data.push(row);
        row = [];
      }
    }
    if (row.length) data.push(row);

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Calendar");
    XLSX.writeFile(wb, "Calendar.xlsx");
  };

  const folder=()=>{
    navigate('/filepage-cs')
  }

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
      {/* Header */}
      <header className="header">
        <div className="left-section">
          <Menu className="menu-icon" size={28} onClick={() => setMenuOpen(!menuOpen)} />
          <div className="logo-wrapper">
            <img src={Logo} alt="logo" className="logo-image" />
          </div>
        </div>

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

        <nav className="nav">
          <ul type="none" className='nav'>
            <button className='nav-link' onClick={() => navigate('/dashboard-admin')}>Home</button>
            {selector.userDetails.position!=="End User" && <button className='nav-link' onClick={() => navigate('/stock')}>Stock</button>}
            {selector.userDetails.dept !== 'CSE' && selector.userDetails.dept !== 'ECE' && selector.userDetails.position!=="End User" && (
              <button className='nav-link' onClick={() => navigate('/maintenance')}>Maintenance</button>
            )}
            <button className='nav-link' onClick={() => navigate('/report')}>Report</button>
          </ul>
        </nav>
        <div className="space"></div>

        <div className="right-section">
          <Bell className="notification-icon" size={28} onClick={() => setNotificationsOpen(!notificationsOpen)} />
          {notificationsOpen && (
            <div className="notification-popup">
              <div className="notification-header">
                <h3>Notifications</h3>
                <AiOutlineSetting className="settings-icon" onClick={() => navigate('/noti_setting')} />
              </div>
              <div className="notification-list">
                {notifications.map((notification) => (
                  <div key={notification.id} className="notification-item">
                    <p>{notification.text}</p>
                    <span className="notification-time">{notification.time}</span>
                  </div>
                ))}
              </div>
              <button className="see-all-button" onClick={() => navigate('/notification')}>See all</button>
            </div>
          )}
        </div>

        <div>
          <User className="profile-icon" size={28} onClick={() => setProfileOpen(!profileOpen)} />
        </div>

        {profileOpen && (
          <div className="profile-popup">
            <button className="popup-item" onClick={() => navigate('/dashboard-admin')}>📊 Dashboard</button>
            <button className="popup-item" onClick={() => navigate('/profile')}>👤 Profile</button>
            <button className="popup-item" onClick={() => navigate('/news')}>📰 News</button>
            <button className="popup-item" onClick={() => navigate('/')}>🚪 Logout</button>
          </div>
        )}
      </header>

      {/* Calendar */}
      <div className="main-content-calender">
        <div className="calendar">
          <div className="controls">
            <select value={selectedMonth} onChange={handleMonthChange}>
              {months.map((month, index) => (
                <option key={index} value={index}>{month}</option>
              ))}
            </select>
            <select value={selectedYear} onChange={handleYearChange}>
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <h2 className="month-title">{months[selectedMonth]} {selectedYear}</h2>
          <table className="calendar-table">
            <thead>
              <tr>
                <th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(Math.ceil(calendarDays.length / 7))].map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {[...Array(7)].map((_, colIndex) => {
                    const day = calendarDays[rowIndex * 7 + colIndex];
                    return (
                      <td key={colIndex} className={
                        day === currentDate.getDate() &&
                        selectedMonth === currentDate.getMonth() &&
                        selectedYear === currentDate.getFullYear()
                          ? "highlight"
                          : ""
                      }>
                        {day || ""}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          {/*<button  className="Cal02" onClick={exportCalendar}>EXPORT CALENDAR</button>*/}
        </div>
      </div>
    
    <div className="app-con">
      {/* Calendar Side Panel */}
      {/* <div className="side-panel">
        <h3>Events Key</h3>
        <ul>
          <li>🔴 Hide site events</li>
          <li>🟡 Hide category events</li>
          <li>🟢 Hide course events</li>
          <li>🔵 Hide group events</li>
          <li>⚫ Hide user events</li>
        </ul>
        <div className="Month">
        <h3>Monthly View</h3>
        <div className="month-view">February 2025</div>
        <div className="month-view">March 2025</div>
      </div>
      </div> */}
      {/* Footer */}
      <footer className="footer-calender">
        <div className="footer-section">
          <h3>Contact Us</h3>
          <div className="footer-item"><label>Phone</label><span>+123 567 890</span></div>
          <div className="footer-item"><label>Email</label><span>support@maintenance.edu</span></div>
          <div className="footer-item"><label>Address</label><span>123 Campus Street, Education City</span></div>
        </div>
        <div className="footer-section">
          <h3>Office Hours</h3>
          <div className="footer-item"><span>Mon-Fri: 9:00 AM - 5:00 PM</span></div>
        </div>
      </footer>
    </div>
    </div>
  );
};

export default Calender;