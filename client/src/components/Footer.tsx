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
              <span className="text-gray-400 hover:text-primary cursor-pointer">
                <Facebook size={18} />
              </span>
              <span className="text-gray-400 hover:text-primary cursor-pointer">
                <Twitter size={18} />
              </span>
              <span className="text-gray-400 hover:text-primary cursor-pointer">
                <Instagram size={18} />
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-dark uppercase tracking-wider mb-4">
              Features
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard">
                  <span className="text-gray-500 hover:text-primary cursor-pointer">
                    Message Collection
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard">
                  <span className="text-gray-500 hover:text-primary cursor-pointer">
                    Flipbook Creation
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard">
                  <span className="text-gray-500 hover:text-primary cursor-pointer">
                    QR Code Generator
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/dashboard">
                  <span className="text-gray-500 hover:text-primary cursor-pointer">
                    Premium Themes
                  </span>
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
                  <span className="text-gray-500 hover:text-primary cursor-pointer">
                    Help Center
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <span className="text-gray-500 hover:text-primary cursor-pointer">
                    Pricing
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <span className="text-gray-500 hover:text-primary cursor-pointer">
                    API Documentation
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <span className="text-gray-500 hover:text-primary cursor-pointer">
                    Blog
                  </span>
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
                  <span className="text-gray-500 hover:text-primary cursor-pointer">
                    About Us
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <span className="text-gray-500 hover:text-primary cursor-pointer">
                    Careers
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <span className="text-gray-500 hover:text-primary cursor-pointer">
                    Privacy Policy
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/">
                  <span className="text-gray-500 hover:text-primary cursor-pointer">
                    Terms of Service
                  </span>
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
