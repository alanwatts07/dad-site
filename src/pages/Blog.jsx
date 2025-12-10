import React, { useState, useEffect } from 'react';
import { getBlogPosts } from '../sanity';

const Blog = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getBlogPosts()
            .then((data) => {
                setPosts(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching posts:', error);
                setLoading(false);
            });
    }, []);

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

    return (
        <div className="page-content">
            <section className="section blog-hero">
                <div className="container">
                    <h1 className="section-title fade-in">The New Energy <span className="text-gradient">Journal</span></h1>
                    <p className="lead fade-in delay-1 text-center">Stay informed and inspired.</p>

                    {posts.length === 0 ? (
                        <div className="empty-state">
                            <p>No blog posts yet. Create your first post in the Sanity Studio!</p>
                        </div>
                    ) : (
                        <div className="blog-grid fade-in delay-2">
                            {posts.map(post => (
                                <article key={post._id} className="blog-card">
                                    <div className="blog-meta">
                                        <span className="blog-category">{post.categories?.[0] || 'General'}</span>
                                        <span className="blog-date">
                                            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Draft'}
                                        </span>
                                    </div>
                                    <h3>{post.title}</h3>
                                    <p>{post.excerpt}</p>
                                    <a href={`/blog/${post.slug?.current}`} className="read-more">Read Article →</a>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Blog;
