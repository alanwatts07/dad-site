import { Link } from 'react-router-dom';
import ContactForm from '../components/ContactForm';
import SEO from '../components/SEO';

const Revise = () => {
    const scrollToForm = (e) => {
        e.preventDefault();
        document.getElementById('revise-lead-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div className="page-content">
            <SEO
                title="Revise — Mass Save Home Energy Assessment Partner"
                description="Get a no-cost Mass Save Home Energy Assessment through Revise, our trusted partner for Massachusetts and New Hampshire homeowners. Insulation, heat pumps, and 0% financing."
                canonical="/revise"
            />

            <section className="section water-hero">
                <div className="container">
                    <h1 className="section-title fade-in">Unlock Your <span className="text-gradient">Mass Save</span> Credits</h1>
                    <p className="lead fade-in delay-1 text-center">Our trusted partner Revise helps MA and NH homeowners claim every rebate, credit, and 0% loan they've already paid for.</p>

                    <div className="cta-buttons fade-in delay-2" style={{ justifyContent: 'center', display: 'flex', gap: '16px', marginTop: '32px' }}>
                        <a href="#revise-lead-form" onClick={scrollToForm} className="btn btn-primary">Request a Free Assessment</a>
                        <Link to="/book" className="btn btn-outline">Book a Call</Link>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <h2 className="section-title fade-in">Why Start With an <span className="text-gradient">Energy Assessment</span></h2>
                    <p className="lead fade-in delay-1 text-center">You've already paid for these savings through the Energy Conservation Charge on your utility bill. It's time to cash them in.</p>

                    <div className="grid-2 fade-in delay-2" style={{ marginTop: '48px' }}>
                        <div className="card">
                            <h3>No-Cost Home Energy Assessment</h3>
                            <p>A trained specialist walks through your home, identifies energy loss, and installs instant-savings devices on the spot — all free to qualifying utility customers.</p>
                        </div>
                        <div className="card">
                            <h3>Insulation & Air Sealing</h3>
                            <p>Stop paying to heat and cool the outdoors. Mass Save rebates can cover up to 75–100% of weatherization costs for eligible homes.</p>
                        </div>
                        <div className="card">
                            <h3>Heat Pumps & HVAC</h3>
                            <p>Upgrade to high-efficiency heat pumps, mini-splits, and smart controls — backed by Mass Save rebates and 0% financing.</p>
                        </div>
                        <div className="card">
                            <h3>Instant Savings Devices</h3>
                            <p>Smart thermostats, LED bulbs, efficient showerheads, and smart power strips — installed for free during your assessment.</p>
                        </div>
                        <div className="card">
                            <h3>0% HEAT Loan Financing</h3>
                            <p>Qualify for up to $50,000 at 0% interest for approved upgrades through the Mass Save HEAT Loan program.</p>
                        </div>
                        <div className="card">
                            <h3>A Smarter Path to Solar</h3>
                            <p>A tighter, more efficient home means a smaller, cheaper solar system. Start here — then go solar with confidence.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <h2 className="section-title fade-in">How It <span className="text-gradient">Works</span></h2>
                    <p className="lead fade-in delay-1 text-center">Simple, no-pressure, and backed by a decade of Mass Save experience.</p>

                    <div className="steps-container" style={{ marginTop: '48px' }}>
                        <div className="step-card fade-in delay-2">
                            <div className="step-number">01</div>
                            <div className="step-content">
                                <h3>Fill Out the Form</h3>
                                <p>Give us a few quick details — your home, your utility, your heating setup.</p>
                            </div>
                        </div>

                        <div className="step-card fade-in delay-2">
                            <div className="step-number">02</div>
                            <div className="step-content">
                                <h3>We Connect You to Revise</h3>
                                <p>Your info is handed off to Revise as a referral from New Energy Initiative — no spam, no pressure.</p>
                            </div>
                        </div>

                        <div className="step-card fade-in delay-3">
                            <div className="step-number">03</div>
                            <div className="step-content">
                                <h3>Schedule Your Free Assessment</h3>
                                <p>A certified energy specialist walks through your home and identifies every opportunity to save.</p>
                            </div>
                        </div>

                        <div className="step-card fade-in delay-3">
                            <div className="step-number">04</div>
                            <div className="step-content">
                                <h3>Get Upgrades Funded by Mass Save</h3>
                                <p>Claim rebates, 0% financing, and free instant-savings devices — and set your home up for solar down the line.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <h2 className="section-title fade-in">Who <span className="text-gradient">Qualifies</span></h2>
                    <p className="lead fade-in delay-1 text-center">Mass Save and NH Saves are funded by utility customers — you qualify if you are one.</p>

                    <div className="grid-2 fade-in delay-2" style={{ marginTop: '48px', maxWidth: '900px', margin: '48px auto 0' }}>
                        <div className="card">
                            <h3>Massachusetts Homeowners</h3>
                            <p>Customers of National Grid, Eversource, Columbia Gas, or Blackstone Gas qualify for the full Mass Save program benefits.</p>
                        </div>
                        <div className="card">
                            <h3>New Hampshire Homeowners</h3>
                            <p>NH Saves partners with local utilities to offer the same type of no-cost assessments and incentives across the state.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section" id="revise-lead-form">
                <div className="container">
                    <h2 className="section-title fade-in">Request Your Free <span className="text-gradient">Assessment</span></h2>
                    <p className="lead fade-in delay-1 text-center">Tell us about your home and we'll connect you directly with Revise.</p>

                    <div className="contact-container fade-in delay-2" style={{ marginTop: '48px' }}>
                        <div className="contact-info">
                            <div className="info-item">
                                <h3>Trusted Partner</h3>
                                <p>Revise has been serving MA and NH homeowners since 2016 with thousands of completed assessments.</p>
                            </div>
                            <div className="info-item">
                                <h3>Zero Cost, Zero Pressure</h3>
                                <p>The assessment is genuinely free — it's funded by the Energy Conservation Charge you already pay.</p>
                            </div>
                            <div className="info-item">
                                <h3>Referred by NEI</h3>
                                <p>Your request is tagged as a New Energy Initiative referral so Revise knows to give you priority service.</p>
                            </div>
                        </div>

                        <div className="contact-form-wrapper">
                            <h3>Get Started</h3>
                            <ContactForm
                                source="Revise Page"
                                tags={['revise-lead', 'mass-save-interest', 'nei-referral']}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Revise;
