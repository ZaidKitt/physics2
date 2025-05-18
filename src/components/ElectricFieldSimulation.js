'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import * as math from 'mathjs';
import KaTeX from 'katex';

export default function ElectricFieldSimulation() {
  const sketchRef = useRef(null);
  const p5InstanceRef = useRef(null);
  const chargesRef = useRef([]);
  const isPositiveRef = useRef(true);
  const chargeMagnitudeRef = useRef(1);
  const [charges, setCharges] = useState([]);
  const [isPositive, setIsPositive] = useState(true);
  const [chargeMagnitude, setChargeMagnitude] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(-1);
  const isDraggingRef = useRef(false);
  const draggedIndexRef = useRef(-1);
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 400 });

  useEffect(() => { chargesRef.current = charges; }, [charges]);
  useEffect(() => { isPositiveRef.current = isPositive; }, [isPositive]);
  useEffect(() => { chargeMagnitudeRef.current = chargeMagnitude; }, [chargeMagnitude]);
  useEffect(() => { isDraggingRef.current = isDragging; }, [isDragging]);
  useEffect(() => { draggedIndexRef.current = draggedIndex; }, [draggedIndex]);

  useEffect(() => {
    const updateCanvasSize = () => {
      const containerWidth = sketchRef.current ? sketchRef.current.offsetWidth : 600;
      let width = Math.min(containerWidth, 900);
      let height = width * 0.6;
      setCanvasSize({ width, height });
    };
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  const sketch = (p) => {
    p.setup = () => {
      p.createCanvas(canvasSize.width, canvasSize.height);
      p.colorMode(p.RGB);
      p.textAlign(p.CENTER, p.CENTER);
    };
    p.windowResized = () => {
      p.resizeCanvas(canvasSize.width, canvasSize.height);
    };
    p.draw = () => {
      p.background(26, 32, 44);
      p.stroke(45, 55, 72, 100);
      p.strokeWeight(1);
      const gridSize = 20;
      for (let x = 0; x < canvasSize.width; x += gridSize) {
        p.line(x, 0, x, canvasSize.height);
      }
      for (let y = 0; y < canvasSize.height; y += gridSize) {
        p.line(0, y, canvasSize.width, y);
      }
      chargesRef.current.forEach((charge, index) => {
        const chargeColor = charge.value > 0 ? p.color(255, 64, 64) : p.color(0, 183, 235);
        const fixedRadius = 24;
        // Draw glow
        p.noStroke();
        for (let i = 30; i > 0; i--) {
          const alpha = p.map(i, 0, 30, 0, 50);
          p.fill(p.red(chargeColor), p.green(chargeColor), p.blue(chargeColor), alpha);
          p.ellipse(charge.x, charge.y, fixedRadius + i, fixedRadius + i);
        }
        // Draw charge
        p.fill(chargeColor);
        p.ellipse(charge.x, charge.y, fixedRadius, fixedRadius);
        // Draw charge value inside
        p.fill(255);
        p.textSize(14);
        p.textAlign(p.CENTER, p.CENTER);
        const sign = charge.value > 0 ? '+' : '';
        p.text(`${sign}${charge.value}`, charge.x, charge.y);
        // Draw modern badge for charge index
        p.push();
        const badgeColor = charge.value > 0 ? p.color(255, 64, 64) : p.color(0, 183, 235);
        const badgeGlow = charge.value > 0 ? 'rgba(255,64,64,0.45)' : 'rgba(0,183,235,0.45)';
        const badgeX = charge.x + fixedRadius * 0.85;
        const badgeY = charge.y - fixedRadius * 0.85;
        // Draw badge glow
        p.drawingContext.shadowBlur = 12;
        p.drawingContext.shadowColor = badgeGlow;
        p.fill(badgeColor);
        p.stroke(255);
        p.strokeWeight(1.5);
        p.ellipse(badgeX, badgeY, 26, 26);
        p.drawingContext.shadowBlur = 0;
        // Draw index number
        p.noStroke();
        p.fill(255);
        p.textSize(15);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(index + 1, badgeX, badgeY + 1);
        p.pop();
      });
      // Draw r (distance) between every pair of charges
      for (let i = 0; i < chargesRef.current.length; i++) {
        for (let j = i + 1; j < chargesRef.current.length; j++) {
          const a = chargesRef.current[i];
          const b = chargesRef.current[j];
          // Draw dashed line
          p.push();
          p.stroke(200, 200, 200, 120);
          p.strokeWeight(1.5);
          p.drawingContext.setLineDash([6, 6]);
          p.line(a.x, a.y, b.x, b.y);
          p.drawingContext.setLineDash([]);
          // Calculate r in meters (1 px = 1 cm, so 100 px = 1 m)
          const distPx = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
          const r_m = distPx / 100;
          // Midpoint
          const mx = (a.x + b.x) / 2;
          const my = (a.y + b.y) / 2;
          // Draw label
          p.noStroke();
          p.fill(255, 255, 255, 220);
          p.rectMode(p.CENTER);
          p.textAlign(p.CENTER, p.CENTER);
          p.textSize(13);
          p.push();
          p.translate(mx, my - 12);
          p.rect(0, 0, 54, 22, 6);
          p.fill(0, 183, 235);
          p.text(`r = ${r_m.toFixed(2)} m`, 0, 0);
          p.pop();
          p.pop();
        }
      }
      if (chargesRef.current.length > 0) {
        drawElectricField(p);
      }
    };
    p.mousePressed = () => {
      if (p.mouseX > 0 && p.mouseX < canvasSize.width && p.mouseY > 0 && p.mouseY < canvasSize.height) {
        // Check if clicking on existing charge
        for (let i = 0; i < chargesRef.current.length; i++) {
          const charge = chargesRef.current[i];
          const d = p.dist(p.mouseX, p.mouseY, charge.x, charge.y);
          const fixedRadius = 24;
          if (d < fixedRadius) {
            setIsDragging(true);
            isDraggingRef.current = true;
            setDraggedIndex(i);
            draggedIndexRef.current = i;
            return;
          }
        }
        // Add new charge
        const newCharge = {
          x: p.mouseX,
          y: p.mouseY,
          value: isPositiveRef.current ? chargeMagnitudeRef.current : -chargeMagnitudeRef.current,
        };
        setCharges(prev => {
          const updated = [...prev, newCharge];
          chargesRef.current = updated;
          return updated;
        });
      }
    };
    p.mouseDragged = () => {
      if (isDraggingRef.current && draggedIndexRef.current >= 0) {
        setCharges(prev => {
          const updated = [...prev];
          updated[draggedIndexRef.current] = {
            ...updated[draggedIndexRef.current],
            x: p.mouseX,
            y: p.mouseY
          };
          chargesRef.current = updated;
          return updated;
        });
      }
    };
    p.mouseReleased = () => {
      setIsDragging(false);
      isDraggingRef.current = false;
      setDraggedIndex(-1);
      draggedIndexRef.current = -1;
    };
    const calculateNetField = (x, y) => {
      let netField = { x: 0, y: 0 };
      chargesRef.current.forEach(charge => {
        const dx = x - charge.x;
        const dy = y - charge.y;
        const distSquared = dx * dx + dy * dy;
        if (distSquared < 100) return;
        const dist = math.sqrt(distSquared);
        const fieldMagnitude = 8.9876e9 * (charge.value * 1e-6) / distSquared;
        const fieldX = fieldMagnitude * dx / dist;
        const fieldY = fieldMagnitude * dy / dist;
        netField.x += fieldX;
        netField.y += fieldY;
      });
      return netField;
    };
    const drawElectricField = (p) => {
      const stepsPerLine = 200;
      const stepSize = 8;
      const numLinesPerCharge = 16;
      const minDistToCharge = 18;
      const fieldLineAlpha = 120;
      const fieldLineGlowAlpha = 40;
      const fieldLineWidth = 2;
      const fieldLineGlowWidth = 8;

      // Helper: get color for field line
      const getLineColor = (charge) => {
        return charge.value > 0
          ? p.color(255, 64, 64, fieldLineAlpha) // neon red
          : p.color(0, 183, 235, fieldLineAlpha); // neon blue
      };
      const getGlowColor = (charge) => {
        return charge.value > 0
          ? p.color(255, 64, 64, fieldLineGlowAlpha)
          : p.color(0, 183, 235, fieldLineGlowAlpha);
      };

      // For each positive charge, start streamlines
      chargesRef.current.forEach((charge, idx) => {
        if (charge.value <= 0) return;
        for (let i = 0; i < numLinesPerCharge; i++) {
          const angle = (2 * Math.PI * i) / numLinesPerCharge;
          let x = charge.x + Math.cos(angle) * (charge.radius + 2);
          let y = charge.y + Math.sin(angle) * (charge.radius + 2);
          let points = [{ x, y }];
          let lastField = null;
          for (let step = 0; step < stepsPerLine; step++) {
            // Calculate net field at (x, y)
            const field = calculateNetField(x, y);
            const mag = math.sqrt(field.x * field.x + field.y * field.y);
            if (mag < 1e5) break; // too weak
            // Normalize
            const fx = field.x / mag;
            const fy = field.y / mag;
            // Euler step
            x += fx * stepSize;
            y += fy * stepSize;
            points.push({ x, y });
            // Stop if out of bounds
            if (x < 0 || x > canvasSize.width || y < 0 || y > canvasSize.height) break;
            // Stop if close to any negative charge
            for (const c of chargesRef.current) {
              if (c.value < 0) {
                const d = Math.sqrt((x - c.x) ** 2 + (y - c.y) ** 2);
                if (d < c.radius + minDistToCharge) return;
              }
            }
          }
          // Draw glow
          p.strokeWeight(fieldLineGlowWidth);
          p.stroke(getGlowColor(charge));
          p.noFill();
          p.beginShape();
          for (const pt of points) p.vertex(pt.x, pt.y);
          p.endShape();
          // Draw main line
          p.strokeWeight(fieldLineWidth);
          p.stroke(getLineColor(charge));
          p.noFill();
          p.beginShape();
          for (const pt of points) p.vertex(pt.x, pt.y);
          p.endShape();
        }
      });
    };
  };

  useEffect(() => {
    let isMounted = true;
    import('p5').then((p5Module) => {
      if (!isMounted) return;
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
        p5InstanceRef.current = null;
      }
      p5InstanceRef.current = new p5Module.default(sketch, sketchRef.current);
    });
    return () => {
      isMounted = false;
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
        p5InstanceRef.current = null;
      }
    };
  }, [canvasSize.width, canvasSize.height]);

  const resetSimulation = () => {
    setCharges([]);
    chargesRef.current = [];
  };

  // Helper: calculate net field at a point
  function getNetFieldAt(x, y) {
    let netField = { x: 0, y: 0 };
    chargesRef.current.forEach(charge => {
      const dx = x - charge.x;
      const dy = y - charge.y;
      const distSquared = dx * dx + dy * dy;
      if (distSquared < 100) return;
      const dist = math.sqrt(distSquared);
      const fieldMagnitude = 8.9876e9 * (charge.value * 1e-6) / distSquared;
      const fieldX = fieldMagnitude * dx / dist;
      const fieldY = fieldMagnitude * dy / dist;
      netField.x += fieldX;
      netField.y += fieldY;
    });
    return netField;
  }

  // Helper: render math as HTML
  function renderMath(formula) {
    try {
      return KaTeX.renderToString(formula, { throwOnError: false });
    } catch {
      return formula;
    }
  }

  // Helper: calculate net force on a charge
  function getNetForceOn(targetIdx) {
    const target = charges[targetIdx];
    let net = { x: 0, y: 0 };
    charges.forEach((other, j) => {
      if (j === targetIdx) return;
      const dx = target.x - other.x;
      const dy = target.y - other.y;
      const distSq = dx * dx + dy * dy;
      if (distSq < 100) return;
      const dist = math.sqrt(distSq);
      // F = k_e * |q1*q2| / r^2, direction depends on sign
      const Fmag = 8.9876e9 * (target.value * 1e-6) * (other.value * 1e-6) / distSq;
      const Fx = Fmag * dx / dist;
      const Fy = Fmag * dy / dist;
      net.x += Fx;
      net.y += Fy;
    });
    return net;
  }

  // Helper: format number in scientific notation for LaTeX
  function toLatexSci(num, digits = 2) {
    if (num === 0) return '0';
    const exp = num.toExponential(digits).split('e');
    const base = parseFloat(exp[0]);
    const exponent = parseInt(exp[1], 10);
    if (exponent === 0) return base.toString();
    return `${base} \\times 10^{${exponent}}`;
  }

  return (
    <div className="flex flex-col items-center w-full relative">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-xl mb-8 w-full max-w-3xl flex flex-col md:flex-row md:items-center md:justify-between gap-6 border border-neon-blue/30"
      >
        <div className="flex flex-col md:flex-row gap-6 w-full md:items-end md:justify-between">
          {/* Charge Type Toggle */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-200 text-sm font-semibold mb-1">Charge Type</label>
            <div className="flex items-center gap-3">
              <span className={`transition-colors px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 ${isPositive ? 'bg-neon-red/90 text-white shadow-[0_0_8px_2px_#ff404088]' : 'bg-gray-800 text-gray-300'}`}
                style={{ cursor: 'pointer', minWidth: 70 }}
                onClick={() => { setIsPositive(true); isPositiveRef.current = true; }}>
                <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7" stroke="white" strokeWidth="2"/><path d="M8 5v6M5 8h6" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
                Positive
              </span>
              <span className={`transition-colors px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 ${!isPositive ? 'bg-neon-blue/90 text-white shadow-[0_0_8px_2px_#00b7eb88]' : 'bg-gray-800 text-gray-300'}`}
                style={{ cursor: 'pointer', minWidth: 70 }}
                onClick={() => { setIsPositive(false); isPositiveRef.current = false; }}>
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
                  chargeMagnitudeRef.current = isNaN(val) ? 1 : val;
                }}
                placeholder="1"
                className="w-24 bg-gray-900 text-white border border-gray-700 rounded-lg px-3 py-2 text-center text-lg font-mono shadow-inner focus:ring-2 focus:ring-neon-blue/40"
                style={{ width: 80 }}
              />
              <span className="ml-1 text-white font-semibold">μC</span>
            </div>
          </div>
          {/* Reset Button */}
          <div className="flex flex-col gap-2 md:items-end">
            <label className="invisible select-none">Reset</label>
            <button
              onClick={resetSimulation}
              className="px-6 py-2 bg-gradient-to-r from-neon-blue to-neon-red text-white rounded-full font-bold shadow-lg hover:from-neon-red hover:to-neon-blue transition-all border-2 border-white/10 focus:outline-none focus:ring-2 focus:ring-neon-blue/40"
              style={{ letterSpacing: '0.04em', fontSize: 17 }}
            >
              Reset
            </button>
          </div>
        </div>
        <div className="text-gray-200 text-sm mt-4 text-center w-full">
          <p>Click to add charges. Drag to move them.</p>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-4xl relative"
      >
        <div ref={sketchRef} className="border border-gray-700 rounded-lg overflow-hidden shadow-lg w-full" style={{ position: 'relative' }}></div>
        {/* Delete buttons for each charge */}
        {charges.map((charge, idx) => (
          <button
            key={idx}
            onClick={e => {
              e.stopPropagation();
              const updated = charges.filter((_, i) => i !== idx);
              setCharges(updated);
              chargesRef.current = updated;
            }}
            style={{
              position: 'absolute',
              left: `calc(${charge.x / canvasSize.width * 100}% - 14px)` ,
              top: `calc(${charge.y / canvasSize.height * 100}% - 34px)` ,
              zIndex: 10,
              background: 'rgba(26,28,37,0.85)',
              border: '1px solid #00b7eb',
              color: '#00b7eb',
              borderRadius: '50%',
              width: 28,
              height: 28,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              cursor: 'pointer',
              boxShadow: '0 0 6px #00b7eb44',
              transition: 'background 0.2s',
            }}
            title="Delete charge"
          >
            🗑️
          </button>
        ))}
      </motion.div>
      {/* Net force calculation display */}
      <div className="w-full max-w-4xl mt-6 flex justify-center">
        <div className="bg-dark-surface rounded-lg px-6 py-4 shadow-lg text-center w-full">
          {charges.length < 2 ? (
            <div className="text-gray-400">Add at least two charges to see the net force on each.</div>
          ) : (
            <div className="text-left" style={{ color: '#b3e6ff' }}>
              <div className="mb-4 font-bold text-xl text-neon-blue text-center">Net Force on Each Charge</div>
              {charges.map((target, i) => {
                const net = getNetForceOn(i);
                const mag = math.sqrt(net.x * net.x + net.y * net.y);
                const angle = math.atan2(net.y, net.x) * 180 / Math.PI;
                return (
                  <div key={i} className="mb-14">
                    <div className="glass-card shadow-xl rounded-2xl p-6 mb-8 border border-neon-blue/40 bg-white/10 backdrop-blur-md" style={{ boxShadow: '0 4px 32px 0 #00b7eb33, 0 1.5px 8px 0 #ff404033' }}>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="w-4 h-4 rounded-full" style={{background: target.value > 0 ? '#ff4040' : '#00b7eb', boxShadow: `0 0 12px 2px ${target.value > 0 ? '#ff4040' : '#00b7eb'}`}} />
                        <span className="font-bold text-lg tracking-wide" style={{letterSpacing:'0.01em'}}>
                          Charge {i+1}
                        </span>
                        <span className="text-xs text-gray-300 ml-2">(q = {target.value} μC)</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {charges.map((other, j) => {
                          if (j === i) return null;
                          const dx = target.x - other.x;
                          const dy = target.y - other.y;
                          const dist = Math.sqrt(dx * dx + dy * dy) / 100;
                          const Fmag = 8.9876e9 * Math.abs(target.value * 1e-6 * other.value * 1e-6) / (dist * dist);
                          // Format numbers for LaTeX
                          const q1Latex = `${target.value} \\times 10^{-6}`;
                          const q2Latex = `${other.value} \\times 10^{-6}`;
                          const rLatex = dist.toFixed(2);
                          return (
                            <div key={j} className="mb-3 p-3 border border-gray-700 rounded-md bg-gray-900 bg-opacity-60 shadow-md" style={{ color: '#fff', boxShadow: '0 0 8px #00b7eb22' }}>
                              <div className="mb-2 text-base" dangerouslySetInnerHTML={{ __html: renderMath(`F_{${i+1}${j+1}} = k_e \\frac{|q_{${i+1}} q_{${j+1}}|}{r_{${i+1}${j+1}}^2}`) }} />
                              <div className="mb-2 text-base" dangerouslySetInnerHTML={{ __html: renderMath(`= 8.99 \\times 10^9 \\frac{|${q1Latex} \\times ${q2Latex}|}{(${rLatex})^2}`) }} />
                              <div className="mb-2 text-neon-blue text-lg" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <span dangerouslySetInnerHTML={{ __html: renderMath(`= ${toLatexSci(Fmag)}`) }} /> <span style={{fontFamily:'monospace',color:'#00b7eb'}}>N</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="mt-10 flex justify-center">
                        <div className="text-xl font-bold p-5 border-2 border-neon-blue rounded-lg bg-gray-900 bg-opacity-80 shadow-lg w-full max-w-md text-center mx-auto" style={{ color: '#fff', fontFamily: 'monospace', boxShadow: '0 0 24px #00b7eb66' }}>
                          <span dangerouslySetInnerHTML={{ __html: renderMath(`|\\vec{F}_{\\text{net},${i+1}}|`) }} /> = <span dangerouslySetInnerHTML={{ __html: renderMath(`${toLatexSci(mag)}`) }} /> N, θ = {angle.toFixed(1)}°
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 