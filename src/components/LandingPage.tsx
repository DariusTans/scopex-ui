import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import UploadModal from './UploadModal';

const LandingPage: React.FC = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleFileUpload = (files: File[]) => {
    console.log('Files uploaded:', files);
  };

  return (
    <div className="landing-page">
      <div className="container">
        <header className="hero-section">
          <h1 className="hero-title">ScopeX</h1>
          <p className="hero-subtitle">
            Discover the power of precision and innovation
          </p>
          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => navigate('/upload')}>Get Started</button>
            <button className="btn-secondary">Learn More</button>
            <button 
              className="btn-upload" 
              onClick={() => setIsUploadModalOpen(true)}
            >
              Upload File
            </button>
          </div>
        </header>

        <section className="features-section">
          <div className="features-grid">
            <div className="feature-card">
              <h3>Advanced Analytics</h3>
              <p>Get deep insights with our powerful analytics tools</p>
            </div>
            <div className="feature-card">
              <h3>Real-time Data</h3>
              <p>Access live data streams and real-time monitoring</p>
            </div>
            <div className="feature-card">
              <h3>Secure Platform</h3>
              <p>Enterprise-grade security for your peace of mind</p>
            </div>
          </div>
        </section>

        <footer className="footer">
          <p>&copy; 2024 ScopeX. All rights reserved.</p>
        </footer>
      </div>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onFileUpload={handleFileUpload}
      />
    </div>
  );
};

export default LandingPage;