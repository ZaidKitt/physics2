'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Electric Fields', href: '/electric-fields' },
    { name: 'Gauss\'s Law', href: '/gauss-law' },
    { name: 'Electric Potential', href: '/electric-potential' },
    { name: 'Capacitance and Dielectrics', href: '/capacitance' },
    { name: 'Current and Resistance', href: '/current' },
    { name: 'Direct Current Circuits', href: '/dc-circuits' },
    { name: 'About', href: '/about' },
  ];

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backgroundColor: 'rgba(26, 28, 37, 0.5)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid #1f2937'
    }}>
      <div style={{
        maxWidth: '80rem',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: '0 1rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '4rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>
              <Link href="/" style={{ 
                color: '#00b7eb', 
                fontWeight: 'bold',
                fontSize: '1.25rem',
                textDecoration: 'none'
              }}>
                Physics Project
              </Link>
            </div>
          </div>
          
          {/* Desktop menu */}
          <div style={{ display: isMobile ? 'none' : 'block' }}>
            <div style={{ 
              marginLeft: '2.5rem', 
              display: 'flex', 
              alignItems: 'baseline',
              gap: '1rem'
            }}>
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  style={{
                    color: '#d1d5db',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    transition: 'color 0.2s',
                    textDecoration: 'none'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = '#00b7eb'}
                  onMouseOut={(e) => e.currentTarget.style.color = '#d1d5db'}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div style={{ display: isMobile ? 'flex' : 'none', alignItems: 'center' }}>
            <button
              onClick={toggleMenu}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.5rem',
                borderRadius: '0.375rem',
                color: '#9ca3af'
              }}
              aria-expanded="false"
            >
              <span style={{ position: 'absolute', width: '1px', height: '1px', padding: '0', margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', borderWidth: '0' }}>
                Open main menu
              </span>
              {/* Icon when menu is closed */}
              <svg
                style={{ display: isOpen ? 'none' : 'block', height: '1.5rem', width: '1.5rem' }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Icon when menu is open */}
              <svg
                style={{ display: isOpen ? 'block' : 'none', height: '1.5rem', width: '1.5rem' }}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div style={{ display: isOpen && isMobile ? 'block' : 'none' }}>
        <div style={{
          padding: '0.5rem 0.5rem 0.75rem',
          backgroundColor: 'rgba(26, 28, 37, 0.9)',
          backdropFilter: 'blur(8px)'
        }}>
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              style={{
                display: 'block',
                color: '#d1d5db',
                padding: '0.5rem 0.75rem',
                borderRadius: '0.375rem',
                fontSize: '1rem',
                fontWeight: '500',
                marginBottom: '0.25rem',
                textDecoration: 'none'
              }}
              onClick={toggleMenu}
              onMouseOver={(e) => e.currentTarget.style.color = '#00b7eb'}
              onMouseOut={(e) => e.currentTarget.style.color = '#d1d5db'}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
} 