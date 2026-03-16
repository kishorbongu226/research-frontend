import React from "react";
import Header from "./Header";

const About = () => {
  const css = `
  *{
    box-sizing:border-box;
    margin:0;
    padding:0;
  }

  .about-container{
    font-family:'Segoe UI', sans-serif;
    background:#f5f6fa;
    min-height:100vh;
  }

  .about-wrapper{
    max-width:1200px;
    margin:auto;
    padding:40px 20px;
  }

  /* Hero Section */

  .about-hero{
    background:rgb(130, 18, 55);
    
    padding:30px;
    margin-bottom:30px;
    border-radius:10px;
    box-shadow:0 2px 10px rgba(250, 248, 248, 0.08);
  }

  .about-hero h1{
    font-size:36px;
    margin-bottom:15px;
    
  }

  .about-hero p{
    line-height:1.7;
    color:white;
    font-size:16px;
  }

  /* Section */

  .about-section{
    background:white;
    padding:30px;
    margin-bottom:30px;
    border-radius:10px;
    box-shadow:0 2px 10px rgba(0,0,0,0.08);
  }

  .about-section h2{
    color:#801033;
    margin-bottom:15px;
    font-size:24px;
  }

  .about-section p{
    line-height:1.7;
    color:#555;
    font-size:16px;
  }

  /* Features */

  .features-grid{
    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(250px,1fr));
    gap:20px;
    margin-top:20px;
  }

  .feature-card{
    background:#fafafa;
    padding:20px;
    border-radius:8px;
    border-left:5px solid #801033;
    transition:0.3s;
  }

  .feature-card:hover{
    transform:translateY(-4px);
    box-shadow:0 5px 12px rgba(0,0,0,0.12);
  }

  .feature-card h3{
    margin-bottom:8px;
    color:#801033;
  }

  .feature-card p{
    font-size:14px;
    color:#666;
  }

  /* Footer */

  .about-footer{
    text-align:center;
    padding:30px;
    color:#777;
    font-size:14px;
  }

  @media(max-width:768px){
    .about-hero h1{
      font-size:28px;
    }

    .about-hero{
      padding:40px 25px;
    }
  }
  `;

  return (
    <div className="about-container">
      <style>{css}</style>

      <Header />

      <div className="about-wrapper">
        {/* Hero Section */}

        <div className="about-hero">
          <h1>About the Research Portal</h1>
          <p>
            The Research Project Portal is designed to streamline the management
            of academic research projects, allowing students, faculty members,
            and administrators to collaborate efficiently. The platform provides
            transparency, accessibility, and simplified project tracking within
            the university ecosystem.
          </p>
        </div>

        {/* About Section */}

        <div className="about-section">
          <h2>Our Purpose</h2>
          <p>
            This platform enables students to discover and apply for research
            opportunities across different Centres of Academic Excellence.
            Faculty members can publish projects, review applications, and
            mentor students effectively. The system simplifies the entire
            research lifecycle — from project creation to completion tracking.
          </p>
        </div>

        {/* Mission */}

        <div className="about-section">
          <h2>Mission & Vision</h2>
          <p>
            Our mission is to foster innovation and collaboration among students
            and researchers by providing a centralized digital platform for
            academic projects. We aim to empower students with opportunities to
            participate in meaningful research while enabling faculty members to
            guide and manage projects efficiently.
          </p>
        </div>

        {/* Features */}

        <div className="about-section">
          <h2>Key Features</h2>

          <div className="features-grid">
            <div className="feature-card">
              <h3>Research Opportunities</h3>
              <p>
                Students can explore various research projects across different
                academic centres and apply directly through the portal.
              </p>
            </div>

            <div className="feature-card">
              <h3>Project Management</h3>
              <p>
                Faculty members can create, monitor, and manage research
                projects while supervising student participation.
              </p>
            </div>

            <div className="feature-card">
              <h3>Application Tracking</h3>
              <p>
                Students can track their application status and view approved
                research projects in their profile dashboard.
              </p>
            </div>

            <div className="feature-card">
              <h3>Academic Collaboration</h3>
              <p>
                The system encourages collaboration between students and faculty
                members to advance academic research initiatives.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}

        <div className="about-footer">
          © 2026 Research Project Portal | Empowering Academic Innovation
        </div>
      </div>
    </div>
  );
};

export default About;
