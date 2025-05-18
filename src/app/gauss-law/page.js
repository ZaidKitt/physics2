'use client';

import { useState, useEffect } from 'react';

export default function GaussLawPage() {
  const [katex, setKatex] = useState(null);

  useEffect(() => {
    // Load KaTeX CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css';
    document.head.appendChild(link);
    import('katex').then((katexModule) => {
      setKatex(katexModule.default);
    });
  }, []);

  const renderMath = (formula, displayMode = false) => {
    if (!katex) return formula;
    try {
      return katex.renderToString(formula, {
        throwOnError: false,
        displayMode: displayMode
      });
    } catch (error) {
      return formula;
    }
  };

  // Responsive grid columns based on window width
  const [windowSize, setWindowSize] = useState({ width: 0 });
  useEffect(() => {
    function handleResize() {
      setWindowSize({ width: window.innerWidth });
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const getGridColumns = () => {
    if (windowSize.width >= 1280) return 'repeat(3, 1fr)';
    if (windowSize.width >= 900) return 'repeat(2, 1fr)';
    return '1fr';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0f1116' }}>
      {/* Hero Section */}
      <section style={{
        padding: '5rem 1rem',
        background: 'linear-gradient(to right, #111827, #1f2937)'
      }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{
            fontSize: windowSize.width >= 1024 ? '3.75rem' : windowSize.width >= 768 ? '3rem' : '2.25rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            backgroundImage: 'linear-gradient(to right, #00b7eb, #8b5cf6)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent'
          }}
            className="text-gradient"
          >
            Gauss's Law
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: '#d1d5db',
            maxWidth: '48rem',
            margin: '0 auto 2.5rem auto'
          }}>
            Explore the relationship between electric flux and enclosed charge.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section style={{
        padding: '4rem 1rem',
        maxWidth: '80rem',
        margin: '0 auto'
      }}>
        {/* First row of cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: getGridColumns(),
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          {/* Card 1: Electric Flux */}
          <div style={{
            background: '#1a1c25',
            borderRadius: '0.75rem',
            boxShadow: '0 4px 32px #000a',
            padding: '2.5rem',
            minWidth: 0
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              marginBottom: '1.25rem',
              color: '#00b7eb'
            }}>Electric Flux</h2>
            <p style={{ color: '#fff', marginBottom: '1rem' }}>
              Electric flux measures the flow of electric field through a surface:
            </p>
            <div style={{
              background: '#23263a',
              borderRadius: '0.5rem',
              padding: '1rem',
              margin: '1rem 0',
              textAlign: 'center',
              color: '#fff',
              fontSize: '1.1rem'
            }}>
              <span dangerouslySetInnerHTML={{ __html: renderMath('\\Phi_E = E A \\cos \\theta', true) }} />
            </div>
            <ul style={{ color: '#fff', marginBottom: '1rem', paddingLeft: 0, listStyle: 'none' }}>
              <li><span style={{ color: '#00b7eb', marginRight: 8 }}>•</span>Units: N·m²/C</li>
              <li><span style={{ color: '#00b7eb', marginRight: 8 }}>•</span>Proportional to field lines crossing the surface</li>
              <li><span style={{ color: '#00b7eb', marginRight: 8 }}>•</span>Zero when field is parallel to surface</li>
            </ul>
          </div>

          {/* Card 2: Gauss's Law */}
          <div style={{
            background: '#1a1c25',
            borderRadius: '0.75rem',
            boxShadow: '0 4px 32px #000a',
            padding: '2.5rem',
            minWidth: 0
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.25rem', color: '#00b7eb' }}>
              Gauss's Law
            </h2>
            <p style={{ color: '#fff', marginBottom: '1rem' }}>
              The net electric flux through a closed surface is proportional to the enclosed charge:
            </p>
            <div style={{
              background: '#23263a',
              borderRadius: '0.5rem',
              padding: '1rem',
              margin: '1rem 0',
              textAlign: 'center',
              color: '#fff',
              fontSize: '1.1rem'
            }}>
              <span dangerouslySetInnerHTML={{ __html: renderMath('\\Phi_E = \\oint \\vec{E} \\cdot d\\vec{A} = \\frac{q_{\\text{in}}}{\\varepsilon_0}', true) }} />
            </div>
            <p style={{ color: '#fff' }}>
              For a point charge: <span style={{ color: '#00b7eb' }} dangerouslySetInnerHTML={{ __html: renderMath('\\Phi_E = 4 \\pi k_e q = \\frac{q}{\\varepsilon_0}') }} />
            </p>
          </div>

          {/* Card 3: Applications */}
          <div style={{
            background: '#1a1c25',
            borderRadius: '0.75rem',
            boxShadow: '0 4px 32px #000a',
            padding: '2.5rem',
            minWidth: 0
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.25rem', color: '#00b7eb' }}>
              Applications of Gauss's Law
            </h2>
            <p style={{ color: '#fff', marginBottom: '1rem' }}>
              Useful for calculating electric fields with symmetric charge distributions:
            </p>
            <ul style={{ color: '#fff', marginBottom: '1rem', paddingLeft: 0, listStyle: 'none' }}>
              <li style={{ marginBottom: '0.5rem' }}><span style={{ color: '#00b7eb', marginRight: 8 }}>•</span>Line charge: <span dangerouslySetInnerHTML={{ __html: renderMath('E = \\frac{\\lambda}{2 \\pi \\varepsilon_0 r}') }} /></li>
              <li style={{ marginBottom: '0.5rem' }}><span style={{ color: '#00b7eb', marginRight: 8 }}>•</span>Plane of charge: <span dangerouslySetInnerHTML={{ __html: renderMath('E = \\frac{\\sigma}{2 \\varepsilon_0}') }} /></li>
              <li><span style={{ color: '#00b7eb', marginRight: 8 }}>•</span>Works with spherical, cylindrical, and planar symmetry</li>
            </ul>
          </div>
        </div>

        {/* Second row of cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: getGridColumns(),
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          {/* Card 4: Conductors */}
          <div style={{
            background: '#1a1c25',
            borderRadius: '0.75rem',
            boxShadow: '0 4px 32px #000a',
            padding: '2.5rem',
            minWidth: 0
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.25rem', color: '#00b7eb' }}>
              Conductors in Electrostatic Equilibrium
            </h2>
            <p style={{ color: '#fff', marginBottom: '1rem' }}>
              Key properties of conductors in electrostatic equilibrium:
            </p>
            <ul style={{ color: '#fff', marginBottom: '1rem', paddingLeft: 0, listStyle: 'none' }}>
              <li><span style={{ color: '#00b7eb', marginRight: 8 }}>•</span>Electric field inside is zero</li>
              <li><span style={{ color: '#00b7eb', marginRight: 8 }}>•</span>Charge resides on the surface</li>
              <li><span style={{ color: '#00b7eb', marginRight: 8 }}>•</span>Field just outside: <span dangerouslySetInnerHTML={{ __html: renderMath('E = \\frac{\\sigma}{\\varepsilon_0}') }} /></li>
              <li><span style={{ color: '#00b7eb', marginRight: 8 }}>•</span>Field is perpendicular to the surface</li>
              <li><span style={{ color: '#00b7eb', marginRight: 8 }}>•</span>Charge density is greatest where curvature is smallest</li>
            </ul>
          </div>

          {/* Card 5: Conceptual Example */}
          <div style={{
            background: '#1a1c25',
            borderRadius: '0.75rem',
            boxShadow: '0 4px 32px #000a',
            padding: '2.5rem',
            minWidth: 0
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.25rem', color: '#00b7eb' }}>
              Conceptual Example
            </h2>
            <p style={{ color: '#fff', marginBottom: '1rem' }}>
              A spherical Gaussian surface surrounds a point charge q. The flux:
            </p>
            <ul style={{ color: '#fff', marginBottom: '1rem', paddingLeft: 0, listStyle: 'none' }}>
              <li><span style={{ color: '#00b7eb', marginRight: 8 }}>A.</span>Triples if q is tripled</li>
              <li><span style={{ color: '#00b7eb', marginRight: 8 }}>B.</span>Remains unchanged if radius doubles</li>
              <li><span style={{ color: '#00b7eb', marginRight: 8 }}>C.</span>Remains unchanged if surface changes to a cube</li>
              <li><span style={{ color: '#00b7eb', marginRight: 8 }}>D.</span>Remains unchanged if charge moves within the surface</li>
            </ul>
            <p style={{ color: '#fff' }}>
              All statements are true due to Gauss's Law!
            </p>
          </div>

          {/* Card 6: Key Formulas */}
          <div style={{
            background: '#1a1c25',
            borderRadius: '0.75rem',
            boxShadow: '0 4px 32px #000a',
            padding: '2.5rem',
            minWidth: 0
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.25rem', color: '#00b7eb' }}>
              Key Formulas
            </h2>
            <div style={{
              background: '#23263a',
              borderRadius: '0.5rem',
              padding: '1rem',
              margin: '0.5rem 0',
              color: '#fff',
              fontSize: '1rem'
            }}>
              <p style={{ marginBottom: '0.5rem' }}>Electric flux:</p>
              <div style={{ textAlign: 'center', color: '#00b7eb' }}>
                <span dangerouslySetInnerHTML={{ __html: renderMath('\\Phi_E = E A \\cos \\theta', true) }} />
              </div>
            </div>
            <div style={{
              background: '#23263a',
              borderRadius: '0.5rem',
              padding: '1rem',
              margin: '0.5rem 0',
              color: '#fff',
              fontSize: '1rem'
            }}>
              <p style={{ marginBottom: '0.5rem' }}>Gauss's law:</p>
              <div style={{ textAlign: 'center', color: '#00b7eb' }}>
                <span dangerouslySetInnerHTML={{ __html: renderMath('\\Phi_E = \\oint \\vec{E} \\cdot d\\vec{A} = \\frac{q_{\\text{in}}}{\\varepsilon_0}', true) }} />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer style={{
        padding: '2rem 1rem',
        borderTop: '1px solid #1f2937',
        textAlign: 'center',
        marginTop: '2rem'
      }}>
        <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
          Created by <span style={{ color: '#00b7eb' }}>Zaid Alsaleh</span> | University ID: <span style={{ color: '#00b7eb' }}>20220126</span>
        </p>
      </footer>
    </div>
  );
} 