import { useState, useCallback } from 'react';
import { Power, MessageCircle, Settings, Wifi, Home } from 'lucide-react';

interface NavigationProps {
  accentColor: string;
  windowManager?: any;
  onShutdown?: () => void;
}

export const CyberNavigation = ({ accentColor, windowManager, onShutdown }: NavigationProps) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<string>('');

  const navItems = [
    { 
      id: 'paradox', 
      label: 'Paradox', 
      icon: Home
    },
    { 
      id: 'config', 
      label: 'Config', 
      icon: Settings
    },
    { 
      id: 'network', 
      label: 'Network', 
      icon: Wifi
    },
  ];

  const handleNavigation = useCallback((pageId: string) => {
    if (!windowManager) return;
    
    // Check if window is already open and not minimized
    const existingWindow = windowManager.windows.find((w: any) => w.id === pageId);
    if (existingWindow && !existingWindow.isMinimized) {
      // Window is already open, just bring it to focus
      return;
    }
    
    // Set active navigation item
    setActiveItem(pageId);
    
    // Dispatch navigation event that the App component can handle
    window.dispatchEvent(new CustomEvent('navigate', { detail: pageId }));
  }, [windowManager]);

  const handleShutdown = useCallback(() => {
    if (onShutdown) {
      onShutdown();
    }
  }, [onShutdown]);

  return (
    <nav className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40 w-20">
      <div 
        className="bg-black/90 backdrop-blur-md border rounded-2xl p-4 space-y-3 transition-all duration-300"
        style={{ 
          borderColor: `${accentColor}40`,
          boxShadow: `
            0 0 30px ${accentColor}20,
            inset 2px 2px 8px rgba(255,255,255,0.05),
            inset -2px -2px 8px rgba(0,0,0,0.3)
          `
        }}
      >
        {/* Header */}
        <div className="flex justify-center pb-2 border-b border-gray-800">
          <div 
            className="text-xs font-mono gothic-font"
            style={{ color: `${accentColor}80` }}
          >
            XERECA
          </div>
        </div>

        {/* Navigation Items */}
        <div className="space-y-2">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeItem === item.id;
            const isHovered = hoveredItem === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-105 relative group"
                style={{ 
                  background: isActive 
                    ? `linear-gradient(135deg, ${accentColor}30, ${accentColor}20)` 
                    : (isHovered ? `${accentColor}15` : 'transparent'),
                  border: `1px solid ${isActive ? accentColor : (isHovered ? `${accentColor}60` : 'transparent')}`,
                  boxShadow: isActive ? `0 0 15px ${accentColor}40` : 'none'
                }}
                type="button"
              >
                <IconComponent 
                  className="w-5 h-5 transition-all duration-200"
                  style={{ 
                    color: isActive ? accentColor : (isHovered ? accentColor : '#888')
                  }}
                />
                
                {/* Active indicator */}
                {isActive && (
                  <div 
                    className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-1 h-6 rounded-full"
                    style={{ 
                      background: accentColor,
                      boxShadow: `0 0 8px ${accentColor}`
                    }}
                  />
                )}

                {/* Tooltip */}
                <div 
                  className={`
                    absolute left-16 top-1/2 transform -translate-y-1/2 px-3 py-2 rounded-xl
                    backdrop-blur-md border transition-all duration-200 z-50 whitespace-nowrap
                    ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none'}
                  `}
                  style={{
                    background: 'rgba(0, 0, 0, 0.9)',
                    borderColor: `${accentColor}40`,
                    color: accentColor,
                    fontSize: '12px',
                    fontWeight: '500',
                    boxShadow: `0 0 20px ${accentColor}30`
                  }}
                >
                  {item.label}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-gray-800 space-y-2">
          {/* Discord Button */}
          <button
            className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer border"
            style={{ 
              background: `${accentColor}15`,
              borderColor: `${accentColor}40`,
              boxShadow: `0 0 10px ${accentColor}20`
            }}
            type="button"
            onClick={() => {
              // Discord link functionality
              console.log('Discord clicked');
            }}
          >
            <MessageCircle 
              className="w-5 h-5" 
              style={{ 
                color: accentColor,
                filter: `drop-shadow(0 0 4px ${accentColor}60)`
              }}
            />
          </button>

          {/* Shutdown Button */}
          <button 
            className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-105 border"
            style={{
              background: `linear-gradient(135deg, ${accentColor}60, ${accentColor}40)`,
              borderColor: accentColor,
              boxShadow: `0 0 20px ${accentColor}40`
            }}
            onClick={handleShutdown}
            type="button"
          >
            <Power 
              className="w-5 h-5" 
              style={{ color: 'white' }}
            />
          </button>
        </div>
      </div>
    </nav>
  );
};