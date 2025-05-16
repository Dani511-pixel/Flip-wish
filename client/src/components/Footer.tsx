import { Link } from "wouter";
import { Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-dark mb-4">FlipWish</h3>
            <p className="text-gray-500 mb-4">
              Collect beautiful messages and turn them into memorable flipbooks for any occasion.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-dark uppercase tracking-wider mb-4">
              Features
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard">
                  <a className="text-gray-500 hover:text-primary">
                    Message Collection
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/dashboard">
                  <a className="text-gray-500 hover:text-primary">
                    Flipbook Creation
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/dashboard">
                  <a className="text-gray-500 hover:text-primary">
                    QR Code Generator
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/dashboard">
                  <a className="text-gray-500 hover:text-primary">
                    Premium Themes
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-dark uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-gray-500 hover:text-primary">
                    Help Center
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <a className="text-gray-500 hover:text-primary">
                    Pricing
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <a className="text-gray-500 hover:text-primary">
                    API Documentation
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <a className="text-gray-500 hover:text-primary">
                    Blog
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-dark uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-gray-500 hover:text-primary">
                    About Us
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <a className="text-gray-500 hover:text-primary">
                    Careers
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <a className="text-gray-500 hover:text-primary">
                    Privacy Policy
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <a className="text-gray-500 hover:text-primary">
                    Terms of Service
                  </a>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-gray-400 text-sm text-center">
            &copy; {new Date().getFullYear()} FlipWish. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
