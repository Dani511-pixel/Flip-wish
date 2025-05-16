import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const NavBar = () => {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Desktop Navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <span className="text-2xl font-bold text-primary">
                  FlipWish
                </span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
              <Link href="/dashboard">
                <span className={`px-3 py-2 rounded-md text-sm font-medium ${location === "/dashboard" ? "text-primary" : "text-gray-600 hover:bg-gray-100"}`}>
                  Dashboard
                </span>
              </Link>
            </div>
          </div>

          {/* User Menu (Desktop) */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="flex items-center space-x-3">
              <Link href="/login">
                <Button variant="outline">Log in</Button>
              </Link>
              <Link href="/register">
                <Button variant="outline">Sign up</Button>
              </Link>
              <Link href="/create-collection">
                <Button>Get Started For Free</Button>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex items-center sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-md"
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMobileMenuOpen ? "block" : "hidden"} sm:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link href="/dashboard">
            <span
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location === "/dashboard" ? "text-primary" : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </span>
          </Link>
        </div>
        
        {/* Mobile menu user section */}
        <div className="pt-4 pb-3 border-t border-gray-200">
          <div className="px-2 space-y-1">
            <Link href="/login">
              <span
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Log in
              </span>
            </Link>
            <Link href="/register">
              <span
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign up
              </span>
            </Link>
            <Link href="/create-collection">
              <span
                className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Get Started For Free
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
