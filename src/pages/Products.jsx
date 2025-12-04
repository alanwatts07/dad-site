import React from 'react';

const Products = () => {
    return (
        <div className="page-content">
            <section className="section products-hero">
                <div className="container">
                    <h1 className="section-title fade-in">Explore the Best in <span className="text-gradient">New Energy</span></h1>
                    <p className="lead fade-in delay-1 text-center">The New Energy Initiative Marketplace connects you to the latest innovations.</p>

                    <div className="products-grid fade-in delay-2">
                        <div className="product-card">
                            <div className="icon">🌡️</div>
                            <h3>Smart Thermostats</h3>
                            <p>Monitor and control your home's climate from anywhere.</p>
                        </div>
                        <div className="product-card">
                            <div className="icon">☀️</div>
                            <h3>Solar Systems</h3>
                            <p>Generate your own clean power and reduce grid dependence.</p>
                        </div>
                        <div className="product-card">
                            <div className="icon">💧</div>
                            <h3>Heat Pumps</h3>
                            <p>Efficient heating and cooling for year-round comfort.</p>
                        </div>
                        <div className="product-card">
                            <div className="icon">🔋</div>
                            <h3>Battery Storage</h3>
                            <p>Store energy for backup power and peak usage times.</p>
                        </div>
                        <div className="product-card">
                            <div className="icon">🌱</div>
                            <h3>Eco Accessories</h3>
                            <p>Sustainable products for a greener home environment.</p>
                        </div>
                    </div>

                    <div className="marketplace-note fade-in delay-3">
                        <p>Each product listed has been vetted for quality, performance, and verified customer satisfaction.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Products;
