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

// Search for existing contact by email
async function findContactByEmail(email, locationId, token) {
    const { response, data } = await ghlFetch(
        `/contacts/search/duplicate?locationId=${locationId}&email=${encodeURIComponent(email)}`,
        { method: 'GET' },
        token
    );

    if (response.ok && data.contact) {
        return data.contact;
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

    const allTags = ['website-lead', ...tags];

    try {
        // First, check if contact already exists
        const existingContact = await findContactByEmail(email, GHL_LOCATION_ID, GHL_API_TOKEN);

        if (existingContact) {
            // Contact exists - add new tags to their profile
            const tagResult = await addTagsToContact(existingContact.id, allTags, GHL_API_TOKEN);

            if (tagResult.success) {
                return res.status(200).json({
                    success: true,
                    message: 'Thanks for your interest! We\'ll be in touch soon.',
                    contactId: existingContact.id,
                    tagsAdded: true
                });
            } else {
                console.error('Failed to add tags:', tagResult.data);
                // Still return success to user - contact exists
                return res.status(200).json({
                    success: true,
                    message: 'Thanks! We\'ll be in touch soon.',
                    contactId: existingContact.id
                });
            }
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
