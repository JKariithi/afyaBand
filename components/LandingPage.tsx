import React from 'react';

interface LandingPageProps {
  onNavigateDashboard: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigateDashboard }) => {
  return (
    <>
      <style>{`
        /* Embedded Styles from style.css */
        
        /* Navigation */
        .afya-navbar {
          background: #1976D2;
          padding: 1.2rem 0;
          position: fixed;
          width: 100%;
          top: 0;
          z-index: 1000;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .afya-nav-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 3rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .afya-logo {
          font-size: 1.8rem;
          font-weight: 700;
          color: #fff;
        }

        .afya-nav-menu {
          list-style: none;
          display: flex;
          gap: 3rem;
          margin: 0;
        }

        .afya-nav-menu a {
          color: white;
          text-decoration: none;
          font-size: 1.1rem;
          font-weight: 500;
          transition: opacity 0.3s;
          cursor: pointer;
        }

        .afya-nav-menu a:hover {
          opacity: 0.8;
        }
        
        /* Hero Section */
        .afya-hero {
          background: linear-gradient(135deg, #1976D2 0%, #0D47A1 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding: 100px 3rem 4rem;
        }

        .afya-hero-container {
          max-width: 1400px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .afya-hero-title {
          font-size: 3.5rem;
          color: white;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 2rem;
        }

        .afya-yellow-text {
          color: #FDD835;
        }

        .afya-hero-description {
          font-size: 1.2rem;
          color: white;
          line-height: 1.8;
          margin-bottom: 3rem;
        }

        .afya-btn-light {
          padding: 1rem 3rem;
          background: #E3F2FD;
          color: #1976D2;
          border: none;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.3s;
        }

        .afya-btn-light:hover {
          transform: translateY(-2px);
        }

        .afya-watch-image {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .afya-watch-image img {
          width: 100%;
          max-width: 360px;
          height: auto;
          border-radius: 22px;
          box-shadow: 0 15px 45px rgba(0, 0, 0, 0.25);
          transition: transform 0.4s ease, box-shadow 0.4s ease;
        }

        .afya-watch-image img:hover {
          transform: translateY(-6px) scale(1.03);
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.35);
        }

        /* About Section */
        .afya-about-section {
          padding: 6rem 3rem;
          background: #E3F2FD;
        }

        .afya-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .afya-section-title {
          text-align: center;
          font-size: 2.8rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #000;
        }

        .afya-section-subtitle {
          text-align: center;
          font-size: 1.2rem;
          color: #666;
          margin-bottom: 4rem;
        }

        .afya-problem-solution-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          margin-bottom: 6rem;
        }

        .afya-card {
          padding: 2.5rem;
          border-radius: 15px;
          border: 3px solid;
        }

        .afya-card h3 {
          font-size: 1.6rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: #000;
        }

        .afya-card ul {
          list-style: none;
          padding: 0;
        }

        .afya-card li {
          padding: 0.8rem 0 0.8rem 1.5rem;
          font-size: 1.05rem;
          line-height: 1.6;
          position: relative;
          color: #000;
        }

        .afya-card li::before {
          content: "•";
          position: absolute;
          left: 0;
          font-size: 1.5rem;
          font-weight: bold;
        }

        .afya-problem-card {
          background: linear-gradient(135deg, #FFE082 0%, #FFB3C1 100%);
          border-color: #FF6B9D;
        }

        .afya-solution-card {
          background: linear-gradient(135deg, #80DEEA 0%, #66BB6A 100%);
          border-color: #4CAF50;
        }

        /* Features Section */
        .afya-features-section {
          margin-top: 4rem;
        }

        .afya-features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2.5rem;
          margin-top: 3rem;
        }

        .afya-feature-card {
          background: white;
          padding: 2.5rem 2rem;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          transition: transform 0.3s;
        }

        .afya-feature-card:hover {
          transform: translateY(-5px);
        }

        .afya-feature-icon {
          width: 70px;
          height: 70px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .afya-blue-bg { background: #E3F2FD; color: #1976D2; }
        .afya-pink-bg { background: #FCE4EC; color: #E91E63; }
        .afya-purple-bg { background: #F3E5F5; color: #9C27B0; }
        .afya-yellow-bg { background: #FFF9C4; color: #F57F17; }
        .afya-green-bg { background: #E8F5E9; color: #4CAF50; }
        .afya-light-blue-bg { background: #E1F5FE; color: #0288D1; }

        .afya-feature-card h3 {
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 0.8rem;
          color: #000;
        }

        .afya-feature-card p {
          font-size: 1rem;
          color: #666;
          line-height: 1.6;
        }

        /* How It Works Section */
        .afya-how-it-works {
          padding: 6rem 3rem;
          background: #F5F5F5;
        }

        .afya-dark-title { color: #000; }
        .afya-dark-subtitle { color: #666; }

        .afya-steps-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
          margin: 4rem 0;
        }

        .afya-step-card {
          background: white;
          padding: 2.5rem 2rem;
          border-radius: 15px;
          text-align: center;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          position: relative;
        }

        .afya-step-number {
          position: absolute;
          top: -15px;
          right: 20px;
          background: #1976D2;
          color: white;
          width: 45px;
          height: 45px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1.1rem;
        }

        .afya-step-icon-circle {
          width: 80px;
          height: 80px;
          background: #E3F2FD;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 1rem auto;
        }

        .afya-step-emoji { font-size: 2.5rem; }

        .afya-step-card h3 {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 0.8rem;
          color: #000;
        }

        .afya-step-card p {
          font-size: 0.95rem;
          color: #666;
          line-height: 1.5;
        }

        /* Dashboard Preview */
        .afya-dashboard-section { margin-top: 6rem; }
        .afya-dashboard-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
          margin-top: 3rem;
        }
        .afya-dashboard-main {
          background: white;
          padding: 2.5rem;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
        }
        .afya-dashboard-header {
          display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;
        }
        .afya-dashboard-title { font-size: 1.3rem; font-weight: 600; color: #000; }
        .afya-status-badge { background: #E8F5E9; color: #4CAF50; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.9rem; font-weight: 600; }
        .afya-vital-item { margin-bottom: 2rem; }
        .afya-vital-header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; }
        .afya-vital-icon { font-size: 1.2rem; }
        .afya-vital-label { font-size: 1rem; font-weight: 500; color: #000; }
        .afya-vital-value { font-size: 1.8rem; font-weight: 700; color: #000; margin-bottom: 0.8rem; }
        .afya-progress-bar { height: 10px; background: #E0E0E0; border-radius: 5px; overflow: hidden; margin-bottom: 0.5rem; }
        .afya-progress-fill { height: 100%; border-radius: 5px; }
        .afya-blue-fill { width: 70%; background: #1976D2; }
        .afya-red-fill { width: 60%; background: #F44336; }
        .afya-vital-note { font-size: 0.9rem; color: #666; }
        .afya-dashboard-footer { margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #E0E0E0; font-size: 0.9rem; color: #666; }
        .afya-dashboard-sidebar { display: flex; flex-direction: column; gap: 2rem; }
        .afya-sidebar-card { padding: 2rem; border-radius: 15px; }
        .afya-sidebar-card h4 { font-size: 1.1rem; font-weight: 600; margin-bottom: 0.8rem; color: #000; }
        .afya-sidebar-card p { font-size: 0.95rem; line-height: 1.5; color: #333; }
        .afya-green-card { background: #E8F5E9; }
        .afya-blue-card { background: #E3F2FD; }

        /* Team Section */
        .afya-team-section { padding: 6rem 3rem; background: #E3F2FD; }
        .afya-team-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 2.5rem; margin-top: 3rem;
        }
        .afya-team-card {
          background: white; padding: 2.5rem 2rem; border-radius: 15px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08); transition: transform 0.3s;
        }
        .afya-team-card:hover { transform: translateY(-5px); }
        .afya-team-card h3 { font-size: 1.3rem; font-weight: 700; margin-bottom: 0.5rem; color: #000; }
        .afya-team-card h4 { font-size: 1rem; font-weight: 600; color: #1976D2; margin-bottom: 1rem; }
        .afya-team-card p { font-size: 0.95rem; color: #666; line-height: 1.6; }

        /* Contact Section */
        .afya-contact-section {
          background: linear-gradient(135deg, #1976D2 0%, #0D47A1 100%);
          padding: 5rem 3rem;
          text-align: center;
        }
        .afya-white-title { color: white; }
        .afya-contact-text { font-size: 1.2rem; color: white; margin: 1.5rem auto 2.5rem; max-width: 800px; }
        .afya-btn-white {
          padding: 1rem 3rem; background: white; color: #1976D2; border: none; border-radius: 8px; font-size: 1.1rem; font-weight: 600; cursor: pointer; transition: transform 0.3s;
        }
        .afya-btn-white:hover { transform: translateY(-2px); }

        /* Footer */
        .afya-footer { background: #0D47A1; color: white; text-align: center; padding: 1.5rem; }

        /* Responsive */
        @media (max-width: 1024px) {
          .afya-hero-container { grid-template-columns: 1fr; }
          .afya-features-grid { grid-template-columns: repeat(2, 1fr); }
          .afya-steps-grid { grid-template-columns: repeat(2, 1fr); }
          .afya-team-grid { grid-template-columns: repeat(2, 1fr); }
          .afya-dashboard-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
          .afya-nav-container { padding: 0 1.5rem; }
          .afya-hero { padding: 100px 1.5rem 3rem; }
          .afya-hero-title { font-size: 2rem; }
          .afya-hero-description { font-size: 1rem; }
          .afya-section-title { font-size: 2rem; }
          .afya-problem-solution-grid, .afya-features-grid, .afya-steps-grid, .afya-team-grid { grid-template-columns: 1fr; }
          .afya-about-section, .afya-how-it-works, .afya-team-section, .afya-contact-section { padding: 4rem 1.5rem; }
        }
      `}</style>

      {/* Navigation */}
      <nav className="afya-navbar">
        <div className="afya-nav-container">
          <div className="afya-logo">Afya Band</div>
          <ul className="afya-nav-menu">
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#team">Team</a></li>
            <li><a href="#contact">Contact</a></li>
            <li>
              <button onClick={onNavigateDashboard} className="bg-white text-[#1976D2] px-4 py-2 rounded-lg font-bold hover:bg-slate-100 transition-colors">
                Dashboard
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="afya-hero">
        <div className="afya-hero-container">
          <div className="afya-hero-left">
            <h1 className="afya-hero-title">
              Take Control of Your Health with <span className="afya-yellow-text">AFYA BAND</span>
            </h1>
            <p className="afya-hero-description">
              An affordable wristband that continuously monitors your blood pressure and heart rate, 
              providing real-time health insights to help prevent serious complications
            </p>
            <button className="afya-btn-light" onClick={onNavigateDashboard}>Launch Dashboard</button>
          </div>
          <div className="afya-hero-right">
            <div className="afya-watch-image">
              <img src="band.jpeg" alt="Afya Band Wristband" />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="afya-about-section">
        <div className="afya-container">
          <h2 className="afya-section-title">Why AFYA BAND?</h2>
          <p className="afya-section-subtitle">
            Addressing the critical health challenges faced by urban residents in Nairobi
          </p>

          <div className="afya-problem-solution-grid">
            <div className="afya-card afya-problem-card">
              <h3>The Problem</h3>
              <ul>
                <li>Urban residents struggle to balance demanding work schedules and stress</li>
                <li>Many remain unaware of their blood pressure until complications arise</li>
                <li>Late medical interventions lead to higher healthcare costs</li>
              </ul>
            </div>

            <div className="afya-card afya-solution-card">
              <h3>Our Solution</h3>
              <ul>
                <li>Affordable wristband for continuous health monitoring</li>
                <li>Real-time blood pressure and heart rate tracking</li>
                <li>Weekly health statistics and expert tips</li>
                <li>Early warnings enable preventive action and timely medical advice</li>
              </ul>
            </div>
          </div>

          {/* Features */}
          <div className="afya-features-section">
            <h2 className="afya-section-title">Powerful Features</h2>
            <p className="afya-section-subtitle">
              Everything you need to take control of your health in one affordable device
            </p>

            <div className="afya-features-grid">
              <div className="afya-feature-card">
                <div className="afya-feature-icon afya-blue-bg">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                  </svg>
                </div>
                <h3>Continuous Monitoring</h3>
                <p>24/7 blood pressure and heart rate tracking to keep you informed about your health status.</p>
              </div>

              <div className="afya-feature-card">
                <div className="afya-feature-icon afya-pink-bg">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </div>
                <h3>Real-time Insights</h3>
                <p>Instant health data displayed on your connected mobile and web platform.</p>
              </div>

              <div className="afya-feature-card">
                <div className="afya-feature-icon afya-purple-bg">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="20" x2="12" y2="10"></line>
                    <line x1="18" y1="20" x2="18" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="16"></line>
                  </svg>
                </div>
                <h3>Weekly Statistics</h3>
                <p>Comprehensive weekly health reports to help you track your progress over time.</p>
              </div>

              <div className="afya-feature-card">
                <div className="afya-feature-icon afya-yellow-bg">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </svg>
                </div>
                <h3>Early Warnings</h3>
                <p>Smart alerts notify you of abnormal readings before serious complications develop.</p>
              </div>

              <div className="afya-feature-card">
                <div className="afya-feature-icon afya-green-bg">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                    <line x1="12" y1="18" x2="12.01" y2="18"></line>
                  </svg>
                </div>
                <h3>Mobile & Web Access</h3>
                <p>Access your health data anywhere through our user-friendly apps and web platform.</p>
              </div>

              <div className="afya-feature-card">
                <div className="afya-feature-icon afya-light-blue-bg">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h3>Share with Doctors</h3>
                <p>Easily share accurate health data with your healthcare providers for better consultations.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="afya-how-it-works">
        <div className="afya-container">
          <h2 className="afya-section-title afya-dark-title">How It Works</h2>
          <p className="afya-section-subtitle afya-dark-subtitle">
            Simple, effective health monitoring in four easy steps
          </p>

          <div className="afya-steps-grid">
            <div className="afya-step-card">
              <div className="afya-step-number">01</div>
              <div className="afya-step-icon-circle">
                <span className="afya-step-emoji">⌚</span>
              </div>
              <h3>Wear the AFYA BAND</h3>
              <p>Comfortable, lightweight wristband monitors your vitals throughout the day.</p>
            </div>

            <div className="afya-step-card">
              <div className="afya-step-number">02</div>
              <div className="afya-step-icon-circle">
                <span className="afya-step-emoji">📱</span>
              </div>
              <h3>Sync with App</h3>
              <p>Connect to our mobile and web platform to view real-time health data.</p>
            </div>

            <div className="afya-step-card">
              <div className="afya-step-number">03</div>
              <div className="afya-step-icon-circle">
                <span className="afya-step-emoji">📊</span>
              </div>
              <h3>Track Your Progress</h3>
              <p>Receive weekly statistics, expert tips, and personalized health insights.</p>
            </div>

            <div className="afya-step-card">
              <div className="afya-step-number">04</div>
              <div className="afya-step-icon-circle">
                <span className="afya-step-emoji">🔄</span>
              </div>
              <h3>Share with Doctors</h3>
              <p>Export and share accurate data with healthcare professionals for better care.</p>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="afya-dashboard-section">
            <h2 className="afya-section-title afya-dark-title">Your Health Dashboard</h2>
            <p className="afya-section-subtitle afya-dark-subtitle">
              Monitor your vital signs with our intuitive interface
            </p>

            <div className="afya-dashboard-grid">
              <div className="afya-dashboard-main">
                <div className="afya-dashboard-header">
                  <span className="afya-dashboard-title">Weekly Overview</span>
                  <span className="afya-status-badge">Normal Range</span>
                </div>

                <div className="afya-vital-item">
                  <div className="afya-vital-header">
                    <span className="afya-vital-icon">📊</span>
                    <span className="afya-vital-label">Blood Pressure</span>
                  </div>
                  <div className="afya-vital-value">120/80</div>
                  <div className="afya-progress-bar">
                    <div className="afya-progress-fill afya-blue-fill"></div>
                  </div>
                  <span className="afya-vital-note">Average this week</span>
                </div>

                <div className="afya-vital-item">
                  <div className="afya-vital-header">
                    <span className="afya-vital-icon">❤️</span>
                    <span className="afya-vital-label">Heart Rate</span>
                  </div>
                  <div className="afya-vital-value">72 bpm</div>
                  <div className="afya-progress-bar">
                    <div className="afya-progress-fill afya-red-fill"></div>
                  </div>
                  <span className="afya-vital-note">Resting heart rate</span>
                </div>

                <div className="afya-dashboard-footer">
                  📅 Last updated: Today at 2:45 PM
                </div>
              </div>

              <div className="afya-dashboard-sidebar">
                <div className="afya-sidebar-card afya-green-card">
                  <h4>📈 7-Day Streak</h4>
                  <p>Great job maintaining healthy readings this week!</p>
                </div>

                <div className="afya-sidebar-card afya-blue-card">
                  <h4>💡 Expert Tip</h4>
                  <p>Regular exercise can help lower blood pressure by 5-10 mmHg.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="afya-team-section">
        <div className="afya-container">
          <h2 className="afya-section-title">Meet Our Team</h2>
          <p className="afya-section-subtitle">
            The team behind AfyaBand dedicated to improving health outcomes
          </p>

          <div className="afya-team-grid">
            <div className="afya-team-card">
              <h3>Gakure Kihara Ernest</h3>
              <h4>Embedded Systems Engineer</h4>
              <p>Responsible for the hardware and firmware for the AFYA BAND wristband</p>
            </div>

            <div className="afya-team-card">
              <h3>Nyandiko Joseph</h3>
              <h4>Frontend Developer</h4>
              <p>Responsible for design of mobile and web interfaces</p>
            </div>

            <div className="afya-team-card">
              <h3>Kinuthia Njoki Marcia</h3>
              <h4>Backend Developer and UI/UX</h4>
              <p>Responsible for backend development</p>
            </div>

            <div className="afya-team-card">
              <h3>Shoka Ngumbao Sammy</h3>
              <h4>ML/Software Tester</h4>
              <p>Responsible for ML algorithms and software testing</p>
            </div>

            <div className="afya-team-card">
              <h3>Otieno Ramogi Samuel</h3>
              <h4>Backend Developer and Web Developer</h4>
              <p>Responsible for backend systems and integration.</p>
            </div>

            <div className="afya-team-card">
              <h3>Wangui Kariithi Janice</h3>
              <h4>Machine Learning</h4>
              <p>Responsible for ML algorithms, model design and analysis</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="afya-contact-section">
        <div className="afya-container">
          <h2 className="afya-section-title afya-white-title">Ready to Take Control of Your Health?</h2>
          <p className="afya-contact-text">
            Follow our journey as we develop AFYA BAND to make preventive healthcare accessible to everyone
          </p>
          <button className="afya-btn-white" onClick={onNavigateDashboard}>Learn More</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="afya-footer">
        <p>&copy; 2025 AFYA BAND (GROUP 1 SPM 406). All rights reserved.</p>
      </footer>
    </>
  );
};

export default LandingPage;