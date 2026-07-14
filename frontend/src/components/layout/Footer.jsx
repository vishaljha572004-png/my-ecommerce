import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ShieldCheck, Truck, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-gray-100 mb-12">
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">10 Minute Delivery</h4>
              <p className="text-xs text-gray-500 mt-1">Superfast delivery to your door</p>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center md:justify-center">
            <div className="w-12 h-12 bg-accentYellow/10 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-accentYellow" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Best Prices & Offers</h4>
              <p className="text-xs text-gray-500 mt-1">Cheaper prices than your local supermarket</p>
            </div>
          </div>
          <div className="flex items-center gap-4 justify-center md:justify-end">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Truck className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Wide Assortment</h4>
              <p className="text-xs text-gray-500 mt-1">Choose from 5000+ products</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-soft">
                <span className="text-white font-extrabold text-xl">V</span>
              </div>
              <span className="text-2xl font-extrabold text-gray-900 tracking-tight">
                V-<span className="text-primary">Mart</span>
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Your one-stop destination for all your grocery needs. We deliver fresh produce, dairy, and household essentials right to your doorstep in minutes.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-primary/10 hover:text-primary transition-colors font-bold text-xs">
                FB
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-primary/10 hover:text-primary transition-colors font-bold text-xs">
                TW
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-primary/10 hover:text-primary transition-colors font-bold text-xs">
                IG
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-gray-900 text-sm font-bold uppercase tracking-wider mb-6">Quick Links</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/" className="text-gray-500 hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/products" className="text-gray-500 hover:text-primary transition-colors">All Products</Link></li>
              <li><Link to="/categories" className="text-gray-500 hover:text-primary transition-colors">Categories</Link></li>
              <li><Link to="/offers" className="text-gray-500 hover:text-primary transition-colors">Special Offers</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 text-sm font-bold uppercase tracking-wider mb-6">Customer Service</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/profile" className="text-gray-500 hover:text-primary transition-colors">My Account</Link></li>
              <li><Link to="/orders" className="text-gray-500 hover:text-primary transition-colors">Track Order</Link></li>
              <li><Link to="/faq" className="text-gray-500 hover:text-primary transition-colors">FAQ & Help</Link></li>
              <li><Link to="/returns" className="text-gray-500 hover:text-primary transition-colors">Returns Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 text-sm font-bold uppercase tracking-wider mb-6">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 text-gray-500">
                <MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                <span>123 Market Street, Suite 400<br />Mumbai, MH 400001</span>
              </li>
              <li className="flex items-center gap-3 text-gray-500">
                <Phone className="w-5 h-5 text-gray-400 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3 text-gray-500">
                <Mail className="w-5 h-5 text-gray-400 shrink-0" />
                <span>support@v-mart.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} V-Mart. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-gray-400">
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
