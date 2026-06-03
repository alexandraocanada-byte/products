/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, 
  Menu, 
  ArrowRight, 
  Heart, 
  Search, 
  X, 
  Plus, 
  Minus, 
  Info, 
  Scale, 
  ShieldCheck, 
  Check, 
  CornerDownLeft,
  ShoppingBag as CartIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { products } from './data';
import { Product, CartItem } from './types';

export default function App() {
  // State management
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  
  // Checkout flow states
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'form' | 'success'>('cart');
  const [shippingForm, setShippingForm] = useState({
    name: 'Jane Doe',
    email: 'jane@example.com',
    address: '124 Luxury Ave',
    city: 'Lehi',
    zip: '84043',
    card: '•••• •••• •••• 4242'
  });

  // Unique categories list
  const categories = useMemo(() => {
    return ['All', ...Array.from(new Set(products.map(p => p.category)))];
  }, []);

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchQuery = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  // Wishlist handler
  const toggleWishlist = (productId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid opening product details modal
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId) 
        : [...prev, productId]
    );
  };

  // Cart Handlers
  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    
    // Auto-open cart for delightful feedback
    setIsCartOpen(true);
  };

  const updateCartQuantity = (productId: number, amount: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + amount;
          return { ...item, quantity: newQty < 1 ? 1 : newQty };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const totalCartItems = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }, [cart]);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutStep('success');
    // Clear cart upon successful simulation
    setTimeout(() => {
      setCart([]);
    }, 1500);
  };

  const scrollToProducts = () => {
    const section = document.getElementById('shop-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans antialiased selection:bg-neutral-950 selection:text-white">
      
      {/* Header / Navigation */}
      <header className="sticky top-0 z-40 bg-neutral-50/80 backdrop-blur-md border-b border-neutral-100">
        <div className="flex items-center justify-between px-6 py-5 max-w-7xl mx-auto w-full">
          {/* Logo Branding */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-widest text-neutral-950 uppercase">Form & Function</span>
          </div>

          {/* Desktop Nav Actions */}
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => { setSelectedCategory('All'); scrollToProducts(); }} 
              className="text-sm font-medium hover:text-neutral-500 transition-colors cursor-pointer"
            >
              Shop All
            </button>
            <button 
              onClick={() => { setSelectedCategory('Seating'); scrollToProducts(); }} 
              className="text-sm font-medium hover:text-neutral-500 transition-colors cursor-pointer"
            >
              Seating
            </button>
            <button 
              onClick={() => { setSelectedCategory('Lighting'); scrollToProducts(); }} 
              className="text-sm font-medium hover:text-neutral-500 transition-colors cursor-pointer"
            >
              Lighting
            </button>
          </div>

          <div className="flex items-center gap-4">
            {/* Wishlist Indication */}
            {wishlist.length > 0 && (
              <div className="flex items-center gap-1.5 text-rose-500 px-3 py-1 rounded-full bg-rose-50 border border-rose-100/50 text-xs font-semibold">
                <Heart className="w-3.5 h-3.5 fill-rose-500" />
                <span>{wishlist.length}</span>
              </div>
            )}

            {/* Shopping Bag Icon with Active Items Counter */}
            <button 
              onClick={() => { setIsCartOpen(true); setCheckoutStep('cart'); }}
              className="relative p-2.5 rounded-full border border-neutral-200 hover:border-neutral-400 bg-white transition-all flex items-center justify-center cursor-pointer"
              aria-label="Toggle Shopping Cart"
            >
              <ShoppingBag className="w-4.5 h-4.5 text-neutral-800" />
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-neutral-950 text-white font-mono text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center scale-90 border-2 border-neutral-50">
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Icon */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 md:hidden rounded-full border border-neutral-200 hover:border-neutral-400 bg-white transition-all cursor-pointer"
              aria-label="Toggle Mobile Navigation"
            >
              <Menu className="w-4.5 h-4.5 text-neutral-800" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Panel */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-neutral-100 bg-neutral-50 divide-y divide-neutral-100/60 overflow-hidden"
            >
              <div className="flex flex-col p-6 gap-4">
                <button 
                  onClick={() => { setSelectedCategory('All'); setIsMobileMenuOpen(false); scrollToProducts(); }} 
                  className="text-left text-base font-medium py-1.5 text-neutral-800"
                >
                  Shop Custom Collection
                </button>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => { setSelectedCategory(cat); setIsMobileMenuOpen(false); scrollToProducts(); }}
                      className={`text-slate-700 text-sm px-3 py-2 rounded-xl border text-left font-medium ${selectedCategory === cat ? 'bg-neutral-950 text-white border-neutral-950' : 'bg-white border-neutral-200'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Editorial Modern Hero Block */}
        <motion.section 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative bg-neutral-900 text-white rounded-3xl overflow-hidden mb-16 shadow-lg"
        >
          {/* Subtle textured overlay */}
          <div className="absolute inset-0 bg-neutral-950/60 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1600" 
            alt="Interior high-end visual design"
            className="absolute inset-0 w-full h-full object-cover select-none scale-105 pointer-events-none filter brightness-90 animate-[pulse_12s_ease-in-out_infinite]"
            referrerPolicy="no-referrer"
          />
          <div className="relative z-20 p-8 md:p-20 flex flex-col justify-end min-h-[500px] md:min-h-[560px] max-w-2xl">
            <span className="text-sm font-semibold tracking-widest text-[#d5c3b1] uppercase mb-4">Summer Collection 2026</span>
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.1] mb-6">
              Designed for luxury.<br />Crafted for eternity.
            </h1>
            <p className="text-neutral-300 text-base md:text-lg mb-10 leading-relaxed font-light">
              Explore an array of custom spatial items curated down to the thread. Premium sustainable materials, artisanal craftsmanship, and modern geometric functionality.
            </p>
            <div>
              <button 
                onClick={scrollToProducts}
                className="inline-flex items-center gap-2.5 bg-white text-neutral-950 px-7 py-3.5 rounded-full font-semibold hover:bg-[#eae1d8] hover:scale-102 transition-all cursor-pointer shadow-md"
              >
                Browse Collection <ArrowRight className="w-4 h-4 text-neutral-950" />
              </button>
            </div>
          </div>
        </motion.section>

        {/* Live Shop Filters & Interactive Search Section */}
        <section id="shop-section" className="py-8 scroll-mt-24">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-12 border-b border-neutral-200 pb-8">
            <div>
              <span className="text-xs font-semibold tracking-widest text-neutral-400 uppercase">Interactive Catalog</span>
              <h2 className="text-3xl font-bold text-neutral-900 tracking-tight mt-1">Curated Interior Architecture</h2>
            </div>

            {/* Combined Filter Buttons and Real-Time Search */}
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              {/* Dynamic search input */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-neutral-400 pointer-events-none" />
                <input 
                  type="text"
                  placeholder="Search pieces (e.g., Oak, Chair)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm bg-white border border-neutral-200 rounded-full focus:outline-none focus:ring-1 focus:ring-neutral-900 focus:border-neutral-900 transition-all font-mono"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-3 w-5 h-5 text-neutral-400 hover:text-neutral-900 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Grid-sized Category list */}
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none max-w-full">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide whitespace-nowrap transition-all cursor-pointer border ${
                      selectedCategory === category 
                        ? 'bg-neutral-950 text-white border-neutral-950 shadow-sm' 
                        : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Products Grid */}
          <AnimatePresence mode="popLayout">
            {filteredProducts.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-24 bg-white rounded-2xl border border-neutral-100"
              >
                <p className="text-neutral-400 font-mono text-xs mb-2">RESULT_EMPTY</p>
                <h3 className="text-xl font-medium text-neutral-700">No matching furniture pieces found</h3>
                <p className="text-neutral-400 max-w-md mx-auto mt-2 text-sm">
                  Try checking your spelling, selecting a different active category filter, or resetting search queries.
                </p>
                <button 
                  onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                  className="mt-6 inline-flex items-center gap-2 bg-neutral-950 text-white px-5 py-2.5 rounded-full text-xs font-semibold hover:bg-neutral-800 transition cursor-pointer"
                >
                  Clear All Filters
                </button>
              </motion.div>
            ) : (
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
              >
                {filteredProducts.map((product) => (
                  <motion.div 
                    layout
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="group bg-white rounded-3xl border border-neutral-100 p-5 hover:border-neutral-300 hover:shadow-lg transition-all relative flex flex-col justify-between"
                  >
                    <div>
                      {/* Product Card Image Container */}
                      <div 
                        onClick={() => setSelectedProduct(product)}
                        className="relative bg-neutral-100/60 aspect-[4/5] rounded-2xl overflow-hidden mb-5 cursor-pointer group"
                      >
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 select-none"
                          referrerPolicy="no-referrer"
                        />
                        {/* Overlay quick view hover effect */}
                        <div className="absolute inset-0 bg-neutral-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="bg-white/95 backdrop-blur-sm text-neutral-900 text-xs font-semibold px-4.5 py-2.5 rounded-full shadow-sm tracking-wide">
                            Quick View
                          </span>
                        </div>

                        {/* Top corner category tag */}
                        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm border border-neutral-100 text-[10px] font-bold text-neutral-700 tracking-wider uppercase px-2.5 py-1 rounded-md">
                          {product.category}
                        </span>

                        {/* Interactive Favorite / Wishlist Button */}
                        <button
                          type="button"
                          onClick={(e) => toggleWishlist(product.id, e)}
                          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm border border-neutral-100 hover:bg-white text-neutral-700 hover:scale-110 active:scale-95 shadow-sm transition-all cursor-pointer z-20"
                          aria-label="Add to Wishlist"
                        >
                          <Heart 
                            className={`w-4 h-4 transition-colors ${
                              wishlist.includes(product.id) ? 'fill-rose-500 text-rose-500' : 'text-neutral-500'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Product Meta */}
                      <div className="px-1">
                        <span className="text-[10px] font-mono tracking-wider text-neutral-400 uppercase">ID #{String(product.id).padStart(3, '0')}</span>
                        <h3 
                          onClick={() => setSelectedProduct(product)}
                          className="text-base font-semibold text-neutral-900 cursor-pointer hover:text-neutral-600 transition-colors mt-0.5 line-clamp-1"
                        >
                          {product.name}
                        </h3>
                        {/* Dynamic Sub-description of Material */}
                        <p className="text-xs text-neutral-400 mt-1 truncate">{product.material}</p>
                      </div>
                    </div>

                    {/* Footer price & Click purchase action */}
                    <div className="mt-4 px-1 pt-3 border-t border-neutral-100/60 flex items-center justify-between">
                      <span className="text-base font-bold text-neutral-950">{product.formattedPrice}</span>
                      <button 
                        type="button"
                        onClick={() => addToCart(product, 1)}
                        className="bg-neutral-950 text-white hover:bg-neutral-800 text-xs font-semibold px-4 py-2 rounded-full transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Brand Core Values Section */}
        <section className="mt-28 py-16 bg-neutral-100/50 rounded-3xl border border-neutral-200/40 p-8 md:p-16 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="p-3 bg-neutral-200/50 rounded-xl w-fit mb-5">
              <Scale className="w-6 h-6 text-neutral-800" />
            </div>
            <h4 className="text-lg font-bold mb-2">Sustainable Materials</h4>
            <p className="text-sm text-neutral-500 leading-relaxed">
              We source our European oak and premium fabrics solely from certified sustainable forests and ethically-vetted circular organic weavers.
            </p>
          </div>
          <div>
            <div className="p-3 bg-neutral-200/50 rounded-xl w-fit mb-5">
              <ShieldCheck className="w-6 h-6 text-neutral-800" />
            </div>
            <h4 className="text-lg font-bold mb-2">10-Year Craft Guarantee</h4>
            <p className="text-sm text-neutral-500 leading-relaxed">
              Every joint is secured using timeless carpentry techniques and structural engineering made to robustly withstand decades of household living.
            </p>
          </div>
          <div>
            <div className="p-3 bg-neutral-200/50 rounded-xl w-fit mb-5">
              <Info className="w-6 h-6 text-neutral-800" />
            </div>
            <h4 className="text-lg font-bold mb-2">Sculptural Ergonomics</h4>
            <p className="text-sm text-neutral-500 leading-relaxed">
              We reject visually shallow ornamentation. Comfort guides form: each angle is tuned to follow real spinal geometry for active relief.
            </p>
          </div>
        </section>
      </main>

      {/* Footer Decoration */}
      <footer className="border-t border-neutral-200 mt-32 bg-white text-neutral-500 py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <span className="text-lg font-bold text-neutral-900 tracking-widest uppercase">Form & Function</span>
            <p className="text-sm mt-3 max-w-sm leading-relaxed">
              Premium minimalist interior design assets meticulously assembled. Our pieces exist to harmonize texture, scale, and living.
            </p>
          </div>
          <div>
            <h5 className="text-xs font-bold font-mono text-neutral-900 uppercase tracking-widest mb-4">Categories</h5>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => { setSelectedCategory('Seating'); scrollToProducts(); }} className="hover:text-neutral-900">Seating Systems</button></li>
              <li><button onClick={() => { setSelectedCategory('Dining'); scrollToProducts(); }} className="hover:text-neutral-900">Dining Tables</button></li>
              <li><button onClick={() => { setSelectedCategory('Lighting'); scrollToProducts(); }} className="hover:text-neutral-900">Sculptural Lighting</button></li>
              <li><button onClick={() => { setSelectedCategory('Decor'); scrollToProducts(); }} className="hover:text-neutral-900">Textiles & Decor</button></li>
            </ul>
          </div>
          <div>
            <h5 className="text-xs font-bold font-mono text-neutral-900 uppercase tracking-widest mb-4">Location</h5>
            <p className="text-sm leading-relaxed">
              Studio & Atelier<br />
              100 Scandinavian Hwy<br />
              Copenhagen, DK
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <span>&copy; {new Date().getFullYear()} Form & Function Interior. All rights reserved.</span>
          <div className="flex gap-4">
            <a href="#" className="hover:text-neutral-900">Terms of Use</a>
            <a href="#" className="hover:text-neutral-900">Privacy Policy</a>
          </div>
        </div>
      </footer>

      {/* PRODUCT DETAILS DIALOG/MODAL */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal Backdrop overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="relative bg-white rounded-3xl overflow-hidden max-w-4xl w-full shadow-2xl z-10 grid grid-cols-1 md:grid-cols-12 max-h-[90vh] md:max-h-none overflow-y-auto"
            >
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/90 border border-neutral-200 hover:bg-neutral-100 hover:scale-105 active:scale-95 shadow-sm transition-all cursor-pointer z-35"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-neutral-800" />
              </button>

              <div className="md:col-span-6 bg-neutral-100 relative max-h-[350px] md:max-h-full">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name} 
                  className="w-full h-full object-cover min-h-[300px] md:min-h-[500px]"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="md:col-span-6 p-8 md:p-12 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold font-mono tracking-widest text-[#9d836b] bg-neutral-100 px-2.5 py-1 rounded uppercase">
                      {selectedProduct.category}
                    </span>
                    <span className="text-xs font-mono text-neutral-400">ID #{String(selectedProduct.id).padStart(3, '0')}</span>
                  </div>
                  
                  <h3 className="text-3xl font-bold tracking-tight text-neutral-900 mb-2">{selectedProduct.name}</h3>
                  <p className="text-2xl font-bold text-neutral-950 mb-6">${selectedProduct.price}</p>
                  
                  <p className="text-neutral-500 text-sm leading-relaxed mb-6 font-light">
                    {selectedProduct.description}
                  </p>

                  <div className="space-y-3 bg-neutral-50 p-4 rounded-2xl border border-neutral-200/50 text-xs text-neutral-600 mb-8 font-mono">
                    <div className="flex justify-between">
                      <span className="text-neutral-400 font-medium">DIMENSIONS:</span>
                      <span className="text-neutral-800 font-bold">{selectedProduct.dimensions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400 font-medium">COMPOSITION:</span>
                      <span className="text-neutral-800 font-bold text-right truncate max-w-[180px]">{selectedProduct.material}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400 font-medium">WARRANTY:</span>
                      <span className="text-green-600 font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" /> 10 Years Covered
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => {
                      addToCart(selectedProduct, 1);
                      setSelectedProduct(null);
                    }}
                    className="flex-1 bg-neutral-950 text-white hover:bg-neutral-850 px-6 py-4 rounded-2xl text-sm font-semibold transition-all cursor-pointer shadow-lg hover:shadow-xl active:scale-98 flex items-center justify-center gap-2"
                  >
                    <CartIcon className="w-4 h-4" /> Add to Cart — ${selectedProduct.price}
                  </button>
                  <button 
                    onClick={(e) => toggleWishlist(selectedProduct.id, e)}
                    className="bg-white hover:bg-neutral-50 px-5 py-4 rounded-2xl border border-neutral-200 text-neutral-700 transition flex items-center justify-center cursor-pointer"
                  >
                    <Heart className={`w-5 h-5 ${wishlist.includes(selectedProduct.id) ? 'fill-rose-500 text-rose-500' : 'text-neutral-500'}`} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SHOPPING CART SLIDE-OVER SIDE DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              {/* Drawer glass backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsCartOpen(false)}
                className="absolute inset-0 bg-neutral-900/30 backdrop-blur-xs transition-opacity"
              />

              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <motion.div 
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                  className="pointer-events-auto w-screen max-w-md"
                >
                  <div className="flex h-full flex-col bg-white shadow-2xl">
                    
                    {/* Drawer Header */}
                    <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100">
                      <div className="flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-neutral-900" />
                        <h4 className="text-lg font-bold text-neutral-900">Your Basket</h4>
                        {totalCartItems > 0 && (
                          <span className="bg-neutral-100 text-neutral-800 text-xs font-bold px-2 py-0.5 rounded-full font-mono">
                            {totalCartItems}
                          </span>
                        )}
                      </div>
                      <button 
                        onClick={() => setIsCartOpen(false)}
                        className="p-2 -mr-2 rounded-full text-neutral-400 hover:text-neutral-500 hover:bg-neutral-50 transition cursor-pointer"
                        aria-label="Close cart side menu"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Drawer Body Area */}
                    <div className="flex-1 overflow-y-auto p-6">
                      {checkoutStep === 'success' ? (
                        <div className="flex flex-col items-center justify-center text-center h-full py-12">
                          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 mb-6 animate-bounce">
                            <Check className="h-8 w-8" />
                          </div>
                          <h5 className="text-2xl font-bold text-neutral-900 mb-2">Order Confirmed!</h5>
                          <p className="text-neutral-400 font-mono text-xs mb-4">TXN_ID #F-F-{Math.floor(100000 + Math.random() * 900000)}</p>
                          <p className="text-sm text-neutral-500 max-w-xs leading-relaxed">
                            Thank you for your purchase. We are preparing your order. A receipt and shipping tracking link has been sent to <span className="font-semibold text-neutral-800">{shippingForm.email}</span>.
                          </p>
                          <button 
                            type="button" 
                            onClick={() => {
                              setIsCartOpen(false);
                              setCheckoutStep('cart');
                            }}
                            className="mt-8 bg-neutral-950 text-white hover:bg-neutral-800 px-6 py-3 rounded-full text-xs font-semibold cursor-pointer transition"
                          >
                            Keep Exploring
                          </button>
                        </div>
                      ) : checkoutStep === 'form' ? (
                        /* Shipping form step */
                        <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                          <h5 className="text-base font-bold text-neutral-900 border-b border-neutral-100 pb-2">Delivery & Settlement Information</h5>
                          <div>
                            <label className="block text-[10px] font-bold font-mono tracking-wider text-neutral-400 uppercase mb-1">RECIPIENT FULL NAME</label>
                            <input 
                              type="text" 
                              required
                              value={shippingForm.name}
                              onChange={(e) => setShippingForm({ ...shippingForm, name: e.target.value })}
                              className="w-full text-sm px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold font-mono tracking-wider text-neutral-400 uppercase mb-1">EMAIL ADDRESS</label>
                            <input 
                              type="email" 
                              required
                              value={shippingForm.email}
                              onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                              className="w-full text-sm px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold font-mono tracking-wider text-neutral-400 uppercase mb-1">STREET ADDRESS</label>
                            <input 
                              type="text" 
                              required
                              value={shippingForm.address}
                              onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                              className="w-full text-sm px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[10px] font-bold font-mono tracking-wider text-neutral-400 uppercase mb-1">CITY</label>
                              <input 
                                type="text"
                                required 
                                value={shippingForm.city}
                                onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                                className="w-full text-sm px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold font-mono tracking-wider text-neutral-400 uppercase mb-1">ZIP / POSTAL CODE</label>
                              <input 
                                type="text" 
                                required
                                value={shippingForm.zip}
                                onChange={(e) => setShippingForm({ ...shippingForm, zip: e.target.value })}
                                className="w-full text-sm px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-900 animate-none"
                              />
                            </div>
                          </div>
                          <div className="pt-2">
                            <label className="block text-[10px] font-bold font-mono tracking-wider text-neutral-400 uppercase mb-1">PAYMENT DETAILS</label>
                            <div className="relative">
                              <input 
                                type="text" 
                                disabled
                                value={shippingForm.card}
                                className="w-full text-sm px-4 py-3 border border-neutral-200 rounded-xl bg-neutral-50 text-neutral-500 cursor-not-allowed select-none"
                              />
                              <span className="absolute right-3.5 top-3.5 text-[10px] font-bold font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">TEST CREDENTIALS</span>
                            </div>
                          </div>
                          <div className="pt-6 grid grid-cols-2 gap-3">
                            <button 
                              type="button" 
                              onClick={() => setCheckoutStep('cart')}
                              className="border border-neutral-200 hover:bg-neutral-50 font-bold py-3 px-4 rounded-xl text-xs text-neutral-700 cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <CornerDownLeft className="w-4 h-4" /> Edit cart
                            </button>
                            <button 
                              type="submit" 
                              className="bg-neutral-950 text-white hover:bg-neutral-800 font-bold py-3 px-4 rounded-xl text-xs cursor-pointer text-center flex items-center justify-center gap-1"
                            >
                              Finish Order — ${(cartSubtotal * 1.08 + 15).toFixed(2)}
                            </button>
                          </div>
                        </form>
                      ) : cart.length === 0 ? (
                        /* Empty state */
                        <div className="flex flex-col items-center justify-center text-center h-full py-12">
                          <ShoppingBag className="w-12 h-12 text-neutral-200 mb-4 animate-[pulse_3s_ease-in-out_infinite]" />
                          <h5 className="text-lg font-bold text-neutral-800">Your basket is empty</h5>
                          <p className="text-neutral-400 text-sm max-w-xs mt-1 font-light leading-relaxed">
                            No curated assets have been collected yet. Enhance your comfort by adding modern chairs or lighting.
                          </p>
                          <button 
                            onClick={() => setIsCartOpen(false)}
                            className="mt-6 bg-neutral-950 text-white hover:bg-neutral-850 px-6 py-3 rounded-full text-xs font-semibold transition-all cursor-pointer shadow-md"
                          >
                            Return to catalog
                          </button>
                        </div>
                      ) : (
                        /* Cart List items */
                        <div className="space-y-6">
                          {cart.map((item) => (
                            <div key={item.product.id} className="flex gap-4 border-b border-neutral-100 pb-5 items-start">
                              <img 
                                src={item.product.image} 
                                alt={item.product.name} 
                                className="w-20 h-24 object-cover bg-neutral-100 rounded-xl border border-neutral-100 shadow-xs flex-shrink-0"
                                referrerPolicy="no-referrer"
                              />
                              <div className="flex-1 min-w-0">
                                <span className="text-[9px] font-bold font-mono tracking-widest text-[#a0856c] block uppercase">{item.product.category}</span>
                                <h5 className="text-sm font-semibold text-neutral-900 truncate mt-0.5">{item.product.name}</h5>
                                <p className="text-xs text-neutral-400 mt-1 truncate">{item.product.material}</p>
                                <span className="text-sm font-mono text-neutral-900 font-bold block mt-2">${item.product.price} each</span>
                                
                                <div className="flex items-center justify-between mt-3">
                                  {/* Qty controller */}
                                  <div className="flex items-center gap-1 bg-neutral-50 border border-neutral-200/80 rounded-full px-2 py-1">
                                    <button 
                                      onClick={() => updateCartQuantity(item.product.id, -1)}
                                      className="p-1 text-neutral-400 hover:text-neutral-800 rounded-full hover:bg-neutral-100 cursor-pointer"
                                      aria-label="Decrease quantity"
                                    >
                                      <Minus className="w-3.5 h-3.5" />
                                    </button>
                                    <span className="text-xs font-bold font-mono text-neutral-800 px-1.5 min-w-[20px] text-center">{item.quantity}</span>
                                    <button 
                                      onClick={() => updateCartQuantity(item.product.id, 1)}
                                      className="p-1 text-neutral-400 hover:text-neutral-800 rounded-full hover:bg-neutral-100 cursor-pointer"
                                      aria-label="Increase quantity"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                    </button>
                                  </div>

                                  <button 
                                    onClick={() => removeFromCart(item.product.id)}
                                    className="text-xs text-rose-500 hover:text-rose-600 font-medium underline px-1 cursor-pointer"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Drawer Footer billing section, only shown when item catalog active */}
                    {cart.length > 0 && checkoutStep === 'cart' && (
                      <div className="border-t border-neutral-100 bg-neutral-50 p-6 space-y-4">
                        <div className="space-y-2 text-xs text-neutral-500 font-mono">
                          <div className="flex justify-between">
                            <span>Subtotal:</span>
                            <span className="text-neutral-800 font-bold">${cartSubtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Local Sales Taxes (8%):</span>
                            <span className="text-neutral-800 font-bold">${(cartSubtotal * 0.08).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Insured White-glove Courier:</span>
                            <span className="text-emerald-600 font-bold">$15.00</span>
                          </div>
                          <div className="flex justify-between border-t border-neutral-200 pt-3 text-sm text-neutral-900 font-bold">
                            <span>Absolute Total:</span>
                            <span>${(cartSubtotal * 1.08 + 15).toFixed(2)}</span>
                          </div>
                        </div>

                        <div className="pt-2">
                          <button 
                            onClick={() => setCheckoutStep('form')}
                            className="w-full bg-neutral-950 text-white hover:bg-neutral-850 py-4 rounded-2xl text-center text-sm font-semibold transition cursor-pointer shadow-lg active:scale-98 flex items-center justify-center gap-2"
                          >
                            <span>Proceed to Settlement Checkout</span> <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
