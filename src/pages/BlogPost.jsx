import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { client, urlFor } from '../sanity';

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
      categories
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

    return (
        <div className="page-content">
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
                        {post.body && post.body.map((block, index) => {
                            if (block._type === 'block') {
                                return (
                                    <p key={block._key || index}>
                                        {block.children.map(child => child.text).join('')}
                                    </p>
                                );
                            }
                            return null;
                        })}
                    </div>
                </div>
            </article>
        </div>
    );
};

export default BlogPost;
