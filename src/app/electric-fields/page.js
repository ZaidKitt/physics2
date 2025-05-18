'use client';

import { useState, useEffect } from 'react';
import ElectricFieldSimulation from '../../components/ElectricFieldSimulation';

export default function ElectricFieldsPage() {
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
            Electric Fields
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: '#d1d5db',
            maxWidth: '48rem',
            margin: '0 auto 2.5rem auto'
          }}>
            Explore the fundamental concepts of electric charges and fields with interactive simulations.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section style={{
        padding: '4rem 1rem',
        maxWidth: '80rem',
        margin: '0 auto'
      }}>
        {/* Introduction, Coulomb, Field, and Example as grid cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: getGridColumns(),
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          {/* Card 1: Introduction to Electric Charges */}
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
            }}>Introduction to Electric Charges</h2>
            <p style={{ color: '#fff', marginBottom: '1rem' }}>
              Electric charges are a fundamental property of matter. There are two types:
            </p>
            <ul style={{ color: '#fff', marginBottom: '1rem', paddingLeft: 0, listStyle: 'none' }}>
              <li><span style={{ color: '#00b7eb', marginRight: 8 }}>•</span>Positive charges (protons)</li>
              <li><span style={{ color: '#00b7eb', marginRight: 8 }}>•</span>Negative charges (electrons)</li>
            </ul>
            <p style={{ color: '#fff' }}>
              Like charges repel, opposite charges attract.
            </p>
          </div>

          {/* Card 2: Conservation and Quantization */}
          <div style={{
            background: '#1a1c25',
            borderRadius: '0.75rem',
            boxShadow: '0 4px 32px #000a',
            padding: '2.5rem',
            minWidth: 0
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.25rem', color: '#00b7eb' }}>
              Conservation & Quantization
            </h2>
            <p style={{ color: '#fff', marginBottom: '1rem' }}>
              The net charge of an isolated system remains constant. Charges can be transferred but not created or destroyed.
            </p>
            <p style={{ color: '#fff', marginBottom: '1rem' }}>
              Electric charge exists in discrete amounts and is always a multiple of the elementary charge e:
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
              <span dangerouslySetInnerHTML={{ __html: renderMath('q = \\pm Ne') }} />
              <br />
              <span style={{ color: '#00b7eb' }} dangerouslySetInnerHTML={{ __html: renderMath('|e| = 1.6 \\times 10^{-19} \\text{ C}') }} />
            </div>
            <p style={{ color: '#fff' }}>
              Charge must be a multiple of the elementary charge.
            </p>
          </div>

          {/* Card 3: Coulomb's Law */}
          <div style={{
            background: '#1a1c25',
            borderRadius: '0.75rem',
            boxShadow: '0 4px 32px #000a',
            padding: '2.5rem',
            minWidth: 0
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.25rem', color: '#00b7eb' }}>
              Coulomb's Law
            </h2>
            <p style={{ color: '#fff', marginBottom: '1rem' }}>
              The force between two point charges is:
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
              <span dangerouslySetInnerHTML={{ __html: renderMath('F_e = k_e \\frac{|q_1||q_2|}{r^2}', true) }} />
            </div>
            <ul style={{ color: '#fff', marginBottom: '1rem', paddingLeft: 0, listStyle: 'none', fontSize: '0.98rem' }}>
              <li><span style={{ color: '#00b7eb', marginRight: 8 }}>•</span><span dangerouslySetInnerHTML={{ __html: renderMath('k_e = 8.99 \\times 10^9 \\text{ N}\\cdot\\text{m}^2/\\text{C}^2') }} /></li>
              <li><span style={{ color: '#00b7eb', marginRight: 8 }}>•</span>Like charges repel, unlike attract</li>
              <li><span style={{ color: '#00b7eb', marginRight: 8 }}>•</span>Inverse-square law</li>
            </ul>
          </div>
        </div>

        {/* Electric Field and Superposition */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: getGridColumns(),
          gap: '2.5rem',
          marginBottom: '3rem'
        }}>
          {/* Card 4: Electric Field */}
          <div style={{
            background: '#1a1c25',
            borderRadius: '0.75rem',
            boxShadow: '0 4px 32px #000a',
            padding: '2.5rem',
            minWidth: 0
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.25rem', color: '#00b7eb' }}>
              Electric Field
            </h2>
            <p style={{ color: '#fff', marginBottom: '1rem' }}>
              The electric field is the force per unit charge:
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
              <span dangerouslySetInnerHTML={{ __html: renderMath('\\vec{E} = \\frac{\\vec{F}}{q_0}', true) }} />
            </div>
            <p style={{ color: '#fff' }}>
              For a point charge: <span style={{ color: '#00b7eb' }} dangerouslySetInnerHTML={{ __html: renderMath('\\vec{E} = k_e \\frac{q}{r^2} \\hat{r}', true) }} />
            </p>
          </div>

          {/* Card 5: Superposition Principle */}
          <div style={{
            background: '#1a1c25',
            borderRadius: '0.75rem',
            boxShadow: '0 4px 32px #000a',
            padding: '2.5rem',
            minWidth: 0
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.25rem', color: '#00b7eb' }}>
              Superposition Principle
            </h2>
            <p style={{ color: '#fff', marginBottom: '1rem' }}>
              The net electric field is the vector sum of fields from all charges:
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
              <span dangerouslySetInnerHTML={{ __html: renderMath('\\vec{E} = k_e \\sum_i \\frac{q_i}{r_i^2} \\hat{r}_i', true) }} />
            </div>
          </div>

          {/* Card 6: Electric Field Lines */}
          <div style={{
            background: '#1a1c25',
            borderRadius: '0.75rem',
            boxShadow: '0 4px 32px #000a',
            padding: '2.5rem',
            minWidth: 0
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.25rem', color: '#00b7eb' }}>
              Electric Field Lines
            </h2>
            <ul style={{ color: '#fff', marginBottom: '1rem', paddingLeft: 0, listStyle: 'none', fontSize: '0.98rem' }}>
              <li><span style={{ color: '#00b7eb', marginRight: 8 }}>•</span>Start on positive, end on negative charges</li>
              <li><span style={{ color: '#00b7eb', marginRight: 8 }}>•</span>Never cross, tangent to field vector</li>
              <li><span style={{ color: '#00b7eb', marginRight: 8 }}>•</span>Density ∝ field strength</li>
            </ul>
          </div>
        </div>

        {/* Example Card */}
        <div style={{
          maxWidth: '60rem',
          margin: '0 auto 3rem auto',
          background: '#1a1c25',
          borderRadius: '0.75rem',
          boxShadow: '0 4px 32px #000a',
          padding: '2.5rem',
          minWidth: 0
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.25rem', color: '#00b7eb', textAlign: 'center' }}>
            Example: Hydrogen Atom
          </h2>
          <p style={{ color: '#fff', marginBottom: '1rem', textAlign: 'center' }}>
            In a hydrogen atom, an electron orbits a proton. Calculate the electric force between them:
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
            <div style={{ marginBottom: 8 }}>
              <span dangerouslySetInnerHTML={{ __html: renderMath('q_e = -1.6 \\times 10^{-19} \\text{ C}') }} />,
              <span style={{ marginLeft: 16 }} dangerouslySetInnerHTML={{ __html: renderMath('q_p = 1.6 \\times 10^{-19} \\text{ C}') }} />
            </div>
            <div style={{ marginBottom: 8 }}>
              <span dangerouslySetInnerHTML={{ __html: renderMath('r = 5.3 \\times 10^{-11} \\text{ m}') }} />
            </div>
            <div style={{ marginBottom: 8 }}>
              <span dangerouslySetInnerHTML={{ __html: renderMath('F_e = k_e \\frac{|q_e||q_p|}{r^2}', true) }} />
            </div>
            <div style={{ marginBottom: 8 }}>
              <span dangerouslySetInnerHTML={{ __html: renderMath('F_e = 8.2 \\times 10^{-8} \\text{ N}', true) }} />
            </div>
          </div>
          <p style={{ color: '#d1d5db', textAlign: 'center' }}>
            The force is attractive, pulling the electron toward the proton.
          </p>
        </div>

        {/* Interactive Simulation Card */}
        <div style={{
          maxWidth: '70rem',
          margin: '0 auto',
          background: '#1a1c25',
          borderRadius: '0.75rem',
          boxShadow: '0 4px 32px #000a',
          padding: '2.5rem',
          minWidth: 0
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.25rem', color: '#00b7eb', textAlign: 'center' }}>
            Interactive Simulation
          </h2>
          <p style={{ color: '#fff', marginBottom: '2rem', textAlign: 'center', maxWidth: '40rem', marginLeft: 'auto', marginRight: 'auto' }}>
            Explore electric fields by adding charges to the simulation below. You can add positive or negative charges, adjust their magnitude, and see how they interact to create electric fields.
          </p>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <ElectricFieldSimulation />
          </div>
        </div>
      </section>
    </div>
  );
} 