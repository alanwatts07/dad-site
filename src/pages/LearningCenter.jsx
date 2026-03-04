import React from 'react';
import SEO from '../components/SEO';

const LearningCenter = () => {
    return (
        <div className="page-content">
            <SEO
                title="Energy Learning Center"
                description="Free home energy education for homeowners — animated videos, interactive guides, checklists, and incentive resources to help you save money and energy."
                canonical="/learning"
            />
            <section className="section learning-hero">
                <div className="container">
                    <h1 className="section-title fade-in">Energy <span className="text-gradient">Learning Center</span></h1>
                    <p className="lead fade-in delay-1 text-center">Understand Before You Upgrade</p>

                    <div className="learning-intro fade-in delay-1">
                        <p>Knowledge is the first step to energy independence. Our Learning Center gives homeowners simple, easy-to-understand resources that explain how energy works — and how to use less of it.</p>
                    </div>

                    <div className="resources-grid fade-in delay-2">
                        <div className="resource-card">
                            <div className="resource-icon">🎬</div>
                            <h3>Animated Videos</h3>
                            <p>Simple tutorials explaining complex energy concepts.</p>
                            <button className="btn-text">Watch Now →</button>
                        </div>
                        <div className="resource-card">
                            <div className="resource-icon">📊</div>
                            <h3>Interactive Guides</h3>
                            <p>Visual infographics and step-by-step walkthroughs.</p>
                            <button className="btn-text">Explore →</button>
                        </div>
                        <div className="resource-card">
                            <div className="resource-icon">✅</div>
                            <h3>Checklists</h3>
                            <p>Downloadable guides for home energy audits.</p>
                            <button className="btn-text">Download →</button>
                        </div>
                        <div className="resource-card">
                            <div className="resource-icon">💰</div>
                            <h3>Incentives</h3>
                            <p>Find local rebates and tax credit information.</p>
                            <button className="btn-text">Search →</button>
                        </div>
                    </div>

                    <div className="learning-footer fade-in delay-3">
                        <p>Before you buy anything, learn what makes sense for your home, your budget, and your family.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LearningCenter;
