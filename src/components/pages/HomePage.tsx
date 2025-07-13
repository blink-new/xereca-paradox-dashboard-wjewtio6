import { useState, useEffect } from 'react';
import { Target, GripHorizontal, Zap, Shield, CheckCircle, AlertTriangle } from 'lucide-react';

interface HomePageProps {
  accentColor: string;
}

export const HomePage = ({ accentColor }: HomePageProps) => {
  const [aimbotEnabled, setAimbotEnabled] = useState(false);
  const [aimDragEnabled, setAimDragEnabled] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<'success' | 'warning'>('success');
  const [notificationMessage, setNotificationMessage] = useState({ title: '', description: '' });
  const [isInjecting, setIsInjecting] = useState(false);

  // Show notification helper
  const showNotificationHelper = (type: 'success' | 'warning', title: string, description: string) => {
    setNotificationType(type);
    setNotificationMessage({ title, description });
    setShowNotification(true);
    // Hide notification after 4 seconds
    setTimeout(() => setShowNotification(false), 4000);
  };

  const handleAimbotToggle = () => {
    if (!aimbotEnabled) {
      // If AimDrag is enabled, disable it first
      if (aimDragEnabled) {
        setAimDragEnabled(false);
        showNotificationHelper('warning', 'AIMDRAG DISABLED', 'Aimdrag deactivated to enable Aimbot');
        // Wait a moment before enabling aimbot
        setTimeout(() => {
          setIsInjecting(true);
          setTimeout(() => {
            setAimbotEnabled(true);
            setIsInjecting(false);
            showNotificationHelper('success', 'AIMBOT ACTIVATED', 'Advanced targeting system online');
          }, 2000);
        }, 500);
      } else {
        setIsInjecting(true);
        setTimeout(() => {
          setAimbotEnabled(true);
          setIsInjecting(false);
          showNotificationHelper('success', 'AIMBOT ACTIVATED', 'Advanced targeting system online');
        }, 2000);
      }
    } else {
      setAimbotEnabled(false);
      showNotificationHelper('warning', 'AIMBOT DISABLED', 'Targeting system has been deactivated');
    }
  };

  const handleAimDragToggle = () => {
    if (!aimDragEnabled) {
      // If Aimbot is enabled, disable it first
      if (aimbotEnabled) {
        setAimbotEnabled(false);
        showNotificationHelper('warning', 'AIMBOT DISABLED', 'Aimbot deactivated to enable Aimdrag');
        // Wait a moment before enabling aimdrag
        setTimeout(() => {
          setAimDragEnabled(true);
          showNotificationHelper('success', 'AIMDRAG ACTIVATED', 'Smooth aim control system online');
        }, 500);
      } else {
        setAimDragEnabled(true);
        showNotificationHelper('success', 'AIMDRAG ACTIVATED', 'Smooth aim control system online');
      }
    } else {
      setAimDragEnabled(false);
      showNotificationHelper('warning', 'AIMDRAG DISABLED', 'Aim control system has been deactivated');
    }
  };

  const AnimatedToggle = ({ 
    enabled, 
    onToggle, 
    loading = false,
    size = 'lg' 
  }: { 
    enabled: boolean; 
    onToggle: () => void; 
    loading?: boolean;
    size?: 'md' | 'lg';
  }) => {
    const sizeClasses = size === 'lg' ? 'w-20 h-10' : 'w-16 h-8';
    const thumbClasses = size === 'lg' ? 'w-8 h-8' : 'w-6 h-6';
    
    return (
      <button
        onClick={onToggle}
        disabled={loading}
        className={`${sizeClasses} rounded-full border-2 relative transition-all duration-500 hover:scale-105 ${loading ? 'animate-pulse' : ''}`}
        style={{
          background: enabled 
            ? `linear-gradient(135deg, ${accentColor}, ${accentColor}CC)` 
            : 'linear-gradient(135deg, #333, #222)',
          borderColor: enabled ? accentColor : '#555',
          boxShadow: enabled 
            ? `0 0 25px ${accentColor}80, inset 2px 2px 8px rgba(255,255,255,0.3), inset -2px -2px 8px rgba(0,0,0,0.4)` 
            : 'inset 2px 2px 8px rgba(0,0,0,0.5), inset -2px -2px 8px rgba(255,255,255,0.1)'
        }}
      >
        <div
          className={`${thumbClasses} rounded-full border-2 transition-all duration-500 absolute top-1 flex items-center justify-center`}
          style={{
            left: enabled ? 'calc(100% - 36px)' : '4px',
            background: enabled 
              ? 'linear-gradient(135deg, #fff, #f0f0f0)' 
              : 'linear-gradient(135deg, #666, #555)',
            borderColor: enabled ? 'rgba(255,255,255,0.9)' : '#444',
            boxShadow: enabled 
              ? `0 0 15px ${accentColor}60, 3px 3px 6px rgba(0,0,0,0.4)` 
              : '2px 2px 6px rgba(0,0,0,0.5)',
            transform: enabled ? 'rotate(180deg)' : 'rotate(0deg)'
          }}
        >
          {loading && (
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
          )}
        </div>
        
        {/* Glow effect when enabled */}
        {enabled && (
          <div
            className="absolute inset-0 rounded-full opacity-60 animate-pulse"
            style={{
              background: `radial-gradient(circle, ${accentColor}40 0%, transparent 70%)`,
              filter: 'blur(4px)'
            }}
          />
        )}
      </button>
    );
  };

  const FeatureContainer = ({ 
    title, 
    icon, 
    enabled, 
    onToggle, 
    loading = false,
    description,
    disabled = false
  }: { 
    title: string; 
    icon: React.ReactNode; 
    enabled: boolean; 
    onToggle: () => void; 
    loading?: boolean;
    description: string;
    disabled?: boolean;
  }) => (
    <div 
      className={`bg-black/70 backdrop-blur-md border-2 rounded-3xl p-8 space-y-6 transition-all duration-500 hover:scale-105 ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
      style={{ 
        borderColor: enabled ? accentColor : `${accentColor}30`,
        boxShadow: enabled 
          ? `0 0 40px ${accentColor}40, inset 3px 3px 12px rgba(255,255,255,0.1), inset -3px -3px 12px rgba(0,0,0,0.5)` 
          : `0 0 20px ${accentColor}20, inset 2px 2px 8px rgba(255,255,255,0.05), inset -2px -2px 8px rgba(0,0,0,0.3)`,
        background: enabled 
          ? `linear-gradient(135deg, ${accentColor}15, ${accentColor}05)` 
          : 'linear-gradient(135deg, rgba(0,0,0,0.7), rgba(20,20,20,0.7))'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300"
            style={{ 
              background: enabled 
                ? `linear-gradient(135deg, ${accentColor}30, ${accentColor}20)` 
                : 'linear-gradient(135deg, #333, #222)',
              boxShadow: enabled 
                ? `inset 3px 3px 8px rgba(0,0,0,0.3), inset -3px -3px 8px rgba(255,255,255,0.1), 0 0 20px ${accentColor}40` 
                : 'inset 2px 2px 6px rgba(0,0,0,0.5), inset -2px -2px 6px rgba(255,255,255,0.05)'
            }}
          >
            <div style={{ color: enabled ? accentColor : '#666' }}>
              {icon}
            </div>
          </div>
          <div>
            <h3 
              className="text-2xl font-bold gothic-font tracking-wider"
              style={{ color: enabled ? accentColor : '#888' }}
            >
              {title}
            </h3>
            <p className="text-gray-400 text-sm mt-1">{description}</p>
            {disabled && (
              <p className="text-yellow-400 text-xs mt-1 font-mono">
                {title === 'AIMBOT' ? 'AIMDRAG ACTIVE' : 'AIMBOT ACTIVE'}
              </p>
            )}
          </div>
        </div>
        
        <div className={disabled ? 'pointer-events-none' : ''}>
          <AnimatedToggle 
            enabled={enabled} 
            onToggle={onToggle}
            loading={loading}
            size="lg"
          />
        </div>
      </div>
      
      {/* Status Indicator */}
      <div className="flex items-center justify-center py-4">
        <div 
          className="px-6 py-3 rounded-2xl border-2 font-mono text-sm font-bold flex items-center space-x-3"
          style={{
            borderColor: enabled ? '#22c55e' : '#ef4444',
            backgroundColor: enabled ? '#22c55e20' : '#ef444420',
            color: enabled ? '#22c55e' : '#ef4444'
          }}
        >
          <div 
            className="w-3 h-3 rounded-full"
            style={{ 
              backgroundColor: enabled ? '#22c55e' : '#ef4444',
              boxShadow: enabled ? '0 0 10px #22c55e' : '0 0 10px #ef4444'
            }}
          />
          <span>{loading ? 'INJECTING...' : (enabled ? 'ACTIVE' : 'INACTIVE')}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 p-6">
      {/* Header Section */}
      <div className="text-center space-y-6 fade-in-up">
        <div className="flex items-center justify-center space-x-4">
          <div 
            className="w-20 h-20 rounded-3xl flex items-center justify-center"
            style={{ 
              background: `linear-gradient(135deg, ${accentColor}30, ${accentColor}15)`,
              boxShadow: `0 0 30px ${accentColor}40, inset 3px 3px 10px rgba(255,255,255,0.1), inset -3px -3px 10px rgba(0,0,0,0.4)`
            }}
          >
            <Zap 
              className="w-10 h-10" 
              style={{ color: accentColor }}
            />
          </div>
          <div>
            <h1 className="gothic-font text-6xl font-black">
              <span 
                className="cyberpunk-glow flicker"
                style={{ color: accentColor }}
              >
                PARADOX
              </span>
            </h1>
            <p 
              className="text-xl mt-2"
              style={{ color: `${accentColor}AA` }}
            >
              ADVANCED GAMING SYSTEMS
            </p>
          </div>
        </div>
        
        <div 
          className="w-96 h-1 mx-auto rounded-full"
          style={{ 
            background: `linear-gradient(to right, transparent, ${accentColor}, transparent)`,
            boxShadow: `0 0 20px ${accentColor}60`
          }}
        />
      </div>

      {/* Mutual Exclusivity Warning */}
      <div className="max-w-4xl mx-auto">
        <div 
          className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 flex items-center space-x-3"
          style={{ boxShadow: '0 0 15px rgba(234, 179, 8, 0.2)' }}
        >
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
          <p className="text-yellow-300 text-sm gothic-font">
            <strong>SYSTEM NOTICE:</strong> Only one targeting system can be active at a time. Enabling one will automatically disable the other.
          </p>
        </div>
      </div>

      {/* Feature Containers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <FeatureContainer
          title="AIMBOT"
          icon={<Target className="w-8 h-8" />}
          enabled={aimbotEnabled}
          onToggle={handleAimbotToggle}
          loading={isInjecting && !aimbotEnabled}
          description="Advanced targeting assistance system"
          disabled={aimDragEnabled && !aimbotEnabled}
        />
        
        <FeatureContainer
          title="AIMDRAG"
          icon={<GripHorizontal className="w-8 h-8" />}
          enabled={aimDragEnabled}
          onToggle={handleAimDragToggle}
          description="Smooth aim movement control"
          disabled={aimbotEnabled && !aimDragEnabled}
        />
      </div>

      {/* Notification */}
      {showNotification && (
        <div 
          className="fixed top-8 right-8 z-50 bg-black/90 backdrop-blur-md border-2 rounded-2xl p-6 space-y-3 animate-slide-in-right"
          style={{
            borderColor: notificationType === 'success' ? '#22c55e' : '#f59e0b',
            boxShadow: notificationType === 'success' 
              ? `0 0 30px #22c55e40, inset 2px 2px 8px rgba(255,255,255,0.1), inset -2px -2px 8px rgba(0,0,0,0.4)`
              : `0 0 30px #f59e0b40, inset 2px 2px 8px rgba(255,255,255,0.1), inset -2px -2px 8px rgba(0,0,0,0.4)`
          }}
        >
          <div className="flex items-center space-x-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ 
                background: notificationType === 'success' ? '#22c55e20' : '#f59e0b20',
                boxShadow: 'inset 2px 2px 6px rgba(0,0,0,0.3), inset -2px -2px 6px rgba(255,255,255,0.1)'
              }}
            >
              {notificationType === 'success' ? (
                <CheckCircle className="w-6 h-6 text-green-400" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-yellow-400" />
              )}
            </div>
            <div>
              <h4 
                className={`font-bold gothic-font ${notificationType === 'success' ? 'text-green-400' : 'text-yellow-400'}`}
              >
                {notificationMessage.title}
              </h4>
              <p 
                className={`text-sm ${notificationType === 'success' ? 'text-green-300' : 'text-yellow-300'}`}
              >
                {notificationMessage.description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Shield className={`w-4 h-4 ${notificationType === 'success' ? 'text-green-400' : 'text-yellow-400'}`} />
            <span className={`text-xs font-mono ${notificationType === 'success' ? 'text-green-300' : 'text-yellow-300'}`}>
              {notificationType === 'success' ? 'SECURE CONNECTION ESTABLISHED' : 'SYSTEM STATE CHANGED'}
            </span>
          </div>
        </div>
      )}

      {/* System Stats */}
      <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto text-center">
        <div 
          className="bg-black/50 backdrop-blur-sm border rounded-2xl p-6"
          style={{ 
            borderColor: `${accentColor}30`,
            boxShadow: `0 0 15px ${accentColor}20`
          }}
        >
          <div 
            className="text-3xl font-bold font-mono mb-2"
            style={{ color: accentColor }}
          >
            {aimbotEnabled ? '100%' : '0%'}
          </div>
          <div className="text-gray-400 text-sm gothic-font">AIMBOT STATUS</div>
        </div>
        
        <div 
          className="bg-black/50 backdrop-blur-sm border rounded-2xl p-6"
          style={{ 
            borderColor: `${accentColor}30`,
            boxShadow: `0 0 15px ${accentColor}20`
          }}
        >
          <div 
            className="text-3xl font-bold font-mono mb-2"
            style={{ color: accentColor }}
          >
            {aimDragEnabled ? 'ON' : 'OFF'}
          </div>
          <div className="text-gray-400 text-sm gothic-font">AIMDRAG MODE</div>
        </div>
        
        <div 
          className="bg-black/50 backdrop-blur-sm border rounded-2xl p-6"
          style={{ 
            borderColor: `${accentColor}30`,
            boxShadow: `0 0 15px ${accentColor}20`
          }}
        >
          <div 
            className="text-3xl font-bold font-mono mb-2"
            style={{ color: accentColor }}
          >
            SECURE
          </div>
          <div className="text-gray-400 text-sm gothic-font">CONNECTION</div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};