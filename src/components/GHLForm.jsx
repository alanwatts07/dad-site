import { useEffect, useRef } from 'react';

/**
 * GHLForm - Embeds a GoHighLevel form into your React app
 *
 * Usage:
 *   <GHLForm formId="abc123xyz" />
 *
 * The formId comes from your Sanity CMS (ghlForm schema) or directly from GHL.
 *
 * How it works:
 * 1. Creates a container div with the data-layout attribute GHL expects
 * 2. Dynamically loads the GHL form script
 * 3. Cleans up the script when component unmounts (important for SPA navigation)
 */
const GHLForm = ({ formId, className = '' }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!formId) return;

        // Create the script element
        const script = document.createElement('script');
        script.src = 'https://link.msgsndr.com/js/form_embed.js';
        script.async = true;

        // Append script to load the form
        document.body.appendChild(script);

        // Cleanup on unmount (important for React SPA navigation)
        return () => {
            // Remove the script
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
            // Clear the container to prevent duplicate forms
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
                    height: '500px',
                    border: 'none',
                    borderRadius: '8px',
                }}
                id={`inline-${formId}`}
                data-layout="{'id':'INLINE'}"
                data-trigger-type="alwaysShow"
                data-trigger-value=""
                data-activation-type="alwaysActivated"
                data-activation-value=""
                data-deactivation-type="neverDeactivate"
                data-deactivation-value=""
                data-form-name="Embedded Form"
                data-height="500"
                data-layout-iframe-id={`inline-${formId}`}
                data-form-id={formId}
                title="GHL Form"
            />
        </div>
    );
};

export default GHLForm;
