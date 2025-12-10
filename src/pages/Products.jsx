```
import React, { useState, useEffect } from 'react';
import { getAffiliateLinks } from '../sanity';

const Products = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAffiliateLinks()
      .then((data) => {
        setLinks(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching affiliate links:', error);
        setLoading(false);
      });
  }, []);

  // Fallback hardcoded products if Sanity has no data yet
  const fallbackProducts = [
    { icon: '🌡️', name: 'Smart Thermostats', description: 'Monitor and control your home\'s climate from anywhere.' },
    { icon: '☀️', name: 'Solar Systems', description: 'Generate your own clean power and reduce grid dependence.' },
    { icon: '💧', name: 'Heat Pumps', description: 'Efficient heating and cooling for year-round comfort.' },
    { icon: '🔋', name: 'Battery Storage', description: 'Store energy for backup power and peak usage times.' },
    { icon: '🌱', name: 'Eco Accessories', description: 'Sustainable products for a greener home environment.' },
  ];

  const displayProducts = links.length > 0 ? links : fallbackProducts;

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
      <section className="section products-hero">
        <div className="container">
          <h1 className="section-title fade-in">Explore the Best in <span className="text-gradient">New Energy</span></h1>
          <p className="lead fade-in delay-1 text-center">The New Energy Initiative Marketplace connects you to the latest innovations.</p>
          
          <div className="products-grid fade-in delay-2">
            {displayProducts.map((product, index) => (
              <div key={product._id || index} className="product-card">
                <div className="icon">{product.icon || '⚡'}</div>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                {product.url && (
                  <a href={product.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                    View Product →
                  </a>
                )}
              </div>
            ))}
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
```
