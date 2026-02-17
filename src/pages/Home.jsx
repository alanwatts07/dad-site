import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <>
            <header id="home" className="hero">
                <div className="hero-overlay"></div>
                <div className="hero-content container">
                    <h1 className="fade-in">Powering the <span className="text-gradient">Future</span></h1>
                    <p className="fade-in delay-1">Sustainable. Efficient. Limitless.</p>
                    <div className="hero-buttons fade-in delay-2">
                        <Link to="/book" className="btn btn-primary">Book Now</Link>
                        <Link to="/about" className="btn btn-outline">About Us</Link>
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
        </>
    );
};

export default Home;
