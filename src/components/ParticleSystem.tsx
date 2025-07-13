import { useEffect, useRef } from 'react';

interface ParticleSystemProps {
  type: 'dots' | 'lines' | 'matrix';
  intensity: number;
  speed: number;
  color: string;
  enabled: boolean;
}

interface Particle {
  element: HTMLElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
}

export const ParticleSystem = ({ type, intensity, speed, color, enabled }: ParticleSystemProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!enabled || !containerRef.current) {
      // Clean up existing particles
      particlesRef.current.forEach(particle => {
        if (particle.element.parentNode) {
          particle.element.parentNode.removeChild(particle.element);
        }
      });
      particlesRef.current = [];
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();

    const createParticle = (): Particle => {
      const element = document.createElement('div');
      element.className = 'particle-element';
      
      let particle: Particle;

      if (type === 'dots') {
        const size = Math.random() * 4 + 2;
        element.style.position = 'absolute';
        element.style.width = `${size}px`;
        element.style.height = `${size}px`;
        element.style.borderRadius = '50%';
        element.style.backgroundColor = color;
        element.style.boxShadow = `0 0 ${size * 3}px ${color}`;
        element.style.pointerEvents = 'none';
        
        particle = {
          element,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * speed * 0.5,
          vy: (Math.random() - 0.5) * speed * 0.5,
          life: 0,
          maxLife: 200 + Math.random() * 300,
          size
        };
      } 
      else if (type === 'lines') {
        const length = Math.random() * 80 + 40;
        const angle = Math.random() * Math.PI * 2;
        
        element.style.position = 'absolute';
        element.style.width = `${length}px`;
        element.style.height = '2px';
        element.style.background = `linear-gradient(90deg, transparent, ${color}, transparent)`;
        element.style.transform = `rotate(${angle}rad)`;
        element.style.transformOrigin = 'left center';
        element.style.boxShadow = `0 0 10px ${color}`;
        element.style.pointerEvents = 'none';
        
        particle = {
          element,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: Math.cos(angle) * speed * 0.3,
          vy: Math.sin(angle) * speed * 0.3,
          life: 0,
          maxLife: 300 + Math.random() * 200,
          size: length
        };
      }
      else { // matrix
        const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        element.textContent = chars[Math.floor(Math.random() * chars.length)];
        element.style.position = 'absolute';
        element.style.color = color;
        element.style.fontFamily = 'monospace';
        element.style.fontSize = `${12 + Math.random() * 8}px`;
        element.style.fontWeight = 'bold';
        element.style.textShadow = `0 0 10px ${color}`;
        element.style.pointerEvents = 'none';
        element.style.userSelect = 'none';
        
        particle = {
          element,
          x: Math.random() * window.innerWidth,
          y: -20,
          vx: (Math.random() - 0.5) * speed * 0.2,
          vy: speed * (0.5 + Math.random() * 0.8),
          life: 0,
          maxLife: Math.floor(window.innerHeight / (speed * 0.8)) + 50,
          size: 12
        };
      }

      container.appendChild(element);
      return particle;
    };

    const updateParticles = () => {
      // Remove old particles
      particlesRef.current = particlesRef.current.filter(particle => {
        particle.life++;
        
        // Check if particle should be removed
        if (particle.life >= particle.maxLife || 
            particle.x < -50 || particle.x > window.innerWidth + 50 ||
            particle.y < -50 || particle.y > window.innerHeight + 50) {
          if (particle.element.parentNode) {
            particle.element.parentNode.removeChild(particle.element);
          }
          return false;
        }

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Update opacity based on life
        const opacity = Math.max(0, 1 - (particle.life / particle.maxLife));
        
        // Apply position and opacity
        particle.element.style.left = `${particle.x}px`;
        particle.element.style.top = `${particle.y}px`;
        particle.element.style.opacity = opacity.toString();

        // Special effects for different types
        if (type === 'dots') {
          // Pulsing effect
          const scale = 0.5 + 0.5 * Math.sin(particle.life * 0.1);
          particle.element.style.transform = `scale(${scale})`;
        } else if (type === 'lines') {
          // Rotation effect
          const currentRotation = particle.life * 0.02;
          const length = particle.size * (0.5 + 0.5 * opacity);
          particle.element.style.width = `${length}px`;
          particle.element.style.transform = `rotate(${currentRotation}rad)`;
        } else if (type === 'matrix') {
          // Character change effect
          if (particle.life % 10 === 0) {
            const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
            particle.element.textContent = chars[Math.floor(Math.random() * chars.length)];
          }
        }

        return true;
      });

      // Add new particles based on intensity
      const targetCount = Math.floor(intensity * 2);
      while (particlesRef.current.length < targetCount && Math.random() < 0.3) {
        particlesRef.current.push(createParticle());
      }

      // Continue animation
      animationRef.current = requestAnimationFrame(updateParticles);
    };

    // Start animation
    updateParticles();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      // Clean up particles
      particlesRef.current.forEach(particle => {
        if (particle.element.parentNode) {
          particle.element.parentNode.removeChild(particle.element);
        }
      });
      particlesRef.current = [];
    };
  }, [type, intensity, speed, color, enabled]);

  if (!enabled) return null;

  return (
    <div 
      ref={containerRef} 
      className="particles-container fixed inset-0 pointer-events-none z-[1]"
      style={{ overflow: 'hidden' }}
    />
  );
};