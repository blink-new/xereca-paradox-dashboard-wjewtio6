import { useState, useEffect } from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';

interface ShutdownAnimationProps {
  accentColor: string;
  onComplete: () => void;
}

export const ShutdownAnimation = ({ accentColor, onComplete }: ShutdownAnimationProps) => {
  const [stage, setStage] = useState<'confirm' | 'shutdown' | 'burning' | 'complete'>('confirm');
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (stage === 'shutdown') {
      // Start countdown
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setStage('burning');
            return 0;
          }
          return prev - 1;
        });
      }, 500);
      return () => clearInterval(timer);
    }
  }, [stage]);

  useEffect(() => {
    if (stage === 'burning') {
      // Burn animation duration
      const timer = setTimeout(() => {
        setStage('complete');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  useEffect(() => {
    if (stage === 'complete') {
      // Show final message then refresh
      const timer = setTimeout(() => {
        onComplete();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [stage, onComplete]);

  const handleConfirm = () => {
    setStage('shutdown');
  };

  const handleCancel = () => {
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 transition-all duration-1000 ${
          stage === 'confirm' ? 'bg-black/80 backdrop-blur-sm' :
          stage === 'shutdown' ? 'bg-black/90' :
          stage === 'burning' ? 'bg-red-900/50' : 'bg-black'
        }`}
      />

      {/* Confirmation Dialog */}
      {stage === 'confirm' && (
        <div 
          className="relative z-10 window-glass p-8 rounded-lg max-w-md w-full mx-4 border-2 fade-in-up"
          style={{ 
            borderColor: accentColor,
            boxShadow: `0 0 30px ${accentColor}60`
          }}
        >
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div 
                className="p-4 rounded-full border-2"
                style={{ 
                  borderColor: accentColor,
                  backgroundColor: `${accentColor}20`
                }}
              >
                <AlertTriangle 
                  className="w-12 h-12"
                  style={{ color: accentColor }}
                />
              </div>
            </div>
            
            <div>
              <h2 
                className="gothic-font text-2xl font-bold mb-2"
                style={{ color: accentColor }}
              >
                SYSTEM SHUTDOWN
              </h2>
              <p className="text-gray-300">
                Are you sure you want to terminate the session?
                <br />
                <span className="text-sm opacity-75">This will close the application.</span>
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={handleCancel}
                className="flex-1 px-6 py-3 border-2 border-gray-500 text-gray-300 
                           hover:bg-gray-500/20 transition-all duration-300 gothic-font font-semibold"
              >
                CANCEL
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-6 py-3 border-2 gothic-font font-semibold
                           hover:scale-105 transition-all duration-300"
                style={{
                  borderColor: accentColor,
                  backgroundColor: `${accentColor}20`,
                  color: accentColor,
                  boxShadow: `0 0 15px ${accentColor}40`
                }}
              >
                SHUTDOWN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shutdown Process */}
      {stage === 'shutdown' && (
        <div className="relative z-10 text-center space-y-8">
          <div>
            <h2 
              className="gothic-font text-4xl font-bold mb-4"
              style={{ color: accentColor }}
            >
              SHUTTING DOWN...
            </h2>
            <div 
              className="text-6xl font-bold gothic-font tabular-nums"
              style={{ color: accentColor }}
            >
              {countdown}
            </div>
          </div>
          
          {/* Shutdown animation effects */}
          <div className="space-y-4">
            <div className="flex justify-center space-x-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full animate-pulse"
                  style={{ 
                    backgroundColor: accentColor,
                    animationDelay: `${i * 0.2}s`,
                    boxShadow: `0 0 10px ${accentColor}`
                  }}
                />
              ))}
            </div>
            <p 
              className="text-lg gothic-font"
              style={{ color: `${accentColor}CC` }}
            >
              Terminating processes...
            </p>
          </div>
        </div>
      )}

      {/* Burning Animation */}
      {stage === 'burning' && (
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          {/* Trash can collapsing */}
          <div className="relative mb-8">
            <Trash2 
              className="w-32 h-32 animate-bounce"
              style={{ 
                color: accentColor,
                filter: `drop-shadow(0 0 20px ${accentColor})`
              }}
            />
            
            {/* Fire effect */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="absolute w-4 h-4 rounded-full animate-ping"
                  style={{
                    backgroundColor: i % 2 === 0 ? '#ff4444' : '#ff8844',
                    left: `${(i - 2) * 8}px`,
                    top: `${Math.random() * 20 - 10}px`,
                    animationDelay: `${i * 0.3}s`,
                    animationDuration: '0.8s'
                  }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 
              className="gothic-font text-3xl font-bold animate-pulse"
              style={{ color: accentColor }}
            >
              DELETING SYSTEM FILES...
            </h2>
            <div className="text-sm font-mono text-gray-400 space-y-1">
              <div className="animate-pulse">rm -rf /system/core/*</div>
              <div className="animate-pulse" style={{ animationDelay: '0.5s' }}>rm -rf /user/data/*</div>
              <div className="animate-pulse" style={{ animationDelay: '1s' }}>rm -rf /temp/*</div>
            </div>
          </div>
        </div>
      )}

      {/* Final Message */}
      {stage === 'complete' && (
        <div className="relative z-10 text-center space-y-8 fade-in-up">
          <div className="flex justify-center mb-8">
            <div 
              className="p-6 rounded-full border-2"
              style={{ 
                borderColor: accentColor,
                backgroundColor: `${accentColor}20`,
                boxShadow: `0 0 40px ${accentColor}60`
              }}
            >
              {/* Sherlock Holmes Icon (Detective) */}
              <svg 
                width="64" 
                height="64" 
                viewBox="0 0 24 24" 
                fill="none" 
                style={{ color: accentColor }}
              >
                <path 
                  d="M12 2L13.09 6.26L17 6L16.74 7.09L19 12L16.74 16.91L17 18L13.09 17.74L12 22L10.91 17.74L7 18L7.26 16.91L5 12L7.26 7.09L7 6L10.91 6.26L12 2Z" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  fill="none"
                />
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
            </div>
          </div>
          
          <div>
            <h2 
              className="gothic-font text-4xl font-bold mb-4"
              style={{ color: accentColor }}
            >
              PLEASURE WORKING WITH YOU
            </h2>
            <p 
              className="text-xl text-gray-300"
              style={{ color: `${accentColor}CC` }}
            >
              Session terminated successfully.
            </p>
          </div>

          {/* Elegant dots indicating loading */}
          <div className="flex justify-center space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ 
                  backgroundColor: accentColor,
                  animationDelay: `${i * 0.3}s`
                }}
              />
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};