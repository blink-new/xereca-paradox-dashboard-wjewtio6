import { useState, useEffect } from 'react';
import { QuantumLoader } from './components/QuantumLoader';
import { CyberNavigation } from './components/CyberNavigation';
import { WindowManager } from './components/WindowManager';
import { ParticleSystem } from './components/ParticleSystem';
import { ShutdownAnimation } from './components/ShutdownAnimation';
import { ConfigPage } from './components/pages/ConfigPage';
import { NetworkPage } from './components/pages/NetworkPage';
import { HomePage } from './components/pages/HomePage';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showShutdown, setShowShutdown] = useState(false);
  const [accentHue, setAccentHue] = useState(0); // Red by default
  const [particleConfig, setParticleConfig] = useState({
    type: 'dots' as const,
    intensity: 10,
    speed: 1.5,
    enabled: true
  });
  const [windowManager, setWindowManager] = useState<any>(null);

  // Update CSS variables when accent color changes
  useEffect(() => {
    document.documentElement.style.setProperty('--accent-hue', accentHue.toString());
  }, [accentHue]);

  // Setup navigation event listener
  useEffect(() => {
    const handleNavigation = (event: any) => {
      if (!windowManager) return;
      
      const page = event.detail;
      let title = '';
      let content = null;

      switch (page) {
        case 'paradox':
          title = 'PARADOX CONTROL CENTER';
          content = (
            <HomePage 
              accentColor={getAccentColor()}
            />
          );
          break;
        case 'config':
          title = 'SYSTEM CONFIGURATION';
          content = (
            <ConfigPage 
              accentHue={accentHue}
              onAccentHueChange={setAccentHue}
              particleConfig={particleConfig}
              onParticleConfigChange={setParticleConfig}
            />
          );
          break;
        case 'network':
          title = 'NETWORK STATUS';
          content = (
            <NetworkPage 
              accentColor={getAccentColor()}
            />
          );
          break;
        default:
          return;
      }

      windowManager.openWindow(page, title, content);
    };

    window.addEventListener('navigate', handleNavigation);
    return () => window.removeEventListener('navigate', handleNavigation);
  }, [windowManager, accentHue, particleConfig]);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const handleShutdown = () => {
    setShowShutdown(true);
  };

  const handleShutdownComplete = () => {
    // Refresh the page
    window.location.reload();
  };

  const getAccentColor = () => `hsl(${accentHue}, 85%, 50%)`;

  if (isLoading) {
    return <QuantumLoader onComplete={handleLoadingComplete} />;
  }

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative">
      {/* Background Gradient */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(ellipse at center, ${getAccentColor()}15 0%, transparent 70%)`
        }}
      />

      {/* Particle System */}
      <ParticleSystem
        type={particleConfig.type}
        intensity={particleConfig.intensity}
        speed={particleConfig.speed}
        color={getAccentColor()}
        enabled={particleConfig.enabled}
      />

      {/* Navigation */}
      <CyberNavigation 
        accentColor={getAccentColor()}
        windowManager={windowManager}
        onShutdown={handleShutdown}
      />

      {/* Main Content Area - Just window manager, no default content */}
      <div className="transition-all duration-500 ease-in-out" style={{ marginLeft: '100px' }}>
        <WindowManager accentColor={getAccentColor()}>
          {(wm: any) => {
            // Store window manager reference
            if (!windowManager) {
              setWindowManager(wm);
            }

            // If no windows are open, show blank screen with particles
            const hasOpenWindows = wm.windows && wm.windows.some((w: any) => !w.isMinimized);
            
            if (!hasOpenWindows) {
              return (
                <div className="w-full h-full flex items-center justify-center">
                  {/* Just show particles and background - no content */}
                  <div className="absolute inset-0" />
                </div>
              );
            }

            return null;
          }}
        </WindowManager>
      </div>

      {/* Debug Info (bottom right) */}
      <div 
        className="fixed bottom-4 right-4 text-xs gothic-font z-40"
        style={{ color: `${getAccentColor()}80` }}
      >
        v2.1.0-OPTIMIZED | HUE: {accentHue}° | PARTICLES: {particleConfig.enabled ? 'ON' : 'OFF'}
      </div>

      {/* Shutdown Animation Overlay */}
      {showShutdown && (
        <ShutdownAnimation 
          accentColor={getAccentColor()}
          onComplete={handleShutdownComplete}
        />
      )}
    </div>
  );
}

export default App;