import React, { useState, useEffect } from 'react';
import { getAffiliateLinks, urlFor } from '../sanity';
import Modal from '../components/Modal';
import ContactForm from '../components/ContactForm';

const Products = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);

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

  // Filter products by category
  const filteredProducts = selectedCategory === 'all'
    ? displayProducts
    : displayProducts.filter(product => product.category === selectedCategory);

  // Get unique categories
  const categories = ['all', ...new Set(links.map(link => link.category).filter(Boolean))];

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

          {links.length > 0 && (
            <div className="category-filter">
              <label htmlFor="category">Filter by Category:</label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Products</option>
                {categories.filter(cat => cat !== 'all').map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="products-grid fade-in delay-2">
            {filteredProducts.map((product, index) => (
              <div key={product._id || index} className="product-card">
                {product.image && (
                  <div className="product-image">
                    <img
                      src={urlFor(product.image).width(400).height(300).fit('crop').crop('center').url()}
                      alt={product.name}
                    />
                  </div>
                )}
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className="product-card-buttons">
                  {product.url && (
                    <a href={product.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                      View Product
                    </a>
                  )}
                  <button
                    className="btn btn-secondary"
                    onClick={() => setSelectedProduct(product)}
                  >
                    I'm Interested
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="marketplace-note fade-in delay-3">
            <p>Each product listed has been vetted for quality, performance, and verified customer satisfaction.</p>
          </div>
        </div>
      </section>

      <Modal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        title={selectedProduct ? `Interested in ${selectedProduct.name}?` : ''}
      >
        {selectedProduct && (
          <ContactForm
            source={`Product Interest - ${selectedProduct.name}`}
            tags={[
              'product-interest',
              `interest-${selectedProduct.slug?.current || selectedProduct.name.toLowerCase().replace(/\s+/g, '-')}`
            ]}
            onSuccess={() => {
              setTimeout(() => setSelectedProduct(null), 3000);
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default Products;
