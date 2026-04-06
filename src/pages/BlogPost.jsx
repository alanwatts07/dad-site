import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { client, urlFor } from '../sanity';
import SEO from '../components/SEO';

// Render a single span with its marks (bold, italic, links)
const renderSpan = (span, markDefs = []) => {
    let content = span.text;
    if (!span.marks || span.marks.length === 0) return content;

    for (const mark of span.marks) {
        if (mark === 'strong') {
            content = <strong key={span._key + '-strong'}>{content}</strong>;
        } else if (mark === 'em') {
            content = <em key={span._key + '-em'}>{content}</em>;
        } else {
            // Check markDefs for links
            const def = markDefs.find(d => d._key === mark);
            if (def && def._type === 'link') {
                content = <a key={span._key + '-link'} href={def.href} target="_blank" rel="noopener noreferrer">{content}</a>;
            }
        }
    }
    return content;
};

// Render a portable text block with proper element type
const renderBlock = (block, index) => {
    if (block._type === 'image') {
        return (
            <figure key={block._key || index} className="post-inline-image">
                <img src={urlFor(block).width(800).url()} alt={block.alt || ''} />
                {block.alt && <figcaption>{block.alt}</figcaption>}
            </figure>
        );
    }

    if (block._type !== 'block') return null;

    const children = block.children?.map(span => (
        <React.Fragment key={span._key}>{renderSpan(span, block.markDefs)}</React.Fragment>
    ));

    const style = block.style || 'normal';

    // List items are handled by grouping below
    if (block.listItem) {
        return <li key={block._key || index}>{children}</li>;
    }

    switch (style) {
        case 'h1': return <h1 key={block._key || index}>{children}</h1>;
        case 'h2': return <h2 key={block._key || index}>{children}</h2>;
        case 'h3': return <h3 key={block._key || index}>{children}</h3>;
        case 'h4': return <h4 key={block._key || index}>{children}</h4>;
        case 'blockquote': return <blockquote key={block._key || index}>{children}</blockquote>;
        default: return <p key={block._key || index}>{children}</p>;
    }
};

// Group list items into <ul>/<ol> wrappers
const renderBody = (body) => {
    if (!body) return null;
    const elements = [];
    let i = 0;

    while (i < body.length) {
        const block = body[i];

        if (block._type === 'block' && block.listItem) {
            const listType = block.listItem;
            const Tag = listType === 'number' ? 'ol' : 'ul';
            const items = [];
            while (i < body.length && body[i]._type === 'block' && body[i].listItem === listType) {
                items.push(renderBlock(body[i], i));
                i++;
            }
            elements.push(<Tag key={`list-${i}`}>{items}</Tag>);
        } else {
            elements.push(renderBlock(block, i));
            i++;
        }
    }

    return elements;
};

const BlogPost = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        client.fetch(`*[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      author,
      mainImage,
      body,
      categories,
      metaDescription,
      focusKeyword
    }`, { slug })
            .then((data) => {
                setPost(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching post:', error);
                setLoading(false);
            });
    }, [slug]);

    if (loading) {
        return (
            <div className="page-content">
                <section className="section">
                    <div className="container">
                        <h1 className="section-title">Loading...</h1>
                    </div>
                </section>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="page-content">
                <section className="section">
                    <div className="container">
                        <h1 className="section-title">Post not found</h1>
                    </div>
                </section>
            </div>
        );
    }

    const postImage = post.mainImage ? urlFor(post.mainImage).width(1200).url() : undefined;

    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        description: post.excerpt || '',
        image: postImage,
        datePublished: post.publishedAt,
        author: {
            '@type': 'Person',
            name: post.author || 'New Energy Initiative',
        },
        publisher: {
            '@type': 'Organization',
            name: 'New Energy Initiative',
            url: 'https://www.newenergyinitiative.com',
        },
    };

    return (
        <div className="page-content">
            <SEO
                title={post.title}
                description={post.metaDescription || post.excerpt || `Read ${post.title} on the New Energy Initiative Journal.`}
                canonical={`/blog/${post.slug?.current}`}
                image={postImage}
                type="article"
                schema={articleSchema}
            />
            <article className="section blog-post">
                <div className="container">
                    <div className="post-header">
                        <h1 className="section-title">{post.title}</h1>
                        <div className="post-meta">
                            <span>{post.author || 'Anonymous'}</span>
                            <span>•</span>
                            <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Draft'}</span>
                            {post.categories && post.categories.length > 0 && (
                                <>
                                    <span>•</span>
                                    <span>{post.categories.join(', ')}</span>
                                </>
                            )}
                        </div>
                    </div>

                    {post.mainImage && (
                        <div className="post-image">
                            <img
                                src={urlFor(post.mainImage).width(1200).url()}
                                alt={post.title}
                            />
                        </div>
                    )}

                    <div className="post-content">
                        {renderBody(post.body)}
                    </div>
                </div>
            </article>
        </div>
    );
};

export default BlogPost;
