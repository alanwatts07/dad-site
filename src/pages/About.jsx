import React from 'react';

const About = () => {
    return (
        <div className="page-content">
            <section className="section about-hero">
                <div className="container">
                    <h1 className="section-title fade-in">Who We Are & <span className="text-gradient">Why We Care</span></h1>
                    <div className="about-grid">
                        <div className="about-text fade-in delay-1">
                            <p className="lead">At the New Energy Initiative, we believe knowledge is power — literally.</p>
                            <p>We’re not a utility company, and we don’t sell panels. We educate, inform, and connect homeowners with the tools and resources to make smarter energy choices.</p>
                        </div>
                        <div className="about-promises fade-in delay-2">
                            <div className="promise-card">
                                <h3>Clarity</h3>
                                <p>Clear answers about energy use and savings options.</p>
                            </div>
                            <div className="promise-card">
                                <h3>Confidence</h3>
                                <p>Empowering homeowners to make informed choices.</p>
                            </div>
                            <div className="promise-card">
                                <h3>Control</h3>
                                <p>Helping families reduce waste and lower monthly bills.</p>
                            </div>
                        </div>
                    </div>
                    <div className="mission-statement fade-in delay-3">
                        <p>Together, we’re creating a movement of proactive homeowners taking back control of their homes, budgets, and future.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
