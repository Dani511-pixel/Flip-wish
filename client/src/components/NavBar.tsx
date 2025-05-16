import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Menu, X } from "lucide-react";

const NavBar = () => {
  const [location] = useLocation();
  const { user, logout, isLoading } = useAuth();
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
                <a className="text-2xl font-accent font-bold text-primary">
                  FlipWish
                </a>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
              <Link href="/dashboard">
                <a className={`px-3 py-2 rounded-md text-sm font-medium ${location === "/dashboard" ? "text-primary" : "text-gray-600 hover:bg-gray-100"}`}>
                  Dashboard
                </a>
              </Link>
              <Link href="/dashboard">
                <a className={`px-3 py-2 rounded-md text-sm font-medium ${location.startsWith("/collection") ? "text-primary" : "text-gray-600 hover:bg-gray-100"}`}>
                  My Messages
                </a>
              </Link>
              <Link href="/dashboard">
                <a className={`px-3 py-2 rounded-md text-sm font-medium ${location.startsWith("/flipbook") ? "text-primary" : "text-gray-600 hover:bg-gray-100"}`}>
                  Flipbooks
                </a>
              </Link>
            </div>
          </div>

          {/* User Menu (Desktop) */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-white">
                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <a className="w-full cursor-pointer">Dashboard</a>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/create-collection">
                      <a className="w-full cursor-pointer">Create Collection</a>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => logout()}
                    disabled={isLoading}
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost">Log in</Button>
                </Link>
                <Link href="/register">
                  <Button>Get Started</Button>
                </Link>
              </div>
            )}
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
            <a
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location === "/dashboard" ? "text-primary" : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </a>
          </Link>
          <Link href="/dashboard">
            <a
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.startsWith("/collection") ? "text-primary" : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              My Messages
            </a>
          </Link>
          <Link href="/dashboard">
            <a
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.startsWith("/flipbook") ? "text-primary" : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Flipbooks
            </a>
          </Link>
        </div>
        
        {/* Mobile menu user section */}
        <div className="pt-4 pb-3 border-t border-gray-200">
          {user ? (
            <div className="px-2 space-y-1">
              <div className="flex items-center px-3">
                <div className="flex-shrink-0">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-white">
                      {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user.name}</div>
                  <div className="text-sm font-medium text-gray-500">{user.email}</div>
                </div>
              </div>
              <Link href="/create-collection">
                <a
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Create Collection
                </a>
              </Link>
              <button
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-100"
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                disabled={isLoading}
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="px-2 space-y-1">
              <Link href="/login">
                <a
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Log in
                </a>
              </Link>
              <Link href="/register">
                <a
                  className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Get Started
                </a>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
