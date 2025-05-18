'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function GaussLawSimulation() {
  const sketchRef = useRef(null);
  const p5InstanceRef = useRef(null);
  
  const [chargeMagnitude, setChargeMagnitude] = useState(1);
  const [isPositive, setIsPositive] = useState(true);
  const [surfaceRadius, setSurfaceRadius] = useState(100);
  const [surfaceType, setSurfaceType] = useState('spherical'); // 'spherical' or 'cylindrical'
  const [flux, setFlux] = useState(0);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 500 });

  // Refs for p5 to access updated state
  const chargeMagnitudeRef = useRef(chargeMagnitude);
  const isPositiveRef = useRef(isPositive);
  const surfaceRadiusRef = useRef(surfaceRadius);
  const surfaceTypeRef = useRef(surfaceType);
  
  // Update refs when state changes
  useEffect(() => { chargeMagnitudeRef.current = chargeMagnitude; }, [chargeMagnitude]);
  useEffect(() => { isPositiveRef.current = isPositive; }, [isPositive]);
  useEffect(() => { surfaceRadiusRef.current = surfaceRadius; }, [surfaceRadius]);
  useEffect(() => { surfaceTypeRef.current = surfaceType; }, [surfaceType]);

  // Calculate flux
  useEffect(() => {
    // Flux = q/ε₀
    const epsilon0 = 8.85e-12; // C²/(N·m²)
    const q = (isPositive ? 1 : -1) * chargeMagnitude * 1e-6; // Convert μC to C
    const calculatedFlux = q / epsilon0;
    setFlux(calculatedFlux);
  }, [chargeMagnitude, isPositive]);

  // Responsive canvas size
  useEffect(() => {
    const updateCanvasSize = () => {
      if (sketchRef.current) {
        const containerWidth = sketchRef.current.offsetWidth;
        const width = Math.min(containerWidth, 800);
        const height = width * 0.625; // 5:8 ratio
        setCanvasSize({ width, height });
      }
    };
    
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  // p5.js sketch
  useEffect(() => {
    let isMounted = true;
    
    const loadP5 = async () => {
      if (!isMounted) return;
      
      const p5Module = await import('p5');
      const p5 = p5Module.default;
      
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
      }
      
      p5InstanceRef.current = new p5((p) => {
        // Setup canvas
        p.setup = () => {
          p.createCanvas(canvasSize.width, canvasSize.height);
          p.colorMode(p.RGB);
          p.textAlign(p.CENTER, p.CENTER);
          p.angleMode(p.RADIANS);
        };
        
        // Resize canvas when window size changes
        p.windowResized = () => {
          p.resizeCanvas(canvasSize.width, canvasSize.height);
        };
        
        // Draw everything
        p.draw = () => {
          // Background
          p.background(26, 32, 44);
          
          // Grid
          drawGrid(p);
          
          // Center point for drawing
          const centerX = p.width / 2;
          const centerY = p.height / 2;
          
          // Draw Gaussian surface
          drawGaussianSurface(p, centerX, centerY);
          
          // Draw charge
          drawCharge(p, centerX, centerY);
          
          // Draw electric field lines
          drawElectricField(p, centerX, centerY);
          
          // Draw flux information
          drawFluxInfo(p);
        };
        
        // Draw grid
        const drawGrid = (p) => {
          p.stroke(45, 55, 72, 100);
          p.strokeWeight(1);
          
          const gridSize = 20;
          for (let x = 0; x < p.width; x += gridSize) {
            p.line(x, 0, x, p.height);
          }
          for (let y = 0; y < p.height; y += gridSize) {
            p.line(0, y, p.width, y);
          }
        };
        
        // Draw Gaussian surface
        const drawGaussianSurface = (p, centerX, centerY) => {
          const radius = surfaceRadiusRef.current;
          
          if (surfaceTypeRef.current === 'spherical') {
            // Spherical surface
            p.noFill();
            p.stroke(0, 183, 235, 180);
            p.strokeWeight(2);
            p.drawingContext.setLineDash([5, 5]);
            p.ellipse(centerX, centerY, radius * 2);
            p.drawingContext.setLineDash([]);
            
            // Glow effect
            p.noFill();
            for (let i = 10; i > 0; i--) {
              const alpha = p.map(i, 0, 10, 0, 30);
              p.stroke(0, 183, 235, alpha);
              p.strokeWeight(2 + i/2);
              p.ellipse(centerX, centerY, radius * 2);
            }
          } else {
            // Cylindrical surface
            const cylinderHeight = radius * 1.5;
            
            // Draw cylinder sides
            p.noFill();
            p.stroke(0, 183, 235, 180);
            p.strokeWeight(2);
            p.drawingContext.setLineDash([5, 5]);
            
            // Left side
            p.line(centerX - radius, centerY - cylinderHeight/2, centerX - radius, centerY + cylinderHeight/2);
            
            // Right side
            p.line(centerX + radius, centerY - cylinderHeight/2, centerX + radius, centerY + cylinderHeight/2);
            
            // Top and bottom arcs
            p.arc(centerX, centerY - cylinderHeight/2, radius * 2, radius * 0.5, 0, p.PI);
            p.arc(centerX, centerY + cylinderHeight/2, radius * 2, radius * 0.5, p.PI, p.TWO_PI);
            
            p.drawingContext.setLineDash([]);
            
            // Glow effect
            p.noFill();
            for (let i = 5; i > 0; i--) {
              const alpha = p.map(i, 0, 5, 0, 20);
              p.stroke(0, 183, 235, alpha);
              p.strokeWeight(2 + i/2);
              
              // Left side
              p.line(centerX - radius, centerY - cylinderHeight/2, centerX - radius, centerY + cylinderHeight/2);
              
              // Right side
              p.line(centerX + radius, centerY - cylinderHeight/2, centerX + radius, centerY + cylinderHeight/2);
              
              // Top and bottom arcs
              p.arc(centerX, centerY - cylinderHeight/2, radius * 2, radius * 0.5, 0, p.PI);
              p.arc(centerX, centerY + cylinderHeight/2, radius * 2, radius * 0.5, p.PI, p.TWO_PI);
            }
          }
        };
        
        // Draw charge
        const drawCharge = (p, centerX, centerY) => {
          const chargeColor = isPositiveRef.current ? p.color(255, 64, 64) : p.color(0, 183, 235);
          const chargeRadius = 24;
          
          // Draw glow
          p.noStroke();
          for (let i = 30; i > 0; i--) {
            const alpha = p.map(i, 0, 30, 0, 50);
            p.fill(p.red(chargeColor), p.green(chargeColor), p.blue(chargeColor), alpha);
            p.ellipse(centerX, centerY, chargeRadius + i, chargeRadius + i);
          }
          
          // Draw charge
          p.fill(chargeColor);
          p.ellipse(centerX, centerY, chargeRadius, chargeRadius);
          
          // Draw charge value inside
          p.fill(255);
          p.textSize(14);
          p.textAlign(p.CENTER, p.CENTER);
          const sign = isPositiveRef.current ? '+' : '-';
          p.text(`${sign}${chargeMagnitudeRef.current}`, centerX, centerY);
        };
        
        // Draw electric field lines
        const drawElectricField = (p, centerX, centerY) => {
          const numLines = 16;
          const maxLength = Math.max(p.width, p.height) * 0.8;
          const stepSize = 5;
          const arrowSize = 8;
          
          p.stroke(0, 183, 235);
          p.strokeWeight(1.5);
          
          for (let i = 0; i < numLines; i++) {
            const angle = (i / numLines) * p.TWO_PI;
            let x = centerX;
            let y = centerY;
            
            // Direction depends on charge polarity
            const direction = isPositiveRef.current ? 1 : -1;
            
            // Draw field line
            p.beginShape();
            for (let j = 0; j < maxLength; j += stepSize) {
              const r = j * direction;
              x = centerX + r * p.cos(angle);
              y = centerY + r * p.sin(angle);
              
              // Stop if out of bounds
              if (x < 0 || x > p.width || y < 0 || y > p.height) {
                break;
              }
              
              p.vertex(x, y);
            }
            p.endShape();
            
            // Draw arrow at end
            const arrowX = centerX + (maxLength * 0.4 * direction) * p.cos(angle);
            const arrowY = centerY + (maxLength * 0.4 * direction) * p.sin(angle);
            
            if (arrowX >= 0 && arrowX <= p.width && arrowY >= 0 && arrowY <= p.height) {
              const arrowAngle = isPositiveRef.current ? angle : angle + p.PI;
              
              p.push();
              p.translate(arrowX, arrowY);
              p.rotate(arrowAngle);
              p.fill(0, 183, 235);
              p.noStroke();
              p.triangle(0, 0, -arrowSize, -arrowSize/2, -arrowSize, arrowSize/2);
              p.pop();
            }
          }
        };
        
        // Draw flux information
        const drawFluxInfo = (p) => {
          // Format flux in scientific notation
          const fluxValue = flux.toExponential(2);
          
          // Background panel
          p.fill(26, 32, 44, 220);
          p.stroke(0, 183, 235);
          p.strokeWeight(1);
          p.rect(10, 10, 240, 80, 10);
          
          // Title
          p.fill(0, 183, 235);
          p.noStroke();
          p.textSize(16);
          p.textAlign(p.LEFT, p.CENTER);
          p.text("Electric Flux (Φₑ)", 20, 30);
          
          // Value
          p.fill(255);
          p.textSize(20);
          p.text(`${fluxValue} N·m²/C`, 20, 60);
          
          // Gauss's Law formula
          p.fill(200);
          p.textSize(14);
          p.text("Φₑ = q/ε₀", 170, 30);
        };
        
      }, sketchRef.current);
    };
    
    loadP5();
    
    return () => {
      isMounted = false;
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
      }
    };
  }, [canvasSize]);

  // Reset simulation
  const resetSimulation = () => {
    setChargeMagnitude(1);
    setIsPositive(true);
    setSurfaceRadius(100);
    setSurfaceType('spherical');
  };

  return (
    <div className="flex flex-col items-center w-full relative">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl mb-6 w-full border border-neon-blue/30"
      >
        <div className="flex flex-col md:flex-row gap-6 w-full md:items-end md:justify-between">
          {/* Charge Type Toggle */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-200 text-sm font-semibold mb-1">Charge Type</label>
            <div className="flex items-center gap-3">
              <span className={`transition-colors px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 ${isPositive ? 'bg-neon-red/90 text-white shadow-[0_0_8px_2px_#ff404088]' : 'bg-gray-800 text-gray-300'}`}
                style={{ cursor: 'pointer', minWidth: 70 }}
                onClick={() => setIsPositive(true)}>
                <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" stroke="white" strokeWidth="2"/><path d="M8 5v6M5 8h6" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
                Positive
              </span>
              <span className={`transition-colors px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 ${!isPositive ? 'bg-neon-blue/90 text-white shadow-[0_0_8px_2px_#00b7eb88]' : 'bg-gray-800 text-gray-300'}`}
                style={{ cursor: 'pointer', minWidth: 70 }}
                onClick={() => setIsPositive(false)}>
                <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" stroke="white" strokeWidth="2"/><path d="M5 8h6" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
                Negative
              </span>
            </div>
          </div>
          
          {/* Charge Magnitude */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-200 text-sm font-semibold mb-1">Charge Magnitude (μC)</label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={chargeMagnitude}
                onChange={e => {
                  const val = parseFloat(e.target.value);
                  setChargeMagnitude(isNaN(val) ? '' : val);
                }}
                placeholder="1"
                className="w-24 bg-gray-900 text-white border border-gray-700 rounded-lg px-3 py-2 text-center text-lg font-mono shadow-inner focus:ring-2 focus:ring-neon-blue/40"
                style={{ width: 80 }}
              />
              <span className="ml-1 text-white font-semibold">μC</span>
            </div>
          </div>
          
          {/* Surface Type Toggle */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-200 text-sm font-semibold mb-1">Surface Type</label>
            <div className="flex items-center gap-3">
              <span className={`transition-colors px-3 py-1 rounded-full text-sm font-bold ${surfaceType === 'spherical' ? 'bg-neon-blue/90 text-white shadow-[0_0_8px_2px_#00b7eb88]' : 'bg-gray-800 text-gray-300'}`}
                style={{ cursor: 'pointer' }}
                onClick={() => setSurfaceType('spherical')}>
                Spherical
              </span>
              <span className={`transition-colors px-3 py-1 rounded-full text-sm font-bold ${surfaceType === 'cylindrical' ? 'bg-neon-blue/90 text-white shadow-[0_0_8px_2px_#00b7eb88]' : 'bg-gray-800 text-gray-300'}`}
                style={{ cursor: 'pointer' }}
                onClick={() => setSurfaceType('cylindrical')}>
                Cylindrical
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <label className="text-gray-200 text-sm font-semibold mb-2 block">Surface Radius</label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="50"
              max="200"
              step="1"
              value={surfaceRadius}
              onChange={(e) => setSurfaceRadius(parseInt(e.target.value))}
              className="w-full accent-neon-blue h-2 rounded-lg outline-none focus:ring-2 focus:ring-neon-blue/60 bg-gray-700"
              style={{ accentColor: '#00b7eb' }}
            />
            <span className="text-white font-mono w-12 text-center">{surfaceRadius}</span>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={resetSimulation}
            className="px-6 py-2 bg-gradient-to-r from-neon-blue to-neon-red text-white rounded-full font-bold shadow-lg hover:from-neon-red hover:to-neon-blue transition-all border-2 border-white/10 focus:outline-none focus:ring-2 focus:ring-neon-blue/40"
            style={{ letterSpacing: '0.04em', fontSize: 17 }}
          >
            Reset
          </button>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full"
      >
        <div ref={sketchRef} className="border border-gray-700 rounded-lg overflow-hidden shadow-lg w-full" style={{ position: 'relative' }}></div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-6 w-full glass-card bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-neon-blue/30"
      >
        <h3 className="text-xl font-bold text-neon-blue mb-3">Gauss&apos;s Law Verification</h3>
        <p className="text-gray-200">
          According to Gauss&apos;s Law, the electric flux through any closed surface is proportional to the enclosed charge, regardless of the surface shape or size.
        </p>
        <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-gray-700">
          <p className="text-white">
            <span className="text-neon-blue font-bold">Flux = </span>
            <span className="font-mono">{flux.toExponential(2)}</span> N·m²/C
          </p>
          <p className="text-gray-300 mt-2">
            <span className="text-neon-blue">q/ε₀ = </span>
            <span className="font-mono">
              {((isPositive ? 1 : -1) * chargeMagnitude * 1e-6 / 8.85e-12).toExponential(2)}
            </span> N·m²/C
          </p>
        </div>
      </motion.div>
    </div>
  );
} 