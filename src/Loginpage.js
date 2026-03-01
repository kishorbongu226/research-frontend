// import { useState } from "react";
// import "./Login.css"; // Import CSS
// import bgImage from "./college-bg.jpg"; // Background image
// import collegeLogo from "./college-logo.png"; // Example path for college logo
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { User } from "./Redux/Action";
// //import Dashboard from "./Dashboard";

// function Loginpage(props){
  
//   const [showPopup, setShowPopup] = useState(false);
//   const [showPasswordReset, setShowPasswordReset] = useState(false);
//   const [position, setPosition] = useState('');
//   const [name,setName] = useState('')
//   const [dept,setDept] = useState('') 
//   let dispatch = useDispatch()
//   //dispatch(login({ position, name, dept }));

//   let navigate = useNavigate()
//   const handleNewUserClick = () => {
//     setShowPopup(true);
//     setShowPasswordReset(false); // Reset password reset view
//   };

//   const handlePasswordResetClick = () => {
//     setShowPasswordReset(true);
//   };

//   const handleClosePopup = () => {
//     setShowPopup(false);
//   };

//   const handleSubmit = (e)=>{
//     e.preventDefault();
//     dispatch(User({name:name,dept:dept,position:position}))
//     console.log({name:name})
//     console.log(dept)
//     console.log(position)
    
//     if (position==='Admin'){
//       navigate('/dashboard-admin')
//     }
//     else if (position==='Management'){
//       navigate('/dashboard-management')
//     }
//     else if (position==='Super Admin'){
//       navigate('/dashboard-super')
//     }
//     else if (position==='End User'){
//       navigate('/enduser')
//     }
//     /*var f = document.getElementById('option1').value
//     console.log(f)*/
//   }

//   return (
//     <div className="main-container" style={{ backgroundImage: `url(${bgImage})` }}>
//       <div className="overlay"></div>
//       <div className="login-box">
//         {/* College Banner */}
//         <div className="college-banner">
//           <img src={collegeLogo} alt="College Logo" className="college-logo" />
//           <div className="college-text">
//             <h1 className="college-title">SATHYABAMA</h1>
//             <hr className="title-underline" />
//             <h2 className="college-subtitle">INSTITUTE OF SCIENCE AND TECHNOLOGY</h2>
//             <p className="college-desc">(DEEMED TO BE UNIVERSITY)</p>
//             <p className="college-category">CATEGORY - 1 UNIVERSITY BY UGC</p>
//           </div>
//         </div>

//         {/* Login Form */}
//         <h2 className="form-title">Management System</h2>

//         <div className="input-group">
//           <select className="input-field" onChange={(e) => setPosition(e.target.value)} value={position}> {/**/}
//             <option className='option2' id="option2"  value="/">select an option</option>
//             <option className='option2' id="option2"  value="Super Admin">Super Admin</option>
//             <option className='option1' id="option1"  value="Management" >Management</option>
//             <option className='option3' id="option3"  value="Admin">Admin</option>
//             <option className='option4' id="option4"  value="End User">End User</option>
//           </select>
//         </div>

//         <div className="input-group">
//           <label>Employee Number</label>
//           <input type="text" className="input-field" placeholder="Enter Register Number" onChange={(e)=>{setName(e.target.value)}}/>
//         </div>

//         <div className="input-group">
//           <label>Password</label>
//           <input type="password" className="input-field" placeholder="Enter Password" onChange={(e)=>{setDept(e.target.value)}}/>
//         </div>

//         <button type='sumbit' className="login-btn" onClick={handleSubmit}>LOG IN</button> 

//         {/* Links Section */}
//         <div className="links">
//           <a href="#" className="link">Forgot your password?</a>
//           <a href="#" className="link" onClick={handleNewUserClick}>New User</a>
//         </div>
//       </div>

//       {/* Popup for New User Registration or Password Reset */}
//       {showPopup && (
//         <div className="popup">
//           <div className="popup-content">
//             <span className="close-btn" onClick={handleClosePopup}>&times;</span>
//             <h2>{showPasswordReset ? "Reset Password" : "New User Registration"}</h2>

//             {!showPasswordReset ? (
//               <>
//                 <div className="input-group">
//                   <label>Name</label>
//                   <input type="text" className="input-field" placeholder="Enter Full Name" />
//                 </div>

//                 <div className="input-group">
//                   <label>Employee Number</label>
//                   <input type="text" className="input-field" placeholder="Enter Employee Number" />
//                 </div>

//                 <div className="input-group">
//                   <label>Password</label>
//                   <input type="password" className="input-field" value="defaultpassword" readOnly />
//                 </div>

//                 <button className="submit-btn" onClick={handlePasswordResetClick}>Submit</button>
//               </>
//             ) : (
//               <>
//                 <div className="input-group">
//                   <label>New Password</label>
//                   <input type="password" className="input-field" placeholder="Enter New Password" />
//                 </div>

//                 <div className="input-group">
//                   <label>Confirm Password</label>
//                   <input type="password" className="input-field" placeholder="Confirm New Password" />
//                 </div>

//                 <button className="submit-btn" onClick={() => {
//                   alert("Password updated successfully!");
//                   handleClosePopup();
//                 }}>Submit</button>
//               </>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Loginpage;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import bgImage from "./college-bg.jpg";
import collegeLogo from "./college-logo.png";
import { useDispatch } from "react-redux";
import { User } from "./Redux/Action";

function Loginpage() {
    const [userID, setUserID] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState(''); // ✅ Added for success messages
    const navigate = useNavigate();
    // let dispatch = useDispatch()

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        navigate('/dashboard');

        // if (!userID || !password || !role) {
        //     setError("⚠️ All fields are required.");
        //     return;
        // }

        // try {
        //     const response = await axios.post('http://localhost:5001/', { userID, password, role });

        //     if (response.data.status === 'default_password') {
        //         window.alert("⚠️ Your password is default. Please reset it."); // ✅ Show alert first
        //         setError("⚠️ Your password is default. Please reset it."); // ✅ Still set error for UI display
        //         return;
        //     }
    

        //     if (response.data.status === 'success') {
        //         dispatch(User({name:userID,dept:response.data.position,position:response.data.role}))
        //         console.log(response.data)
        //         localStorage.setItem("userData", JSON.stringify(response.data));
        //         setMessage("✅ Login successful! Redirecting...");

        //         setTimeout(() => { // ✅ Added delay for better UX
        //             switch (response.data.role) {
        //                 case "Admin":
        //                     navigate('/dashboard-admin');
        //                     break;
        //                 case "Super-Admin":
        //                     navigate('/dashboard-super');
        //                     break;
        //                 case "Management":
        //                     navigate('/dashboard-management');
        //                     break;
        //                 case "End-User":
        //                     navigate('/enduser');
        //                     break;
        //                 default:
        //                     setError("⚠️ Invalid role selected.");
        //                     return;
        //             }
        //         }, 1000);
        //     }
        // } catch (err) {
        //     setError(err.response?.data?.error || "⚠️ Server error. Please try again.");
        // }
    };

    return (
        <div className="main-container" style={{ backgroundImage: `url(${bgImage})` }}>
            <div className="overlay"></div>
            <div className="login-box">
                <div className="college-banner">
                    <img src={collegeLogo} alt="College Logo" className="college-logo" />
                    <div className="college-text">
                        <h1 className="college-title">SATHYABAMA</h1>
                        <hr className="title-underline" />
                        <h2 className="college-subtitle">INSTITUTE OF SCIENCE AND TECHNOLOGY</h2>
                        <p className="college-desc">(DEEMED TO BE UNIVERSITY)</p>
                        <p className="college-category">CATEGORY - 1 UNIVERSITY BY UGC</p>
                    </div>
                </div>

                <h2 className="form-title">Management System</h2>

                {error && <p className="error-message">{error}</p>} {/* ✅ Shows error messages */}
                {message && <p className="success-message">{message}</p>} {/* ✅ Shows success messages */}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Role</label>
                        <select className="input-field" onChange={(e) => setRole(e.target.value)} value={role} required>
                            <option value="">Select Role</option>
                            <option value="Super-Admin">Admin</option>
                            <option value="Management">Staff</option>
                            <option value="Admin">Scientist</option>
                            <option value="End-User">Student</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <label>Gmail</label>
                        <input
                            type="gmail"
                            className="input-field"
                            placeholder="Enter your gmail"
                            onChange={(e) => setUserID(e.target.value)}
                            value={userID}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            className="input-field"
                            placeholder="Enter Password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            required
                        />
                    </div>

                    <button type="submit" className="login-btn">LOG IN</button>
                </form>
            </div>
        </div>
    );
}

export default Loginpage;

