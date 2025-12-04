import React from 'react';

const Contact = () => {
    return (
        <div className="page-content">
            <section className="section contact-hero">
                <div className="container">
                    <h1 className="section-title fade-in">We’re Here to <span className="text-gradient">Help</span></h1>
                    <p className="lead fade-in delay-1 text-center">Have questions? Need guidance? Want to learn more?</p>

                    <div className="contact-container fade-in delay-2">
                        <div className="contact-info">
                            <div className="info-item">
                                <h3>Email Us</h3>
                                <p>info@newenergyinitiative.com</p>
                            </div>
                            <div className="info-item">
                                <h3>Live Chat</h3>
                                <p>Available weekdays 9am–6pm EST</p>
                            </div>
                            <div className="info-item">
                                <h3>Our Promise</h3>
                                <p>Our team of local energy educators is ready to help you every step of the way.</p>
                            </div>
                        </div>

                        <div className="contact-form-wrapper">
                            <h3>Request Information</h3>
                            <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
                                <div className="form-group">
                                    <label>Name</label>
                                    <input type="text" placeholder="Your Name" />
                                </div>
                                <div className="form-group">
                                    <label>Email</label>
                                    <input type="email" placeholder="Your Email" />
                                </div>
                                <div className="form-group">
                                    <label>I'm interested in...</label>
                                    <select>
                                        <option>Free Home Energy Assessment</option>
                                        <option>Solar Comparison Report</option>
                                        <option>General Information</option>
                                    </select>
                                </div>
                                <button type="submit" className="btn btn-primary">Send Request</button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
