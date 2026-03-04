import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'New Energy Initiative';
const SITE_URL = 'https://www.newenergyinitiative.com';
const DEFAULT_IMAGE = `${SITE_URL}/images/og-default.jpg`;

const SEO = ({
    title,
    description,
    canonical,
    image = DEFAULT_IMAGE,
    type = 'website',
    schema,
}) => {
    const fullTitle = title
        ? `${title} | ${SITE_NAME}`
        : `${SITE_NAME} | Clean Energy Education & Home Energy Solutions`;

    const canonicalUrl = canonical ? `${SITE_URL}${canonical}` : null;

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

            {/* Open Graph */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
            <meta property="og:site_name" content={SITE_NAME} />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* JSON-LD structured data */}
            {schema && (
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            )}
        </Helmet>
    );
};

export default SEO;
