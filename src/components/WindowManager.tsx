import { useState, useRef, useEffect, useCallback } from 'react';
import { Minimize2, X } from 'lucide-react';

interface Window {
  id: string;
  title: string;
  content: React.ReactNode;
  isMinimized: boolean;
  isOpening: boolean;
  isClosing: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

interface WindowManagerProps {
  children: React.ReactNode;
  accentColor: string;
}

export const WindowManager = ({ children, accentColor }: WindowManagerProps) => {
  const [windows, setWindows] = useState<Window[]>([]);
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    windowId: string | null;
    offset: { x: number; y: number };
  }>({
    isDragging: false,
    windowId: null,
    offset: { x: 0, y: 0 }
  });

  const constrainPosition = useCallback((x: number, y: number, width: number, height: number) => {
    // Account for navigation sidebar (100px margin from left)
    const minX = 100 + 20; // Navigation margin + padding
    const maxX = window.innerWidth - width - 20;
    const minY = 20;
    const maxY = window.innerHeight - height - 20;

    return {
      x: Math.max(minX, Math.min(maxX, x)),
      y: Math.max(minY, Math.min(maxY, y))
    };
  }, []);

  const openWindow = useCallback((id: string, title: string, content: React.ReactNode) => {
    setWindows(prev => {
      // Check if window is already open
      const existingWindow = prev.find(w => w.id === id);
      if (existingWindow && !existingWindow.isMinimized && !existingWindow.isClosing) {
        setActiveWindow(id);
        return prev;
      }

      if (existingWindow && existingWindow.isMinimized) {
        // Restore minimized window with animation
        setActiveWindow(id);
        return prev.map(w => 
          w.id === id ? { ...w, isMinimized: false, isOpening: true } : w
        );
      }

      // Create new window with opening animation
      const defaultWidth = Math.min(900, window.innerWidth - 120 - 40);
      const defaultHeight = Math.min(700, window.innerHeight - 40);
      
      const baseX = 100 + 50 + prev.length * 30;
      const baseY = 50 + prev.length * 30;
      
      const constrainedPos = constrainPosition(baseX, baseY, defaultWidth, defaultHeight);

      const newWindow: Window = {
        id,
        title,
        content,
        isMinimized: false,
        isOpening: true,
        isClosing: false,
        position: constrainedPos,
        size: { width: defaultWidth, height: defaultHeight }
      };

      setActiveWindow(id);
      
      // Remove opening animation after animation completes
      setTimeout(() => {
        setWindows(currentWindows => 
          currentWindows.map(w => w.id === id ? { ...w, isOpening: false } : w)
        );
      }, 300);

      return [...prev, newWindow];
    });
  }, [constrainPosition]);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => 
      prev.map(w => w.id === id ? { ...w, isClosing: true } : w)
    );
    
    // Actually remove window after animation
    setTimeout(() => {
      setWindows(prev => prev.filter(w => w.id !== id));
      setActiveWindow(prev => prev === id ? null : prev);
    }, 300);
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMinimized: true } : w
    ));
    setActiveWindow(prev => prev === id ? null : prev);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent, windowId: string) => {
    const window = windows.find(w => w.id === windowId);
    if (!window) return;

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setDragState({
      isDragging: true,
      windowId,
      offset: {
        x: e.clientX - window.position.x,
        y: e.clientY - window.position.y
      }
    });
    setActiveWindow(windowId);
  }, [windows]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragState.isDragging || !dragState.windowId) return;

      const window = windows.find(w => w.id === dragState.windowId);
      if (!window) return;

      const newX = e.clientX - dragState.offset.x;
      const newY = e.clientY - dragState.offset.y;
      
      const constrainedPos = constrainPosition(
        newX, 
        newY, 
        window.size.width, 
        window.size.height
      );

      setWindows(prev => prev.map(w => 
        w.id === dragState.windowId 
          ? { ...w, position: constrainedPos }
          : w
      ));
    };

    const handleMouseUp = () => {
      setDragState({
        isDragging: false,
        windowId: null,
        offset: { x: 0, y: 0 }
      });
    };

    if (dragState.isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragState, windows, constrainPosition]);

  // Provide context to children
  const windowContext = {
    openWindow,
    closeWindow,
    minimizeWindow,
    windows,
    activeWindow
  };

  return (
    <div className="relative w-full h-full">
      {/* Main Content */}
      <div className="w-full h-full">
        {typeof children === 'function' ? children(windowContext) : children}
      </div>

      {/* Windows */}
      {windows.map(window => !window.isMinimized && (
        <div
          key={window.id}
          className={`
            fixed z-50 neuromorphic-window overflow-hidden transition-all duration-300 ease-out
            ${activeWindow === window.id ? 'ring-4 ring-opacity-60' : ''}
            ${dragState.isDragging && dragState.windowId === window.id ? 'scale-[1.02]' : ''}
            ${window.isOpening ? 'animate-window-open' : ''}
            ${window.isClosing ? 'animate-window-close' : ''}
          `}
          style={{
            left: window.position.x,
            top: window.position.y,
            width: window.size.width,
            height: window.size.height,
            borderColor: accentColor,
            ringColor: activeWindow === window.id ? accentColor : undefined,
            boxShadow: `
              0 25px 80px rgba(0,0,0,0.6),
              0 0 40px ${accentColor}50,
              inset 3px 3px 12px rgba(255,255,255,0.1),
              inset -3px -3px 12px rgba(0,0,0,0.5)
            `,
            transform: `perspective(1000px) ${dragState.isDragging && dragState.windowId === window.id ? 'rotateX(2deg) rotateY(2deg)' : 'rotateX(0deg) rotateY(0deg)'}`,
            transformOrigin: 'center center'
          }}
          onClick={() => setActiveWindow(window.id)}
        >
          {/* Window Header */}
          <div 
            className="flex items-center justify-between p-4 border-b bg-black/40 cursor-move neuromorphic-header backdrop-blur-md"
            style={{ borderColor: `${accentColor}50` }}
            onMouseDown={(e) => handleMouseDown(e, window.id)}
          >
            <h3 
              className="gothic-font font-semibold text-lg select-none"
              style={{ color: accentColor }}
            >
              {window.title}
            </h3>
            <div className="flex space-x-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  minimizeWindow(window.id);
                }}
                className="group p-2 rounded-full border-2 hover:bg-yellow-500/20 transition-all duration-200 hover:scale-110 neuromorphic-button"
                style={{ 
                  borderColor: '#facc15',
                  boxShadow: `
                    inset 2px 2px 5px rgba(255,255,255,0.2),
                    inset -2px -2px 5px rgba(0,0,0,0.3)
                  `
                }}
                type="button"
              >
                <Minimize2 className="w-4 h-4 text-yellow-400 group-hover:animate-bounce" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  closeWindow(window.id);
                }}
                className="group p-2 rounded-full border-2 hover:bg-red-500/20 transition-all duration-200 hover:scale-110 neuromorphic-button"
                style={{ 
                  borderColor: '#ef4444',
                  boxShadow: `
                    inset 2px 2px 5px rgba(255,255,255,0.2),
                    inset -2px -2px 5px rgba(0,0,0,0.3)
                  `
                }}
                type="button"
              >
                <X className="w-4 h-4 text-red-400 group-hover:rotate-90 transition-transform duration-200" />
              </button>
            </div>
          </div>

          {/* Window Content */}
          <div className="h-full overflow-auto neuromorphic-content bg-black/30 backdrop-blur-sm">
            <div className="p-6">
              {window.content}
            </div>
          </div>
        </div>
      ))}

      {/* Taskbar for minimized windows */}
      {windows.some(w => w.isMinimized) && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <div 
            className="flex space-x-3 p-4 neuromorphic-taskbar rounded-3xl backdrop-blur-md animate-taskbar-appear" 
            style={{ 
              borderColor: accentColor,
              boxShadow: `
                0 15px 40px rgba(0,0,0,0.4),
                0 0 30px ${accentColor}40,
                inset 3px 3px 10px rgba(255,255,255,0.1),
                inset -3px -3px 10px rgba(0,0,0,0.5)
              `
            }}
          >
            {windows.filter(w => w.isMinimized).map(window => (
              <button
                key={window.id}
                onClick={() => {
                  setWindows(prev => prev.map(w => 
                    w.id === window.id ? { ...w, isMinimized: false, isOpening: true } : w
                  ));
                  setActiveWindow(window.id);
                  // Remove opening animation
                  setTimeout(() => {
                    setWindows(currentWindows => 
                      currentWindows.map(w => w.id === window.id ? { ...w, isOpening: false } : w)
                    );
                  }, 300);
                }}
                className="px-6 py-3 border-2 rounded-2xl gothic-font text-sm hover:bg-opacity-20 transition-all duration-300 hover:scale-105 neuromorphic-taskbar-button animate-icon-bounce"
                style={{ 
                  borderColor: `${accentColor}50`,
                  color: accentColor,
                  backgroundColor: `${accentColor}10`,
                  boxShadow: `
                    inset 2px 2px 6px rgba(255,255,255,0.1),
                    inset -2px -2px 6px rgba(0,0,0,0.3),
                    0 0 15px ${accentColor}30
                  `
                }}
              >
                {window.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes window-open {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05) translateY(-5px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes window-close {
          0% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05) translateY(-5px);
          }
          100% {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
        }
        
        @keyframes taskbar-appear {
          0% {
            opacity: 0;
            transform: translateX(-50%) translateY(20px) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translateX(-50%) translateY(0) scale(1);
          }
        }
        
        @keyframes icon-bounce {
          0% {
            transform: scale(0.8) translateY(10px);
          }
          50% {
            transform: scale(1.1) translateY(-5px);
          }
          100% {
            transform: scale(1) translateY(0);
          }
        }
        
        .animate-window-open {
          animation: window-open 0.3s ease-out;
        }
        
        .animate-window-close {
          animation: window-close 0.3s ease-in;
        }
        
        .animate-taskbar-appear {
          animation: taskbar-appear 0.4s ease-out;
        }
        
        .animate-icon-bounce {
          animation: icon-bounce 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};