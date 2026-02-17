const Book = () => {
    return (
        <div className="page-content">
            <section className="section booking-hero">
                <div className="container text-center">
                    <h1 className="section-title fade-in">Book a <span className="text-gradient">Consultation</span></h1>
                    <p className="booking-subtitle fade-in delay-1">Pick a time that works for you and we'll handle the rest.</p>
                </div>
            </section>

            <section className="section booking-section">
                <div className="container">
                    <div className="booking-wrapper">
                        <iframe
                            src="https://api.leadconnectorhq.com/widget/bookings/solar-booking-1"
                            className="booking-iframe"
                            title="Schedule Consultation"
                            frameBorder="0"
                            allowFullScreen
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Book;
