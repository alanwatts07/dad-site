import React from 'react';

const Summit360 = () => {
    return (
        <div className="page-content">
            <section className="section summit-hero">
                <div className="container">
                    <h1 className="section-title fade-in">The Summit 360 <span className="text-gradient">Approach™</span></h1>
                    <p className="lead fade-in delay-1 text-center">Your Complete Home Energy Roadmap</p>

                    <div className="summit-intro fade-in delay-1">
                        <p>The Summit 360 Approach™ was designed to help homeowners see the full picture of their home’s energy use — and fix what matters most.</p>
                        <p className="highlight-text">First reduce how much energy you use, then reduce the cost of the energy you still need.</p>
                    </div>

                    <div className="steps-container">
                        <div className="step-card fade-in delay-2">
                            <div className="step-number">01</div>
                            <div className="step-content">
                                <h3>Home Energy Assessment</h3>
                                <p>Discover where your home is wasting energy.</p>
                            </div>
                        </div>

                        <div className="step-card fade-in delay-2">
                            <div className="step-number">02</div>
                            <div className="step-content">
                                <h3>Efficiency Upgrades</h3>
                                <p>Seal leaks, improve insulation, and update outdated systems.</p>
                            </div>
                        </div>

                        <div className="step-card fade-in delay-3">
                            <div className="step-number">03</div>
                            <div className="step-content">
                                <h3>Renewable Power Options</h3>
                                <p>Explore solar, battery storage, and other clean energy technologies.</p>
                            </div>
                        </div>

                        <div className="step-card fade-in delay-3">
                            <div className="step-number">04</div>
                            <div className="step-content">
                                <h3>Long-Term Management</h3>
                                <p>Add smart tech to monitor and control energy use daily.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Summit360;
