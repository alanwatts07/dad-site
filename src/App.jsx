import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="app">
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-content">
          <div className="logo">NewEnergy<span className="highlight">Initiative</span></div>
          <ul className="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#mission">Mission</a></li>
            <li><a href="#technology">Technology</a></li>
            <li><a href="#contact" className="btn-nav">Get Involved</a></li>
          </ul>
        </div>
      </nav>

      <header id="home" className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content container">
          <h1 className="fade-in">Powering the <span className="text-gradient">Future</span></h1>
          <p className="fade-in delay-1">Sustainable. Efficient. Limitless.</p>
          <div className="hero-buttons fade-in delay-2">
            <a href="#mission" className="btn btn-primary">Our Vision</a>
            <a href="#contact" className="btn btn-outline">Contact Us</a>
          </div>
        </div>
      </header>

      <section id="mission" className="section mission">
        <div className="container">
          <h2 className="section-title">The Initiative</h2>
          <div className="grid-2">
            <div className="card">
              <h3>Clean Generation</h3>
              <p>Harnessing the power of the sun and advanced renewables to create a zero-carbon future.</p>
            </div>
            <div className="card">
              <h3>Smart Distribution</h3>
              <p>Modernizing the grid with AI-driven efficiency and resilient infrastructure.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 New Energy Initiative. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
