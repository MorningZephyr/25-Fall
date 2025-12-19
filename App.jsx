import { useState, useEffect } from 'react';
import MenuItem from './components/MenuItem';
import CartItem from './components/CartItem';
import './styles.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);

  // Fetch menu items from backend
  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/menu`);
      if (!response.ok) {
        throw new Error('Failed to fetch menu items');
      }
      const data = await response.json();
      setMenuItems(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching menu:', err);
      setError('Unable to load menu. Please try again later.');
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (name, price) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.name === name);
      if (existingItem) {
        return prevCart.map(item =>
          item.name === name ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { name, price, quantity: 1 }];
    });
  };

  const removeItem = (name) => {
    setCart(prevCart => prevCart.filter(item => item.name !== name));
  };

  const clearCart = () => {
    setCart([]);
    setOrderStatus(null);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    try {
      const orderData = {
        items: cart,
        totalPrice: totalPrice,
        totalItems: totalItems,
        orderDate: new Date()
      };

      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      const result = await response.json();
      console.log('Order placed:', result);
      
      setOrderStatus({
        success: true,
        message: 'Order placed successfully! Thank you for your order.',
        orderId: result.order._id
      });
      
      // Clear cart after successful order
      setTimeout(() => {
        setCart([]);
        setOrderStatus(null);
        setIsCartOpen(false);
      }, 3000);

    } catch (err) {
      console.error('Error placing order:', err);
      setOrderStatus({
        success: false,
        message: 'Failed to place order. Please try again.'
      });
    }
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <>
      {/* Navigation */}
      <nav>
        <a className="nav-logo" href="#hero">
          <img src="/images/logo.png" alt="Poke Bowl logo" />
        </a>

        <input 
          type="checkbox" 
          id="nav-toggle" 
          className="nav-toggle" 
          checked={isMenuOpen}
          onChange={(e) => setIsMenuOpen(e.target.checked)}
        />
        <label htmlFor="nav-toggle" className="nav-hamburger">
          <i className="fa fa-bars"></i>
        </label>

        <div className="nav-links">
          <a href="#hero" onClick={() => setIsMenuOpen(false)}>Home</a>
          <a href="#menu" onClick={() => setIsMenuOpen(false)}>Menu</a>
          <a href="#about" onClick={() => setIsMenuOpen(false)}>About Us</a>
          <a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a>
        </div>

        <button 
          id="cart-btn" 
          className="cart-button" 
          aria-label="Shopping Cart"
          onClick={() => setIsCartOpen(true)}
        >
          <i className="fa fa-shopping-cart"></i>
          <span className="cart-count">{totalItems}</span>
        </button>
      </nav>

      {/* Hero Section */}
      <section id="hero">
        <div className="hero-content">
          <h1><span className="title-box">Poke Bowl</span></h1>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu">
        <div className="container">
          <h2>Our Menu</h2>
          {loading ? (
            <p style={{ textAlign: 'center', padding: '2rem' }}>Loading menu...</p>
          ) : error ? (
            <p style={{ textAlign: 'center', padding: '2rem', color: '#ff6b6b' }}>{error}</p>
          ) : (
            <table className="menu-table">
              <thead>
                <tr>
                  <th scope="col">Item</th>
                  <th scope="col">Description</th>
                  <th scope="col">Price</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map((item, index) => (
                  <MenuItem 
                    key={item._id || index} 
                    item={item} 
                    onAddToCart={addToCart} 
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery">
        <h2>Gallery</h2>
        <div className="gallery-container">
          {[1, 2, 3, 4, 5, 6].map(num => (
            <img 
              key={num}
              src={`/images/sample${num}.png`} 
              alt={`Sample Poke Bowl ${num}`} 
            />
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about">
        <h2>About Us</h2>
        <div className="container">
          <p>
            Founded in 2016 by a pair of friends who missed the bright, simple flavors of the Hawaiian coast, 
            Poke Bowl started as a tiny weekend stall and quickly grew into the neighborhood spot it is today. 
            Our mission is the same now as on day one: serve honest, seasonal food that feels both fresh and familiar. 
            Try our Park Ave Classic—soy-citrus salmon, house pickles, and sesame-scallion rice—which became a local 
            favorite the first week we opened. We source responsibly, support local farmers, and cook with a lot of heart.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact">
        <h2>Our Location</h2>
        <div className="container">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6043.470822793999!2d-73.96710402449877!3d40.76784383419581!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c258eb899f0889%3A0xb5e90aa7d877ee1f!2sHunter%20College!5e0!3m2!1sen!2sus!4v1759794924876!5m2!1sen!2sus" 
            width="600" 
            height="450" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          />
          <section id="contact-form">
            <h2>Contact / Reservation</h2>
            <form action="https://formspree.io/f/your-form-id" method="POST">
              <label htmlFor="name">Full name</label>
              <input id="name" name="name" type="text" required />

              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required />

              <label htmlFor="phone">Phone</label>
              <input id="phone" name="phone" type="tel" />

              <label htmlFor="date">Reservation date</label>
              <input id="date" name="date" type="date" />

              <label htmlFor="people">Party size</label>
              <input id="people" name="people" type="number" min="1" max="20" defaultValue="2" required />

              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" rows="4" required />

              <button type="submit">Send</button>
            </form>
          </section>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-content">
          <div className="footer-section">
            <h3>Follow Us</h3>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener" aria-label="Facebook">Facebook</a>
              <a href="https://instagram.com" target="_blank" rel="noopener" aria-label="Instagram">Instagram</a>
              <a href="https://twitter.com" target="_blank" rel="noopener" aria-label="Twitter">Twitter</a>
            </div>
          </div>

          <div className="footer-section">
            <h3>Business Hours</h3>
            <p>Monday - Friday: 11:00 AM - 9:00 PM</p>
            <p>Saturday: 12:00 PM - 10:00 PM</p>
            <p>Sunday: 12:00 PM - 8:00 PM</p>
          </div>
        </div>

        <p className="footer-copyright">&copy; 2025 Poke Bowl. All rights reserved.</p>
      </footer>

      {/* Shopping Cart Modal */}
      {isCartOpen && (
        <div className="cart-modal active">
          <div className="cart-modal-content">
            <div className="cart-header">
              <h2>Shopping Cart</h2>
              <button 
                className="close-cart-btn"
                onClick={() => setIsCartOpen(false)}
              >
                &times;
              </button>
            </div>
            
            <div className="cart-items">
              {orderStatus && (
                <div className={`order-status ${orderStatus.success ? 'success' : 'error'}`}>
                  {orderStatus.message}
                  {orderStatus.orderId && (
                    <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
                      Order ID: {orderStatus.orderId}
                    </p>
                  )}
                </div>
              )}
              {cart.length === 0 ? (
                <p className="cart-empty">Your cart is empty</p>
              ) : (
                cart.map((item, index) => (
                  <CartItem 
                    key={index} 
                    item={item} 
                    onRemove={removeItem} 
                  />
                ))
              )}
            </div>

            <div className="cart-footer">
              <div className="cart-total">
                <strong>Total:</strong>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <button className="clear-cart-btn" onClick={clearCart}>
                Clear Cart
              </button>
              <button 
                className="checkout-btn" 
                onClick={handleCheckout}
                disabled={cart.length === 0}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
