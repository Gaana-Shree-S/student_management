import React, { useState, useEffect } from 'react';
import './landingpage.css';
import App from './App';

const LandingPage = () => {
  const [showApp, setShowApp] = useState(false);
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);

  const features = [
    {
      title: 'Student Management',
      description: 'Complete student database with real-time enrollment, attendance tracking, and academic performance monitoring.',
      icon: '👥'
    },
    {
      title: 'Faculty & Admin Control',
      description: 'Streamlined management tools for faculty and administrators with role-based access and comprehensive dashboards.',
      icon: '👨‍💼'
    },
    {
      title: 'Attendance Tracking',
      description: 'Automated attendance management with biometric integration, detailed reports, and compliance tracking.',
      icon: '✓'
    },
    {
      title: 'Exam Management',
      description: 'End-to-end exam scheduling, result publishing, grade management, and academic performance analytics.',
      icon: '📝'
    },
    {
      title: 'Advanced Analytics',
      description: 'Deep insights into student performance, faculty productivity, and institutional metrics with custom reports.',
      icon: '📊'
    },
    {
      title: 'Communication Hub',
      description: 'Unified communication platform for announcements, notifications, and direct messaging between stakeholders.',
      icon: '💬'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeatureIndex((prev) => (prev + 1) % features.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [features.length]);

  if (showApp) {
    return <App />;
  }

  return (
    <div className="landing-page">
      {/* Background Elements */}
      <div className="background-gradient"></div>
      <div className="floating-blob blob-1"></div>
      <div className="floating-blob blob-2"></div>
      <div className="floating-blob blob-3"></div>

      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <span className="logo-icon">🎓</span>
            <span className="logo-text">CollegeHub</span>
          </div>
          <ul className="nav-menu">
            <li><a href="#features">Features</a></li>
            <li><a href="#benefits">Benefits</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge animate-fade-in">
            <span className="badge-text">✨ The Future of Education</span>
          </div>

          <h1 className="hero-title animate-slide-up">
            Smart College <span className="gradient-text">Management System</span>
          </h1>

          <p className="hero-subtitle animate-fade-in-delay-1">
            Streamline enrollment, attendance, exams, and analytics. One powerful platform for modern educational institutions.
          </p>

          <div className="hero-stats animate-fade-in-delay-2">
            <div className="stat">
              <div className="stat-number">5000+</div>
              <div className="stat-label">Active Users</div>
            </div>
            <div className="stat">
              <div className="stat-number">98%</div>
              <div className="stat-label">Satisfaction</div>
            </div>
            <div className="stat">
              <div className="stat-number">50+</div>
              <div className="stat-label">Institutions</div>
            </div>
          </div>

          <div className="hero-buttons animate-fade-in-delay-3">
            <button 
              className="btn btn-primary"
              onClick={() => setShowApp(true)}
            >
              Get Started
              <span className="btn-arrow">→</span>
            </button>
            
          </div>
        </div>

        <div className="hero-visual animate-float">
          <div className="dashboard-preview">
            <div className="preview-header"></div>
            <div className="preview-content">
              <div className="preview-bar"></div>
              <div className="preview-bar short"></div>
              <div className="preview-bar shorter"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Rotating Left to Right */}
      <section className="features-section" id="features">
        <div className="features-container">
          <div className="section-header">
            <h2 className="section-title animate-fade-in">
              Powerful Features
            </h2>
            <p className="section-subtitle animate-fade-in">
              Everything you need to manage your college efficiently
            </p>
          </div>

          {/* Rotating Feature Display */}
          <div className="rotating-features-wrapper">
            <div className="rotating-features">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`rotating-feature ${index === currentFeatureIndex ? 'active' : ''}`}
                  style={{
                    opacity: index === currentFeatureIndex ? 1 : 0,
                    transform: index === currentFeatureIndex 
                      ? 'translateX(0) scale(1)' 
                      : 'translateX(-100%) scale(0.8)',
                  }}
                >
                  <div className="feature-icon-large">{feature.icon}</div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Feature Indicators */}
            <div className="feature-indicators">
              {features.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${index === currentFeatureIndex ? 'active' : ''}`}
                  onClick={() => setCurrentFeatureIndex(index)}
                  aria-label={`View feature ${index + 1}`}
                ></button>
              ))}
            </div>
          </div>

          {/* Features Grid */}
          <div className="features-grid">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card"
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="feature-card-icon">{feature.icon}</div>
                <h3 className="feature-card-title">{feature.title}</h3>
                <p className="feature-card-desc">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section" id="benefits">
        <div className="benefits-container">
          <div className="section-header">
            <h2 className="section-title">Why Choose CollegeHub?</h2>
          </div>

          <div className="benefits-grid">
            <div className="benefit-item animate-slide-up">
              <div className="benefit-number">01</div>
              <h3>Automated Workflows</h3>
              <p>Eliminate manual processes and save hours of administrative work daily.</p>
            </div>
            <div className="benefit-item animate-slide-up">
              <div className="benefit-number">02</div>
              <h3>Real-time Analytics</h3>
              <p>Get instant insights into student performance and institutional metrics.</p>
            </div>
            <div className="benefit-item animate-slide-up">
              <div className="benefit-number">03</div>
              <h3>Secure & Compliant</h3>
              <p>Enterprise-grade security with GDPR and data privacy compliance.</p>
            </div>
            <div className="benefit-item animate-slide-up">
              <div className="benefit-number">04</div>
              <h3>24/7 Support</h3>
              <p>Dedicated support team available round the clock for assistance.</p>
            </div>
            <div className="benefit-item animate-slide-up">
              <div className="benefit-number">05</div>
              <h3>Easy Integration</h3>
              <p>Seamlessly integrate with your existing systems and tools.</p>
            </div>
            <div className="benefit-item animate-slide-up">
              <div className="benefit-number">06</div>
              <h3>Mobile Friendly</h3>
              <p>Access from anywhere, anytime on any device with our mobile app.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section" id="pricing">
        <div className="pricing-container">
          <div className="section-header">
            <h2 className="section-title">Simple, Transparent Pricing</h2>
            <p className="section-subtitle">Choose the perfect plan for your institution</p>
          </div>

          <div className="pricing-cards">
            <div className="pricing-card">
              <h3 className="pricing-plan">Starter</h3>
              <div className="pricing-price">$299<span className="pricing-period">/month</span></div>
              <p className="pricing-desc">Perfect for small colleges</p>
              <ul className="pricing-features">
                <li>✓ Up to 1000 students</li>
                <li>✓ Basic analytics</li>
                <li>✓ Email support</li>
                <li>✗ API access</li>
              </ul>
              <button className="btn btn-secondary">Get Started</button>
            </div>

            <div className="pricing-card featured">
              <div className="pricing-badge">Most Popular</div>
              <h3 className="pricing-plan">Professional</h3>
              <div className="pricing-price">$799<span className="pricing-period">/month</span></div>
              <p className="pricing-desc">For growing institutions</p>
              <ul className="pricing-features">
                <li>✓ Up to 5000 students</li>
                <li>✓ Advanced analytics</li>
                <li>✓ Priority support</li>
                <li>✓ API access</li>
              </ul>
              <button className="btn btn-primary">Get Started</button>
            </div>

            <div className="pricing-card">
              <h3 className="pricing-plan">Enterprise</h3>
              <div className="pricing-price">Custom</div>
              <p className="pricing-desc">For large universities</p>
              <ul className="pricing-features">
                <li>✓ Unlimited students</li>
                <li>✓ Custom analytics</li>
                <li>✓ Dedicated support</li>
                <li>✓ Full API access</li>
              </ul>
              <button className="btn btn-secondary">Contact Sales</button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Transform Your College?</h2>
          <p className="cta-subtitle">Join 50+ institutions already using CollegeHub</p>
          <button 
            className="btn btn-primary btn-large"
            onClick={() => setShowApp(true)}
          >
            Start Your Free Trial
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>CollegeHub</h4>
            <p>Smart college management for the modern era.</p>
          </div>
          <div className="footer-section">
            <h4>Product</h4>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#security">Security</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Company</h4>
            <ul>
              <li><a href="#about">About</a></li>
              <li><a href="#blog">Blog</a></li>
              <li><a href="#careers">Careers</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li><a href="#privacy">Privacy</a></li>
              <li><a href="#terms">Terms</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 CollegeHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;