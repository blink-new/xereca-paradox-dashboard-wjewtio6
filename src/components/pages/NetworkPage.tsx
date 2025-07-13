import { useState, useEffect } from 'react';
import { Smartphone, Wifi, Monitor, Globe, Shield, Save } from 'lucide-react';

interface NetworkPageProps {
  accentColor: string;
}

interface NetworkInfo {
  ping: number | null;
  networkName: string;
  hwid: string;
  connectionType: string;
  ip: string;
  speed: string;
}

export const NetworkPage = ({ accentColor }: NetworkPageProps) => {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo>({
    ping: null,
    networkName: 'Unknown Network',
    hwid: 'XXXX-XXXX-XXXX-XXXX',
    connectionType: 'Ethernet',
    ip: '192.168.1.100',
    speed: '1000 Mbps'
  });
  const [pingLoading, setPingLoading] = useState(true);
  const [mobilePort, setMobilePort] = useState('8080');
  const [savedPort, setSavedPort] = useState('8080');
  const [pingHistory, setPingHistory] = useState<number[]>([]);
  const [saveMessage, setSaveMessage] = useState('');

  // Check if port has changed
  const hasPortChanged = mobilePort !== savedPort;

  // Save port function
  const handleSavePort = () => {
    setSavedPort(mobilePort);
    setSaveMessage('Port configuration saved successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  // Generate realistic network data on component mount
  useEffect(() => {
    const generateNetworkInfo = () => {
      // Generate HWID (Hardware ID)
      const hwid = Array.from({length: 4}, () => 
        Math.random().toString(16).substr(2, 4).toUpperCase()
      ).join('-');

      // Detect connection type based on user agent
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const connectionType = isMobile ? 'WiFi' : 'Ethernet';

      // Generate local IP
      const ip = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 254) + 1}`;

      // Get network name (simulated)
      const networkNames = ['HOME-NETWORK', 'XERECA-SECURE', 'OFFICE-WIFI', 'CYBERNET-5G', 'QUANTUM-LINK'];
      const networkName = networkNames[Math.floor(Math.random() * networkNames.length)];

      // Network speed based on connection type
      const speeds = isMobile ? ['150 Mbps', '300 Mbps', '500 Mbps'] : ['100 Mbps', '1000 Mbps', '10 Gbps'];
      const speed = speeds[Math.floor(Math.random() * speeds.length)];

      setNetworkInfo({
        ping: null,
        networkName,
        hwid,
        connectionType,
        ip,
        speed
      });
    };

    generateNetworkInfo();
  }, []);

  // Ping measurement (simulated)
  useEffect(() => {
    const measurePing = () => {
      setPingLoading(true);
      
      // Simulate ping measurement
      setTimeout(() => {
        const ping = Math.floor(Math.random() * 80) + 5; // 5-85ms
        setNetworkInfo(prev => ({ ...prev, ping }));
        setPingHistory(prev => [...prev.slice(-9), ping]); // Keep last 10 values
        setPingLoading(false);
      }, 2000);
    };

    // Initial ping measurement on startup
    measurePing();
  }, []);

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
      className="bg-black/60 backdrop-blur-sm border rounded-xl p-6 space-y-6"
      style={{ 
        borderColor: `${accentColor}40`,
        boxShadow: `0 0 20px ${accentColor}20`
      }}
    >
      <div className="flex items-center space-x-3 mb-6">
        <div 
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ 
            background: `${accentColor}20`,
            color: accentColor
          }}
        >
          {icon}
        </div>
        <h3 
          className="text-xl font-bold tracking-wider"
          style={{ color: accentColor }}
        >
          {title}
        </h3>
      </div>
      {children}
    </div>
  );

  const InfoRow = ({ 
    label, 
    value, 
    icon,
    loading = false 
  }: { 
    label: string; 
    value: string | number | null; 
    icon?: React.ReactNode;
    loading?: boolean;
  }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-800/50">
      <div className="flex items-center space-x-3">
        {icon && (
          <div 
            className="w-6 h-6 flex items-center justify-center"
            style={{ color: `${accentColor}80` }}
          >
            {icon}
          </div>
        )}
        <span className="text-gray-300 font-medium">{label}</span>
      </div>
      <div className="flex items-center space-x-2">
        {loading ? (
          <div className="flex space-x-1">
            <div 
              className="w-2 h-2 rounded-full animate-ping"
              style={{ backgroundColor: accentColor }}
            />
            <div 
              className="w-2 h-2 rounded-full animate-ping"
              style={{ backgroundColor: accentColor, animationDelay: '0.2s' }}
            />
            <div 
              className="w-2 h-2 rounded-full animate-ping"
              style={{ backgroundColor: accentColor, animationDelay: '0.4s' }}
            />
          </div>
        ) : (
          <span 
            className="font-mono font-bold"
            style={{ color: accentColor }}
          >
            {value}
          </span>
        )}
      </div>
    </div>
  );

  const PingIndicator = ({ ping }: { ping: number | null }) => {
    if (ping === null) return null;
    
    const getStatusColor = (ms: number) => {
      if (ms < 20) return '#22c55e'; // green
      if (ms < 50) return '#eab308'; // yellow
      return '#ef4444'; // red
    };

    const getStatusText = (ms: number) => {
      if (ms < 20) return 'EXCELLENT';
      if (ms < 50) return 'GOOD';
      return 'HIGH';
    };

    return (
      <div className="flex items-center space-x-3">
        <div 
          className="w-3 h-3 rounded-full animate-pulse"
          style={{ backgroundColor: getStatusColor(ping) }}
        />
        <span 
          className="text-sm font-medium"
          style={{ color: getStatusColor(ping) }}
        >
          {getStatusText(ping)}
        </span>
      </div>
    );
  };

  const PingChart = () => (
    <div className="flex items-end space-x-1 h-16">
      {pingHistory.map((ping, index) => (
        <div
          key={index}
          className="flex-1 rounded-t transition-all duration-300"
          style={{
            height: `${(ping / 100) * 100}%`,
            backgroundColor: accentColor,
            opacity: 0.3 + (index / pingHistory.length) * 0.7,
            minHeight: '4px'
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="max-h-full overflow-y-auto p-1 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 
            className="text-2xl font-bold tracking-wider"
            style={{ color: accentColor }}
          >
            NETWORK STATUS
          </h1>
          <p className="text-gray-400 text-sm font-mono">REAL-TIME NETWORK MONITORING</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-mono">CONNECTED</span>
          </div>
          <PingIndicator ping={networkInfo.ping} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* NETWORK INFORMATION */}
        <SystemCard 
          title="NETWORK INFO" 
          icon={<Wifi className="w-5 h-5" />}
        >
          <div className="space-y-4">
            <InfoRow 
              label="Ping Latency" 
              value={pingLoading ? null : `${networkInfo.ping}ms`}
              icon={<Globe className="w-4 h-4" />}
              loading={pingLoading}
            />
            <InfoRow 
              label="Network Name" 
              value={networkInfo.networkName}
              icon={<Wifi className="w-4 h-4" />}
            />
            <InfoRow 
              label="Connection Type" 
              value={networkInfo.connectionType}
              icon={<Monitor className="w-4 h-4" />}
            />
            <InfoRow 
              label="IP Address" 
              value={networkInfo.ip}
              icon={<Globe className="w-4 h-4" />}
            />
            <InfoRow 
              label="Network Speed" 
              value={networkInfo.speed}
              icon={<Wifi className="w-4 h-4" />}
            />
          </div>

          {/* Ping History Chart */}
          {pingHistory.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-300 mb-3">Ping History</h4>
              <div 
                className="bg-black/30 rounded-lg p-4 border"
                style={{ borderColor: `${accentColor}30` }}
              >
                <PingChart />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>0ms</span>
                  <span>50ms</span>
                  <span>100ms</span>
                </div>
              </div>
            </div>
          )}
        </SystemCard>

        {/* HARDWARE & SECURITY */}
        <SystemCard 
          title="HARDWARE ID" 
          icon={<Shield className="w-5 h-5" />}
        >
          <div className="space-y-4">
            <div className="text-center p-6 rounded-lg border" style={{ borderColor: `${accentColor}30`, backgroundColor: `${accentColor}10` }}>
              <div className="text-sm text-gray-400 mb-2">System Hardware ID</div>
              <div 
                className="text-xl font-mono font-bold tracking-wider"
                style={{ color: accentColor }}
              >
                {networkInfo.hwid}
              </div>
              <div className="text-xs text-gray-500 mt-2">Unique system identifier</div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div 
                  className="text-lg font-bold font-mono"
                  style={{ color: accentColor }}
                >
                  {networkInfo.connectionType}
                </div>
                <div className="text-gray-400 text-xs">Connection</div>
              </div>
              <div>
                <div 
                  className="text-lg font-bold font-mono"
                  style={{ color: accentColor }}
                >
                  IPv4
                </div>
                <div className="text-gray-400 text-xs">Protocol</div>
              </div>
            </div>
          </div>
        </SystemCard>

        {/* MOBILE CONTROL */}
        <div className="lg:col-span-2">
          <SystemCard 
            title="MOBILE CONTROL" 
            icon={<Smartphone className="w-5 h-5" />}
          >
            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-4 rounded-lg border" style={{ borderColor: `${accentColor}30`, backgroundColor: `${accentColor}05` }}>
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${accentColor}20` }}
                >
                  <Smartphone 
                    className="w-6 h-6"
                    style={{ color: accentColor }}
                  />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium">Remote Access Configuration</h4>
                  <p className="text-gray-400 text-sm">Control this interface from your mobile device</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Connection IP Address
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={networkInfo.ip}
                      readOnly
                      className="w-full px-4 py-3 bg-black/40 border rounded-lg font-mono text-sm cursor-not-allowed"
                      style={{ 
                        borderColor: `${accentColor}40`,
                        color: `${accentColor}80`,
                        backgroundColor: `${accentColor}05`
                      }}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: `${accentColor}60` }}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    This IP is automatically detected and locked for security
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Control Port
                  </label>
                  <div className="space-y-3">
                    <input
                      type="number"
                      value={mobilePort}
                      onChange={(e) => setMobilePort(e.target.value)}
                      min="1000"
                      max="65535"
                      className="w-full px-4 py-3 bg-black/40 border rounded-lg font-mono text-sm transition-all duration-200 focus:outline-none focus:ring-2"
                      style={{ 
                        borderColor: `${accentColor}40`,
                        color: accentColor,
                        backgroundColor: 'rgba(0,0,0,0.6)'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = accentColor;
                        e.target.style.boxShadow = `0 0 0 2px ${accentColor}20`;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = `${accentColor}40`;
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    
                    {/* Save Button - only show when port has changed */}
                    {hasPortChanged && (
                      <button
                        onClick={handleSavePort}
                        className="w-full px-4 py-3 border rounded-lg font-mono text-sm transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
                        style={{ 
                          borderColor: accentColor,
                          color: 'white',
                          backgroundColor: `${accentColor}80`,
                          boxShadow: `0 0 15px ${accentColor}40`
                        }}
                      >
                        <Save className="w-4 h-4" />
                        <span>SAVE PORT</span>
                      </button>
                    )}
                    
                    {/* Success Message */}
                    {saveMessage && (
                      <div
                        className="text-center py-2 px-3 rounded-lg border text-sm font-medium"
                        style={{
                          borderColor: '#22c55e',
                          backgroundColor: '#22c55e20',
                          color: '#22c55e'
                        }}
                      >
                        {saveMessage}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Port range: 1000-65535 (default: 8080)
                  </p>
                </div>
              </div>

              <div className="bg-black/30 rounded-lg p-4 border" style={{ borderColor: `${accentColor}30` }}>
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-white font-medium text-sm">Mobile Access URL</h5>
                    <p className="text-gray-400 text-xs">Use this URL to connect from your mobile device</p>
                  </div>
                  <div 
                    className="px-4 py-2 rounded-lg border font-mono text-sm"
                    style={{ 
                      borderColor: `${accentColor}40`,
                      backgroundColor: `${accentColor}10`,
                      color: accentColor
                    }}
                  >
                    {networkInfo.ip}:{savedPort}
                  </div>
                </div>
              </div>
            </div>
          </SystemCard>
        </div>
      </div>
    </div>
  );
};