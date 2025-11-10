import { Link, useLocation } from 'react-router-dom';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';

export default function Navbar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4">
        <NavigationMenu.Root className="relative flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary-600">
              French Reader
            </Link>
          </div>

          <NavigationMenu.List className="flex space-x-4">
            <NavigationMenu.Item>
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${isActive('/') ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                Home
              </Link>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
              <Link
                to="/library"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${isActive('/library') ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                Library
              </Link>
            </NavigationMenu.Item>
            <NavigationMenu.Item>
              <Link
                to="/profile"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${isActive('/profile') ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                Profile
              </Link>
            </NavigationMenu.Item>
          </NavigationMenu.List>
        </NavigationMenu.Root>
      </nav>
    </header>
  );
}