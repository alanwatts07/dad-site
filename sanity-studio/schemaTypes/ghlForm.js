export default {
    name: 'ghlForm',
    title: 'GHL Form',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Form Name',
            type: 'string',
            description: 'Internal name to identify this form (e.g., "Main Contact Form", "Solar Lead Form")',
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'formId',
            title: 'GHL Form ID',
            type: 'string',
            description: 'The form ID from GoHighLevel. Found in Forms > Your Form > Integrate > look for the ID in the embed code',
            validation: (Rule) => Rule.required(),
        },
        {
            name: 'formType',
            title: 'Form Type',
            type: 'string',
            options: {
                list: [
                    { title: 'Inline Embed', value: 'inline' },
                    { title: 'Popup', value: 'popup' },
                ],
                layout: 'radio',
            },
            initialValue: 'inline',
        },
        {
            name: 'pipeline',
            title: 'Pipeline Name',
            type: 'string',
            description: 'Which GHL pipeline does this form feed into? (for your reference)',
        },
        {
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 2,
            description: 'What is this form used for?',
        },
        {
            name: 'isActive',
            title: 'Active',
            type: 'boolean',
            description: 'Turn off to hide this form from the site without deleting it',
            initialValue: true,
        },
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'pipeline',
            active: 'isActive',
        },
        prepare({ title, subtitle, active }) {
            return {
                title: `${active ? '' : '[INACTIVE] '}${title}`,
                subtitle: subtitle ? `Pipeline: ${subtitle}` : 'No pipeline set',
            }
        },
    },
}
