// Vercel Serverless Function - submits leads to GoHighLevel API v2
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

    // Build the contact payload for GHL API v2
    const contactPayload = {
        locationId: GHL_LOCATION_ID,
        firstName,
        lastName,
        email,
        source,
        tags: ['website-lead', ...tags],
        customFields: [
            { key: 'postal_code', value: zipcode }
        ]
    };

    // Only add phone if provided
    if (phone) {
        contactPayload.phone = phone;
    }

    try {
        const response = await fetch('https://services.leadconnectorhq.com/contacts/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GHL_API_TOKEN}`,
                'Content-Type': 'application/json',
                'Version': '2021-07-28'
            },
            body: JSON.stringify(contactPayload)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('GHL API Error:', data);

            // Handle duplicate contact
            if (response.status === 400 && data.message?.includes('duplicate')) {
                return res.status(200).json({
                    success: true,
                    message: 'Thanks! We already have your info and will be in touch.',
                    duplicate: true
                });
            }

            return res.status(response.status).json({
                error: 'Failed to submit lead',
                details: data.message || 'Unknown error'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Thanks! We\'ll be in touch soon.',
            contactId: data.contact?.id
        });

    } catch (error) {
        console.error('Submit lead error:', error);
        return res.status(500).json({
            error: 'Failed to submit lead',
            details: error.message
        });
    }
}
