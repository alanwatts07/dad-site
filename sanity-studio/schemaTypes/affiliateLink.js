export default {
    name: 'affiliateLink',
    title: 'Affiliate Link',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Product/Service Name',
            type: 'string',
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            description: 'Used for tagging leads (e.g., "solar-panels" → tagged as "interest-solar-panels")',
            options: {
                source: 'name',
                maxLength: 50,
            },
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'url',
            title: 'Affiliate URL',
            type: 'url',
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 3,
        },
        {
            name: 'category',
            title: 'Category',
            type: 'string',
            options: {
                list: [
                    { title: 'Smart Thermostats', value: 'thermostats' },
                    { title: 'Solar Systems', value: 'solar' },
                    { title: 'Heat Pumps', value: 'heat-pumps' },
                    { title: 'Battery Storage', value: 'batteries' },
                    { title: 'Eco Accessories', value: 'accessories' },
                ],
            },
        },
        {
            name: 'icon',
            title: 'Icon (emoji)',
            type: 'string',
            description: 'Single emoji like 🌡️ or ☀️',
        },
        {
            name: 'image',
            title: 'Product Image',
            type: 'image',
        },
        {
            name: 'ghlForm',
            title: 'Lead Capture Form',
            type: 'reference',
            to: [{ type: 'ghlForm' }],
            description: 'Optional: Attach a GHL form to this product for lead capture',
        },
    ],
}
