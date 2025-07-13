import { useState, useEffect, useCallback } from 'react';

interface ConfigPageProps {
  accentHue: number;
  onAccentHueChange: (hue: number) => void;
  particleConfig: {
    type: 'dots' | 'lines' | 'matrix';
    intensity: number;
    speed: number;
    enabled: boolean;
  };
  onParticleConfigChange: (config: any) => void;
}

export const ConfigPage = ({ 
  accentHue, 
  onAccentHueChange, 
  particleConfig, 
  onParticleConfigChange 
}: ConfigPageProps) => {
  const [localHue, setLocalHue] = useState(accentHue);
  const [localParticleConfig, setLocalParticleConfig] = useState(particleConfig);

  useEffect(() => {
    setLocalHue(accentHue);
  }, [accentHue]);

  useEffect(() => {
    setLocalParticleConfig(particleConfig);
  }, [particleConfig]);

  const handleHueChange = useCallback((newHue: number) => {
    setLocalHue(newHue);
    onAccentHueChange(newHue);
  }, [onAccentHueChange]);

  const handleParticleConfigChange = useCallback((newConfig: any) => {
    setLocalParticleConfig(newConfig);
    onParticleConfigChange(newConfig);
  }, [onParticleConfigChange]);

  const getAccentColor = (hue: number) => `hsl(${hue}, 85%, 50%)`;

  const ToggleSwitch = ({ 
    enabled, 
    onChange, 
    size = 'md' 
  }: { 
    enabled: boolean; 
    onChange: () => void; 
    size?: 'sm' | 'md' 
  }) => {
    const sizeClasses = size === 'sm' ? 'w-10 h-6' : 'w-12 h-7';
    const thumbClasses = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
    
    return (
      <button
        onClick={onChange}
        className={`${sizeClasses} rounded-full border-2 relative transition-all duration-300 hover:scale-105`}
        style={{
          background: enabled 
            ? `linear-gradient(45deg, ${getAccentColor(localHue)}, ${getAccentColor(localHue)}80)` 
            : 'linear-gradient(45deg, #333, #222)',
          borderColor: enabled ? getAccentColor(localHue) : '#555',
          boxShadow: enabled 
            ? `0 0 15px ${getAccentColor(localHue)}60, inset 1px 1px 3px rgba(255,255,255,0.2)` 
            : 'inset 1px 1px 3px rgba(0,0,0,0.5)'
        }}
        type="button"
      >
        <div
          className={`${thumbClasses} rounded-full border transition-all duration-300 absolute top-1`}
          style={{
            left: enabled ? 'calc(100% - 24px)' : '4px',
            background: enabled ? 'white' : '#666',
            borderColor: enabled ? 'rgba(255,255,255,0.8)' : '#444',
            boxShadow: enabled 
              ? `0 0 8px ${getAccentColor(localHue)}40, 2px 2px 4px rgba(0,0,0,0.3)` 
              : '1px 1px 3px rgba(0,0,0,0.4)'
          }}
        />
      </button>
    );
  };

  const SliderControl = ({ 
    label, 
    value, 
    onChange, 
    min = 0, 
    max = 100,
    step = 1,
    description 
  }: { 
    label: string; 
    value: number; 
    onChange: (val: number) => void; 
    min?: number; 
    max?: number;
    step?: number;
    description?: string;
  }) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-white font-medium text-sm">{label}</h4>
          {description && (
            <p className="text-gray-400 text-xs mt-1">{description}</p>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-white text-sm font-mono min-w-[40px] text-right">{value}</span>
          <span className="text-gray-500 text-xs">/{max}</span>
        </div>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-3 rounded-full appearance-none cursor-pointer slider-enhanced"
          style={{
            background: `linear-gradient(to right, 
              ${getAccentColor(localHue)} 0%, 
              ${getAccentColor(localHue)} ${((value - min) / (max - min)) * 100}%, 
              #1f1f1f ${((value - min) / (max - min)) * 100}%, 
              #1f1f1f 100%)`
          }}
        />
      </div>
    </div>
  );

  const SystemCard = ({ 
    title, 
    icon, 
    children 
  }: { 
    title: string; 
    icon: React.ReactNode; 
    children: React.ReactNode;
  }) => (
    <div 
      className="bg-black/60 backdrop-blur-sm border rounded-xl p-6 space-y-6 transition-all duration-300 hover:scale-[1.02]"
      style={{ 
        borderColor: `${getAccentColor(localHue)}40`,
        boxShadow: `
          0 0 20px ${getAccentColor(localHue)}20,
          inset 2px 2px 8px rgba(255,255,255,0.05),
          inset -2px -2px 8px rgba(0,0,0,0.3)
        `
      }}
    >
      <div className="flex items-center space-x-3 mb-6">
        <div 
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ 
            background: `${getAccentColor(localHue)}20`,
            color: getAccentColor(localHue)
          }}
        >
          {icon}
        </div>
        <h3 
          className="text-xl font-bold tracking-wider"
          style={{ color: getAccentColor(localHue) }}
        >
          {title}
        </h3>
      </div>
      {children}
    </div>
  );

  const SettingRow = ({ 
    label, 
    description, 
    control,
    enabled = true
  }: { 
    label: string; 
    description: string; 
    control: React.ReactNode;
    enabled?: boolean;
  }) => (
    <div className={`flex items-center justify-between py-3 ${!enabled ? 'opacity-50' : ''}`}>
      <div className="flex-1">
        <h4 className="text-white font-medium text-sm">{label}</h4>
        <p className="text-gray-400 text-xs mt-1">{description}</p>
      </div>
      <div className="ml-6">
        {control}
      </div>
    </div>
  );

  return (
    <div className="max-h-full overflow-y-auto space-y-6" style={{ maxHeight: 'calc(100vh - 200px)' }}>
      {/* Header with timestamp */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 
            className="text-2xl font-bold tracking-wider gothic-font"
            style={{ color: getAccentColor(localHue) }}
          >
            XERECA PARADOX
          </h1>
          <p className="text-gray-400 text-sm font-mono">SYSTEM CONFIGURATION</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-mono">ONLINE</span>
          </div>
          <div className="flex items-center space-x-2">
            <div 
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: getAccentColor(localHue) }}
            ></div>
            <span 
              className="text-sm font-mono"
              style={{ color: getAccentColor(localHue) }}
            >
              ACTIVE
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* THEME CONFIGURATION */}
        <SystemCard 
          title="THEME CONTROL" 
          icon={<span className="text-lg">🎨</span>}
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Accent Color Hue: {localHue}°
              </label>
              <input
                type="range"
                min="0"
                max="360"
                step="1"
                value={localHue}
                onChange={(e) => handleHueChange(Number(e.target.value))}
                className="w-full h-4 rounded-full appearance-none cursor-pointer slider-enhanced"
                style={{
                  background: `linear-gradient(to right, 
                    hsl(0, 85%, 50%) 0%, 
                    hsl(60, 85%, 50%) 16.66%, 
                    hsl(120, 85%, 50%) 33.33%, 
                    hsl(180, 85%, 50%) 50%, 
                    hsl(240, 85%, 50%) 66.66%, 
                    hsl(300, 85%, 50%) 83.33%, 
                    hsl(360, 85%, 50%) 100%)`
                }}
              />
              <div className="mt-3 text-xs text-gray-400">
                Adjust the primary color hue for the entire interface
              </div>
            </div>

            {/* Color Preview */}
            <div className="grid grid-cols-5 gap-2">
              {[0, 72, 144, 216, 288].map((hue) => (
                <button
                  key={hue}
                  onClick={() => handleHueChange(hue)}
                  className="w-full h-12 rounded-lg border-2 transition-all duration-200 hover:scale-105"
                  style={{
                    backgroundColor: `hsl(${hue}, 85%, 50%)`,
                    borderColor: localHue === hue ? 'white' : 'transparent',
                    boxShadow: localHue === hue ? `0 0 10px hsl(${hue}, 85%, 50%)` : 'none'
                  }}
                  type="button"
                />
              ))}
            </div>
          </div>
        </SystemCard>

        {/* PARTICLE SYSTEM */}
        <SystemCard 
          title="PARTICLE SYSTEM" 
          icon={<span className="text-lg">✨</span>}
        >
          <div className="space-y-6">
            <SettingRow
              label="Enable Particles"
              description="Toggle dynamic background particles"
              control={
                <ToggleSwitch 
                  enabled={localParticleConfig.enabled} 
                  onChange={() => handleParticleConfigChange({
                    ...localParticleConfig,
                    enabled: !localParticleConfig.enabled
                  })}
                />
              }
            />

            {localParticleConfig.enabled && (
              <>
                <div className="space-y-4">
                  <label className="text-sm font-medium text-gray-300">
                    Particle Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['dots', 'lines', 'matrix'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => handleParticleConfigChange({
                          ...localParticleConfig,
                          type
                        })}
                        className="px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-200 hover:scale-105"
                        style={{
                          background: localParticleConfig.type === type 
                            ? `${getAccentColor(localHue)}20` 
                            : 'transparent',
                          borderColor: localParticleConfig.type === type 
                            ? getAccentColor(localHue) 
                            : '#555',
                          color: localParticleConfig.type === type 
                            ? getAccentColor(localHue) 
                            : '#888'
                        }}
                        type="button"
                      >
                        {type.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <SliderControl
                  label="Intensity"
                  description="Number of particles rendered"
                  value={localParticleConfig.intensity}
                  onChange={(val) => handleParticleConfigChange({
                    ...localParticleConfig,
                    intensity: val
                  })}
                  min={1}
                  max={50}
                  step={1}
                />

                <SliderControl
                  label="Speed"
                  description="Animation speed multiplier"
                  value={Math.round(localParticleConfig.speed * 10)}
                  onChange={(val) => handleParticleConfigChange({
                    ...localParticleConfig,
                    speed: val / 10
                  })}
                  min={1}
                  max={50}
                  step={1}
                />
              </>
            )}
          </div>
        </SystemCard>
      </div>

      {/* SYSTEM INFORMATION */}
      <SystemCard 
        title="SYSTEM STATUS" 
        icon={<span className="text-lg">📊</span>}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div 
              className="text-2xl font-bold font-mono"
              style={{ color: getAccentColor(localHue) }}
            >
              {localHue}°
            </div>
            <div className="text-gray-400 text-sm mt-1">Current Hue</div>
          </div>
          <div className="text-center">
            <div 
              className="text-2xl font-bold font-mono"
              style={{ color: getAccentColor(localHue) }}
            >
              {localParticleConfig.enabled ? 'ON' : 'OFF'}
            </div>
            <div className="text-gray-400 text-sm mt-1">Particles</div>
          </div>
          <div className="text-center">
            <div 
              className="text-2xl font-bold font-mono"
              style={{ color: getAccentColor(localHue) }}
            >
              {localParticleConfig.type.toUpperCase()}
            </div>
            <div className="text-gray-400 text-sm mt-1">Effect Type</div>
          </div>
        </div>
      </SystemCard>
    </div>
  );
};