// Vercel Serverless Function - submits leads to GoHighLevel API v2
const GHL_BASE_URL = 'https://services.leadconnectorhq.com';

// Helper to make GHL API requests
async function ghlFetch(endpoint, options, token) {
    const response = await fetch(`${GHL_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Version': '2021-07-28',
            ...options.headers
        }
    });
    const data = await response.json();
    return { response, data };
}

// Search for existing contact by email or phone
async function findExistingContact(email, phone, locationId, token) {
    // Check by email first
    const emailCheck = await ghlFetch(
        `/contacts/search/duplicate?locationId=${locationId}&email=${encodeURIComponent(email)}`,
        { method: 'GET' },
        token
    );

    if (emailCheck.response.ok && emailCheck.data.contact) {
        return emailCheck.data.contact;
    }

    // Check by phone if provided
    if (phone) {
        const phoneCheck = await ghlFetch(
            `/contacts/search/duplicate?locationId=${locationId}&phone=${encodeURIComponent(phone)}`,
            { method: 'GET' },
            token
        );

        if (phoneCheck.response.ok && phoneCheck.data.contact) {
            return phoneCheck.data.contact;
        }
    }

    return null;
}

// Add tags to existing contact
async function addTagsToContact(contactId, tags, token) {
    const { response, data } = await ghlFetch(
        `/contacts/${contactId}/tags`,
        {
            method: 'POST',
            body: JSON.stringify({ tags })
        },
        token
    );
    return { success: response.ok, data };
}

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { firstName, lastName, email, phone, zipcode, tags = [], source = 'Website' } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !zipcode) {
        return res.status(400).json({
            error: 'Missing required fields',
            required: ['firstName', 'lastName', 'email', 'zipcode']
        });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    const GHL_API_TOKEN = process.env.GHL_API_TOKEN;
    const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

    if (!GHL_API_TOKEN || !GHL_LOCATION_ID) {
        console.error('Missing GHL environment variables');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    // Add timestamp tag to trigger workflow every time
    const timestamp = Date.now();
    const allTags = ['website-lead', `dad-submit-${timestamp}`, ...tags];

    try {
        // First, check if contact already exists (by email or phone)
        const existingContact = await findExistingContact(email, phone, GHL_LOCATION_ID, GHL_API_TOKEN);

        if (existingContact) {
            // Contact exists - add new tags to their profile
            const tagResult = await addTagsToContact(existingContact.id, allTags, GHL_API_TOKEN);

            return res.status(200).json({
                success: true,
                message: 'Thanks for your interest! We\'ll be in touch soon.',
                contactId: existingContact.id,
                tagsAdded: tagResult.success
            });
        }

        // Contact doesn't exist - create new one
        const contactPayload = {
            locationId: GHL_LOCATION_ID,
            firstName,
            lastName,
            email,
            source,
            tags: allTags,
            customFields: [
                { key: 'postal_code', value: zipcode }
            ]
        };

        if (phone) {
            contactPayload.phone = phone;
        }

        const { response, data } = await ghlFetch(
            '/contacts/',
            {
                method: 'POST',
                body: JSON.stringify(contactPayload)
            },
            GHL_API_TOKEN
        );

        if (!response.ok) {
            // Handle duplicate contact error - GHL found a match we missed
            if (data.statusCode === 400 && data.meta?.contactId) {
                console.log('Duplicate found via GHL error, updating existing contact:', data.meta.contactId);

                const tagResult = await addTagsToContact(data.meta.contactId, allTags, GHL_API_TOKEN);

                return res.status(200).json({
                    success: true,
                    message: 'Thanks for your interest! We\'ll be in touch soon.',
                    contactId: data.meta.contactId,
                    tagsAdded: tagResult.success
                });
            }

            console.error('GHL API Error:', data);
            return res.status(response.status).json({
                error: 'Failed to submit lead',
                details: data.message || 'Unknown error'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Thanks! We\'ll be in touch soon.',
            contactId: data.contact?.id,
            newContact: true
        });

    } catch (error) {
        console.error('Submit lead error:', error);
        return res.status(500).json({
            error: 'Failed to submit lead',
            details: error.message
        });
    }
}
