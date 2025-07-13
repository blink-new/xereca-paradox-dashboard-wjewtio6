import { useState, useEffect } from 'react';

interface QuantumLoaderProps {
  onComplete: () => void;
}

export const QuantumLoader = ({ onComplete }: QuantumLoaderProps) => {
  const [progress, setProgress] = useState(0);
  const [currentText, setCurrentText] = useState('Initializing Quantum Field...');
  const [showWelcome, setShowWelcome] = useState(false);
  const [showParadox, setShowParadox] = useState(false);
  const [showXereca, setShowXereca] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [xAnimation, setXAnimation] = useState(false);

  useEffect(() => {
    // Sequence timing
    const welcomeTimer = setTimeout(() => setShowWelcome(true), 800);
    const paradoxTimer = setTimeout(() => setShowParadox(true), 2000);
    const xerecaTimer = setTimeout(() => setShowXereca(true), 3500);
    const xAnimTimer = setTimeout(() => setXAnimation(true), 4000);

    // Progress bar animation
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          // Start fade out after completion
          setTimeout(() => setFadeOut(true), 1200);
          // Complete loading after fade
          setTimeout(() => onComplete(), 2000);
          return 100;
        }
        return prev + 1.5;
      });
    }, 80);

    // Dynamic status text
    const textTimer = setInterval(() => {
      setProgress(current => {
        if (current < 20) setCurrentText('Initializing Quantum Field...');
        else if (current < 40) setCurrentText('Mapping Dimensional Coordinates...');
        else if (current < 60) setCurrentText('Establishing Neural Links...');
        else if (current < 80) setCurrentText('Synchronizing Reality Matrix...');
        else if (current < 95) setCurrentText('Activating Paradox Engine...');
        else setCurrentText('Welcome to the Nexus...');
        return current;
      });
    }, 100);

    return () => {
      clearTimeout(welcomeTimer);
      clearTimeout(paradoxTimer);
      clearTimeout(xerecaTimer);
      clearTimeout(xAnimTimer);
      clearInterval(progressTimer);
      clearInterval(textTimer);
    };
  }, [onComplete]);

  return (
    <>
      {/* Global Styles for Loader */}
      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes x-dimensional {
          0%, 100% { transform: scale(1.2) rotateY(0deg); }
          25% { transform: scale(1.4) rotateY(180deg); }
          50% { transform: scale(1.3) rotateY(360deg); }
          75% { transform: scale(1.5) rotateY(540deg); }
        }
        
        @keyframes cosmic-burst {
          0% { 
            opacity: 0; 
            transform: scale(0) translateX(20px);
          }
          50% { 
            opacity: 1; 
            transform: scale(1) translateX(80px);
          }
          100% { 
            opacity: 0; 
            transform: scale(0) translateX(120px);
          }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
        
        @keyframes glitch {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-2px); }
          40% { transform: translateX(2px); }
          60% { transform: translateX(-1px); }
          80% { transform: translateX(1px); }
        }
        
        @keyframes quantum-string {
          0%, 100% { 
            opacity: 0.2; 
            transform: scaleY(1) translateY(0);
          }
          50% { 
            opacity: 0.6; 
            transform: scaleY(1.2) translateY(-10px);
          }
        }
        
        @keyframes pulse-glow {
          0%, 100% { 
            filter: drop-shadow(0 0 10px currentColor);
          }
          50% { 
            filter: drop-shadow(0 0 20px currentColor) drop-shadow(0 0 30px currentColor);
          }
        }

        @keyframes cyberpunk-glow {
          0%, 100% { 
            filter: drop-shadow(0 0 20px rgba(255, 0, 128, 0.5));
          }
          50% { 
            filter: drop-shadow(0 0 40px rgba(255, 0, 128, 0.8)) drop-shadow(0 0 60px rgba(255, 0, 128, 0.4));
          }
        }

        @keyframes particle-glow {
          0%, 100% { 
            box-shadow: 0 0 5px currentColor, 0 0 10px currentColor;
            filter: brightness(1);
          }
          50% { 
            box-shadow: 0 0 15px currentColor, 0 0 25px currentColor, 0 0 35px currentColor;
            filter: brightness(1.5);
          }
        }

        @keyframes spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>

      <div className={`fixed inset-0 z-50 overflow-hidden transition-opacity duration-1000 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}>
        {/* Quantum Field Background */}
        <div className="absolute inset-0 bg-black">
          {/* Cosmic Nebula Layer 1 */}
          <div 
            className="absolute inset-0 opacity-60"
            style={{
              background: `
                radial-gradient(ellipse at 20% 30%, rgba(138, 43, 226, 0.4) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 70%, rgba(75, 0, 130, 0.3) 0%, transparent 50%),
                radial-gradient(ellipse at 50% 50%, rgba(25, 25, 112, 0.2) 0%, transparent 70%)
              `
            }}
          />
          
          {/* Cosmic Nebula Layer 2 - Pulsating */}
          <div 
            className="absolute inset-0 opacity-40 animate-pulse"
            style={{
              background: `
                radial-gradient(ellipse at 60% 20%, rgba(255, 20, 147, 0.3) 0%, transparent 60%),
                radial-gradient(ellipse at 30% 80%, rgba(0, 191, 255, 0.2) 0%, transparent 60%)
              `,
              animationDuration: '4s'
            }}
          />

          {/* Quantum Grid */}
          <div className="absolute inset-0 opacity-20">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(0, 255, 255, 0.3) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0, 255, 255, 0.3) 1px, transparent 1px)
                `,
                backgroundSize: '80px 80px',
                transform: 'perspective(800px) rotateX(60deg)',
                transformOrigin: 'center bottom'
              }}
            />
          </div>

          {/* Floating Quantum Particles */}
          {[...Array(25)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full opacity-70"
              style={{
                width: `${Math.random() * 6 + 2}px`,
                height: `${Math.random() * 6 + 2}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: `hsl(${180 + Math.random() * 100}, 70%, 60%)`,
                boxShadow: `0 0 ${Math.random() * 20 + 10}px currentColor`,
                animation: `particle-float ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}

          {/* Holographic Rings */}
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute border rounded-full opacity-30"
              style={{
                width: `${200 + i * 100}px`,
                height: `${200 + i * 100}px`,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                borderColor: `hsl(${240 + i * 30}, 70%, 60%)`,
                borderWidth: '2px',
                animation: `spin ${10 + i * 5}s linear infinite`,
                animationDelay: `${i * 0.5}s`
              }}
            />
          ))}

          {/* Central Glowing Portal */}
          <div 
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full opacity-40"
            style={{
              background: `
                radial-gradient(circle, 
                  rgba(0, 255, 255, 0.8) 0%, 
                  rgba(138, 43, 226, 0.6) 30%, 
                  rgba(75, 0, 130, 0.4) 60%, 
                  transparent 100%
                )
              `,
              animation: 'spin 20s linear infinite, pulse-glow 3s ease-in-out infinite alternate'
            }}
          />
        </div>

        {/* Content Layer */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full space-y-12 px-8">
          
          {/* Advanced Text Transitions */}
          <div className="text-center space-y-8">
            {/* Welcome Text */}
            <div className={`transition-all duration-1000 ease-out ${
              showWelcome ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <h1 className="text-2xl md:text-4xl font-light text-white/90 gothic-font tracking-wider">
                Welcome to
              </h1>
            </div>

            {/* PARADOX Text with Multi-color Gradient */}
            <div className={`transition-all duration-1500 ease-out delay-500 ${
              showParadox ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
            }`}>
              <h2 
                className="text-6xl md:text-8xl font-black gothic-font tracking-wider"
                style={{
                  background: `linear-gradient(45deg, 
                    #ff0080, #ff8000, #ffff00, #80ff00, 
                    #00ff80, #0080ff, #8000ff, #ff0080
                  )`,
                  backgroundSize: '300% 300%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  animation: 'gradient-shift 3s ease-in-out infinite, cyberpunk-glow 2s ease-in-out infinite alternate',
                  filter: 'drop-shadow(0 0 20px rgba(255, 0, 128, 0.5))'
                }}
              >
                PARADOX
              </h2>
            </div>

            {/* XERECA 69 Text with Dimensional X Animation */}
            <div className={`transition-all duration-1500 ease-out delay-1000 ${
              showXereca ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}>
              <div className="relative">
                <h3 className="text-4xl md:text-6xl font-bold gothic-font tracking-widest text-white/80">
                  <span className="relative">
                    {/* The X with special animation */}
                    <span 
                      className={`inline-block transition-all duration-1000 ${
                        xAnimation ? 'animate-pulse' : ''
                      }`}
                      style={{
                        background: `linear-gradient(45deg, #ff006e, #8338ec, #3a86ff, #06ffa5, #ffbe0b)`,
                        backgroundSize: '300% 300%',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        animation: xAnimation ? 'gradient-shift 2s ease-in-out infinite, x-dimensional 3s ease-in-out infinite' : 'none',
                        filter: 'drop-shadow(0 0 15px rgba(255, 0, 110, 0.7))',
                        transform: xAnimation ? 'scale(1.2)' : 'scale(1)'
                      }}
                    >
                      X
                    </span>
                    ERECA 69
                  </span>
                  
                  {/* Cosmic Particles from X */}
                  {xAnimation && [...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 rounded-full opacity-80"
                      style={{
                        background: `hsl(${i * 30}, 70%, 60%)`,
                        left: '50%',
                        top: '50%',
                        transform: `
                          translate(-50%, -50%) 
                          rotate(${i * 30}deg) 
                          translateX(${60 + Math.random() * 40}px)
                        `,
                        boxShadow: `0 0 10px currentColor`,
                        animation: `cosmic-burst 2s ease-out infinite`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </h3>
              </div>
            </div>
          </div>

          {/* Quantum Loading System */}
          <div className={`w-full max-w-md transition-all duration-1000 delay-1500 ${
            showXereca ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            {/* Energy Bar Container */}
            <div className="relative">
              {/* Quantum Dots Pattern */}
              <div className="absolute -top-4 left-0 right-0 flex justify-between">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 h-1 rounded-full"
                    style={{
                      background: `hsl(${180 + (progress * 2)}, 70%, 60%)`,
                      opacity: progress > (i * 5) ? 1 : 0.3,
                      boxShadow: progress > (i * 5) ? `0 0 6px currentColor` : 'none',
                      animation: progress > (i * 5) ? 'particle-glow 1s ease-in-out infinite' : 'none'
                    }}
                  />
                ))}
              </div>

              {/* Main Progress Bar */}
              <div className="h-3 bg-black/50 rounded-full border border-cyan-500/30 overflow-hidden backdrop-blur-sm">
                <div 
                  className="h-full rounded-full transition-all duration-200 ease-out relative"
                  style={{
                    width: `${progress}%`,
                    background: `linear-gradient(90deg, 
                      #ff006e 0%, 
                      #8338ec 25%, 
                      #3a86ff 50%, 
                      #06ffa5 75%, 
                      #ffbe0b 100%
                    )`,
                    boxShadow: `
                      0 0 20px rgba(6, 255, 165, 0.5),
                      inset 0 0 10px rgba(255, 255, 255, 0.2)
                    `
                  }}
                >
                  {/* Moving light effect */}
                  <div 
                    className="absolute top-0 right-0 w-8 h-full opacity-60"
                    style={{
                      background: `linear-gradient(90deg, 
                        transparent 0%, 
                        rgba(255, 255, 255, 0.8) 50%, 
                        transparent 100%
                      )`,
                      animation: 'shimmer 1.5s ease-in-out infinite'
                    }}
                  />
                </div>
              </div>

              {/* Progress Percentage */}
              <div className="mt-4 text-center">
                <div 
                  className="text-xl font-bold gothic-font"
                  style={{
                    color: `hsl(${180 + (progress * 2)}, 70%, 60%)`,
                    textShadow: `0 0 10px currentColor`
                  }}
                >
                  {Math.round(progress)}%
                </div>
              </div>
            </div>

            {/* Dynamic Status Text */}
            <div className="mt-6 text-center">
              <p 
                className="text-sm md:text-base text-white/70 gothic-font tracking-wide transition-all duration-500"
                style={{
                  textShadow: '0 0 8px rgba(255, 255, 255, 0.3)'
                }}
              >
                {currentText}
              </p>
            </div>
          </div>

          {/* Cosmic Effects Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Digital Glitch Effect */}
            {Math.random() > 0.95 && (
              <div 
                className="absolute inset-0 opacity-10"
                style={{
                  background: `repeating-linear-gradient(
                    0deg,
                    transparent,
                    transparent 2px,
                    rgba(0, 255, 255, 0.1) 2px,
                    rgba(0, 255, 255, 0.1) 4px
                  )`,
                  animation: 'glitch 0.1s ease-in-out'
                }}
              />
            )}

            {/* Quantum Strings */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute opacity-20"
                style={{
                  width: '2px',
                  height: '100%',
                  left: `${10 + i * 12}%`,
                  background: `linear-gradient(to bottom, 
                    transparent 0%, 
                    rgba(0, 255, 255, 0.6) 50%, 
                    transparent 100%
                  )`,
                  animation: `quantum-string ${4 + i * 0.5}s ease-in-out infinite`,
                  animationDelay: `${i * 0.3}s`
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};