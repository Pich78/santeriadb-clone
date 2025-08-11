import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, User, Music, Disc, BookOpen, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ColorCoding } from '../utils/colorCoding';

/**
 * Componente di navigazione principale
 */
const Navigation = ({ onSearchToggle, isSearchOpen = false }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    {
      name: 'Home',
      path: '/',
      icon: Home,
      type: 'home'
    },
    {
      name: 'Orishas',
      path: '/orishas',
      icon: User,
      type: 'orishas'
    },
    {
      name: 'Toques',
      path: '/toques',
      icon: Music,
      type: 'toques'
    },
    {
      name: 'Cantos',
      path: '/cantos',
      icon: Music,
      type: 'cantos'
    },
    {
      name: 'Albums',
      path: '/albums',
      icon: Disc,
      type: 'albums'
    },
    {
      name: 'Trascrizioni',
      path: '/transcriptions',
      icon: BookOpen,
      type: 'transcriptions'
    }
  ];

  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const getItemStyle = (item, isActive) => {
    const theme = ColorCoding.generateTheme(item.type);
    
    if (isActive) {
      return {
        backgroundColor: theme.colors.primary,
        color: 'white',
        borderColor: theme.colors.primary
      };
    }
    
    return {
      color: theme.colors.primary,
      borderColor: 'transparent'
    };
  };

  const getHoverStyle = (item) => {
    const theme = ColorCoding.generateTheme(item.type);
    return {
      '--hover-bg': theme.colors.light,
      '--hover-color': theme.colors.dark
    };
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg border-b-2 border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo e titolo */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center space-x-3 text-xl font-bold text-gray-800 hover:text-gray-600 transition-colors"
              onClick={closeMobileMenu}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-amber-600 to-red-600 rounded-lg flex items-center justify-center">
                <Music className="w-5 h-5 text-white" />
              </div>
              <span className="hidden sm:block">Santería Database</span>
            </Link>
          </div>

          {/* Menu desktop */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const isActive = isActivePath(item.path);
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all duration-200 hover:shadow-md"
                  style={{
                    ...getItemStyle(item, isActive),
                    ...getHoverStyle(item)
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.target.style.backgroundColor = e.target.style.getPropertyValue('--hover-bg');
                      e.target.style.color = e.target.style.getPropertyValue('--hover-color');
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      const theme = ColorCoding.generateTheme(item.type);
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = theme.colors.primary;
                    }
                  }}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Pulsanti azioni */}
          <div className="flex items-center space-x-2">
            {/* Pulsante ricerca */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onSearchToggle}
              className={`p-2 ${isSearchOpen ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* Pulsante menu mobile */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-gray-600"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Menu mobile */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-2">
              {navigationItems.map((item) => {
                const isActive = isActivePath(item.path);
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeMobileMenu}
                    className="flex items-center px-4 py-3 rounded-lg text-base font-medium border-2 transition-all duration-200"
                    style={getItemStyle(item, isActive)}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Indicatore di sezione attiva */}
      <div className="h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-20">
        {navigationItems.map((item) => {
          if (isActivePath(item.path)) {
            const theme = ColorCoding.generateTheme(item.type);
            return (
              <div
                key={item.path}
                className="h-full"
                style={{ backgroundColor: theme.colors.primary }}
              />
            );
          }
          return null;
        })}
      </div>
    </nav>
  );
};

export default Navigation;

