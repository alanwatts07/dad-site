import { Link } from 'react-router-dom';
import ContactForm from '../components/ContactForm';
import SEO from '../components/SEO';

const Water = () => {
    const scrollToForm = (e) => {
        e.preventDefault();
        document.getElementById('water-lead-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div className="page-content">
            <SEO
                title="Home Water Treatment & Filtration"
                description="Whole-home water softening, filtration, and purification. Get a free water assessment for your home — city or well water, PFAS and lead reduction, and more."
                canonical="/water"
            />

            <section className="section water-hero">
                <div className="container">
                    <h1 className="section-title fade-in">Cleaner, Healthier <span className="text-gradient">Water</span> For Your Home</h1>
                    <p className="lead fade-in delay-1 text-center">Whole-home filtration, softening, and purification for city and well water.</p>

                    <div className="cta-buttons fade-in delay-2" style={{ justifyContent: 'center', display: 'flex', gap: '16px', marginTop: '32px' }}>
                        <a href="#water-lead-form" onClick={scrollToForm} className="btn btn-primary">Get a Free Water Assessment</a>
                        <Link to="/book" className="btn btn-outline">Book a Call</Link>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <h2 className="section-title fade-in">The Problems We <span className="text-gradient">Solve</span></h2>
                    <p className="lead fade-in delay-1 text-center">Most homes have one or more of these — many homeowners don't know it until we test.</p>

                    <div className="grid-2 fade-in delay-2" style={{ marginTop: '48px' }}>
                        <div className="card">
                            <h3>Hard Water & Scale</h3>
                            <p>Calcium and magnesium buildup damages water heaters, shortens appliance life, and leaves residue on dishes, fixtures, and skin.</p>
                        </div>
                        <div className="card">
                            <h3>PFAS & "Forever Chemicals"</h3>
                            <p>Persistent contaminants linked to serious health concerns. NSF-certified filtration can reduce them at every tap in your home.</p>
                        </div>
                        <div className="card">
                            <h3>Lead</h3>
                            <p>Aging pipes and service lines can leach lead into your water. Particularly dangerous for children and expectant mothers.</p>
                        </div>
                        <div className="card">
                            <h3>Chlorine & Chloramines</h3>
                            <p>Used by municipal utilities to disinfect — but they leave behind unpleasant taste, odor, and dry out skin and hair.</p>
                        </div>
                        <div className="card">
                            <h3>Iron & Sediment (Well Water)</h3>
                            <p>Rust stains on sinks, tubs, and laundry. Sediment clogs plumbing and ruins appliances over time.</p>
                        </div>
                        <div className="card">
                            <h3>Bacteria & Nitrates</h3>
                            <p>Untested well water can harbor coliform bacteria, viruses, or agricultural nitrates — a serious risk, especially for infants.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <h2 className="section-title fade-in">What We <span className="text-gradient">Offer</span></h2>
                    <p className="lead fade-in delay-1 text-center">Whole-home solutions built for your water — whether you're on city supply or a well.</p>

                    <div className="steps-container" style={{ marginTop: '48px' }}>
                        <div className="step-card fade-in delay-2">
                            <div className="step-number">01</div>
                            <div className="step-content">
                                <h3>Whole-Home Water Softeners</h3>
                                <p>Eliminate scale-causing hardness so appliances last longer and soap actually lathers the way it should.</p>
                            </div>
                        </div>

                        <div className="step-card fade-in delay-2">
                            <div className="step-number">02</div>
                            <div className="step-content">
                                <h3>Whole-House Filtration</h3>
                                <p>NSF-certified systems that reduce PFAS, lead, chlorine, and cysts at every faucet, shower, and appliance.</p>
                            </div>
                        </div>

                        <div className="step-card fade-in delay-3">
                            <div className="step-number">03</div>
                            <div className="step-content">
                                <h3>Reverse Osmosis Drinking Water</h3>
                                <p>Bottle-quality water straight from your kitchen tap. No more plastic waste, no more delivery fees.</p>
                            </div>
                        </div>

                        <div className="step-card fade-in delay-3">
                            <div className="step-number">04</div>
                            <div className="step-content">
                                <h3>Well Water Treatment</h3>
                                <p>Custom systems for iron, sediment, acidity, bacteria, and nitrates. Built specifically for your well.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section" id="water-lead-form">
                <div className="container">
                    <h2 className="section-title fade-in">Get Your Free <span className="text-gradient">Water Assessment</span></h2>
                    <p className="lead fade-in delay-1 text-center">Tell us a little about your home and we'll connect you with a local specialist.</p>

                    <div className="contact-container fade-in delay-2" style={{ marginTop: '48px' }}>
                        <div className="contact-info">
                            <div className="info-item">
                                <h3>Free Assessment</h3>
                                <p>No-obligation home water test from a trusted local partner.</p>
                            </div>
                            <div className="info-item">
                                <h3>Honest Recommendations</h3>
                                <p>We only suggest what actually fits your water and budget.</p>
                            </div>
                            <div className="info-item">
                                <h3>Quality Systems</h3>
                                <p>NSF-certified equipment from USA-based manufacturers with real warranties.</p>
                            </div>
                        </div>

                        <div className="contact-form-wrapper">
                            <h3>Request Information</h3>
                            <ContactForm
                                source="Water Page"
                                tags={['water-lead', 'water-treatment-interest']}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Water;
