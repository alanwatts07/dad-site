const BOOKING_URL = 'https://api.leadconnectorhq.com/widget/bookings/solar-booking-1';

const Book = () => {
    return (
        <div className="page-content">
            <section className="section booking-hero">
                <div className="container text-center">
                    <h1 className="section-title fade-in">Book a <span className="text-gradient">Consultation</span></h1>
                    <p className="booking-subtitle fade-in delay-1">
                        Schedule a one-on-one session with our energy experts to explore the best solutions for your home or business.
                    </p>
                    <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary fade-in delay-2">
                        Schedule Now
                    </a>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="booking-steps">
                        <div className="booking-card">
                            <div className="booking-card-icon">1</div>
                            <h3>Pick a Time</h3>
                            <p>Choose a date and time that fits your schedule. Consultations are available weekdays and weekends.</p>
                        </div>
                        <div className="booking-card">
                            <div className="booking-card-icon">2</div>
                            <h3>Tell Us About Your Property</h3>
                            <p>Share a few details about your energy needs so we can prepare a tailored assessment for you.</p>
                        </div>
                        <div className="booking-card">
                            <div className="booking-card-icon">3</div>
                            <h3>Get Your Custom Plan</h3>
                            <p>We'll walk you through your options, available incentives, and a clear path to clean energy savings.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section booking-cta-section">
                <div className="container text-center">
                    <h2>Ready to Get Started?</h2>
                    <p className="booking-subtitle">No pressure, no obligation — just a conversation about your energy future.</p>
                    <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                        Book Your Consultation
                    </a>
                </div>
            </section>
        </div>
    );
};

export default Book;
