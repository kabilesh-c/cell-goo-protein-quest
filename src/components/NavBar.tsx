
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';

interface NavBarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const NavBar: React.FC<NavBarProps> = ({ activeSection, onSectionChange }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'introduction', label: 'Introduction' },
    { id: 'transcription', label: 'Transcription' },
    { id: 'translation', label: 'Translation' },
    { id: 'folding', label: 'Folding' },
    { id: 'videos', label: 'Videos' },
    { id: 'quiz', label: 'Quiz', isExternalPage: true, path: '/quiz' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.isExternalPage) {
      // Navigate to external page
      window.location.href = item.path;
    } else {
      // Navigate to section
      onSectionChange(item.id);
      setIsMobileMenuOpen(false);
      
      const element = document.getElementById(item.id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 w-full z-50 transition-all duration-300',
        isScrolled
          ? 'py-2 bg-background/80 backdrop-blur-lg shadow-md'
          : 'py-4 bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-xl font-bold text-primary mr-2">PS</span>
          <span className="hidden sm:inline-block text-white font-semibold">
            Protein Synthesis
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item)}
              className={cn(
                'nav-link',
                (activeSection === item.id || (window.location.pathname === item.path && item.isExternalPage)) && 'active'
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Mobile Navigation Toggle */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-card/95 backdrop-blur-lg absolute top-full left-0 w-full py-4 shadow-lg">
          <div className="container mx-auto px-4 flex flex-col space-y-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={cn(
                  'py-2 px-4 text-left rounded-md transition-colors',
                  (activeSection === item.id || (window.location.pathname === item.path && item.isExternalPage))
                    ? 'bg-primary/20 text-white'
                    : 'text-muted-foreground hover:bg-primary/10 hover:text-white'
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
