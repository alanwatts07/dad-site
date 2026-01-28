import { useEffect, useRef } from 'react';

/**
 * GHLForm - Embeds a GoHighLevel form into your React app
 * Uses the script-based embed method for better styling control
 */
const GHLForm = ({ formId, className = '' }) => {
    const containerRef = useRef(null);
    const scriptLoaded = useRef(false);

    useEffect(() => {
        if (!formId || scriptLoaded.current) return;

        // Load the GHL form embed script
        const script = document.createElement('script');
        script.src = 'https://link.msgsndr.com/js/form_embed.js';
        script.async = true;
        document.body.appendChild(script);
        scriptLoaded.current = true;

        return () => {
            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }
        };
    }, [formId]);

    if (!formId) {
        return null;
    }

    return (
        <div className={`ghl-form-container ${className}`}>
            <iframe
                ref={containerRef}
                src={`https://link.msgsndr.com/widget/form/${formId}`}
                style={{
                    width: '100%',
                    height: '450px',
                    border: 'none',
                    borderRadius: '8px',
                    background: 'transparent',
                    colorScheme: 'dark',
                }}
                id={`inline-${formId}`}
                title="Contact Form"
                scrolling="no"
            />
        </div>
    );
};

export default GHLForm;
