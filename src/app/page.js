'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Responsive grid columns based on window width
  const getGridColumns = () => {
    if (windowSize.width >= 1024) return 'repeat(3, 1fr)';
    if (windowSize.width >= 768) return 'repeat(2, 1fr)';
    return '1fr';
  };

  // Responsive font sizes
  const getHeadingSize = () => {
    if (windowSize.width >= 1024) return '3.75rem';
    if (windowSize.width >= 768) return '3rem';
    return '2.25rem';
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <section style={{ 
        padding: '5rem 1rem',
        background: 'linear-gradient(to right, #111827, #1f2937)'
      }}>
        <div style={{ 
          maxWidth: '80rem',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ 
              fontSize: getHeadingSize(),
              fontWeight: 'bold',
              marginBottom: '1.5rem',
              backgroundImage: 'linear-gradient(to right, #00b7eb, #8b5cf6)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent'
            }} className="text-gradient">
              Welcome to the Interactive Physics Project
            </h1>
            <p style={{ 
              fontSize: '1.25rem',
              color: '#d1d5db',
              maxWidth: '48rem',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginBottom: '2.5rem'
            }}>
              Explore six physics chapters with interactive simulations and stunning visuals.
            </p>
            <div style={{ 
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '1rem'
            }}>
              <a
                href="/electric-fields"
                style={{ 
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#1a1c25',
                  border: '1px solid #00b7eb',
                  color: '#00b7eb',
                  borderRadius: '0.375rem',
                  transition: 'all 0.3s',
                  textDecoration: 'none'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#00b7eb';
                  e.currentTarget.style.color = '#0f1116';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#1a1c25';
                  e.currentTarget.style.color = '#00b7eb';
                }}
              >
                Start Learning
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Chapters Preview */}
      <section style={{ padding: '4rem 1rem' }}>
        <div style={{ 
          maxWidth: '80rem',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          <h2 style={{ 
            fontSize: '1.875rem',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '3rem',
            backgroundImage: 'linear-gradient(to right, #00b7eb, #8b5cf6)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent'
          }} className="text-gradient">
            Explore Physics Chapters
          </h2>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: getGridColumns(),
            gap: '2rem'
          }}>
            {/* Chapter Cards */}
            {[
              {
                title: "Electric Fields",
                description: "Explore the fundamental concept of electric fields and their properties.",
                href: "/electric-fields",
                color: "#00b7eb"
              },
              {
                title: "Gauss's Law",
                description: "Learn about Gauss's law and its applications in electromagnetism.",
                href: "/gauss-law",
                color: "#ff4040"
              },
              {
                title: "Electric Potential",
                description: "Understand electric potential and potential energy in electric fields.",
                href: "/electric-potential",
                color: "#00b7eb"
              },
              {
                title: "Capacitance and Dielectrics",
                description: "Explore capacitors, capacitance, and the effects of dielectric materials.",
                href: "/capacitance",
                color: "#ff4040"
              },
              {
                title: "Current and Resistance",
                description: "Learn about electric current, resistance, and Ohm's law.",
                href: "/current",
                color: "#00b7eb"
              },
              {
                title: "Direct Current Circuits",
                description: "Understand DC circuits, Kirchhoff's rules, and circuit analysis.",
                href: "/dc-circuits",
                color: "#ff4040"
              }
            ].map((chapter, index) => (
              <a
                key={index}
                href={chapter.href}
                style={{ 
                  display: 'block',
                  padding: '1.5rem',
                  backgroundColor: '#1a1c25',
                  border: '1px solid #1f2937',
                  borderRadius: '0.5rem',
                  transition: 'border-color 0.3s',
                  textDecoration: 'none'
                }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = '#374151'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = '#1f2937'}
              >
                <h3 style={{ 
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  marginBottom: '0.75rem',
                  color: chapter.color
                }}>
                  {chapter.title}
                </h3>
                <p style={{ color: '#9ca3af' }}>{chapter.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
