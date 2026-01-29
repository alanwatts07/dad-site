import { useState } from 'react';

const ContactForm = ({ onSuccess, source = 'Website Contact Form', tags = [] }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        zipcode: ''
    });
    const [status, setStatus] = useState('idle'); // idle, submitting, success, error
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');
        setErrorMessage('');

        try {
            const response = await fetch('/api/submit-lead', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...formData,
                    source,
                    tags
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            setStatus('success');
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                zipcode: ''
            });

            if (onSuccess) {
                onSuccess(data);
            }

        } catch (error) {
            setStatus('error');
            setErrorMessage(error.message || 'Failed to submit. Please try again.');
        }
    };

    if (status === 'success') {
        return (
            <div className="form-success">
                <div className="success-icon">✓</div>
                <h3>Thanks for reaching out!</h3>
                <p>One of our energy experts will contact you shortly.</p>
            </div>
        );
    }

    return (
        <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="firstName">First Name *</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        placeholder="John"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="lastName">Last Name *</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        placeholder="Doe"
                    />
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com"
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="(555) 123-4567"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="zipcode">Zip Code *</label>
                    <input
                        type="text"
                        id="zipcode"
                        name="zipcode"
                        value={formData.zipcode}
                        onChange={handleChange}
                        required
                        placeholder="12345"
                        pattern="[0-9]{5}"
                        maxLength="5"
                    />
                </div>
            </div>

            {status === 'error' && (
                <div className="form-error">
                    {errorMessage}
                </div>
            )}

            <button
                type="submit"
                className="btn btn-primary btn-submit"
                disabled={status === 'submitting'}
            >
                {status === 'submitting' ? (
                    <>
                        <span className="spinner"></span>
                        Submitting...
                    </>
                ) : (
                    'Get Started'
                )}
            </button>
        </form>
    );
};

export default ContactForm;
