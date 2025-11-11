import { useState, useEffect } from "react";

interface BootScreenProps {
  onComplete: () => void;
  onSafeMode?: () => void;
}

export const BootScreen = ({ onComplete, onSafeMode }: BootScreenProps) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [showSafeModePrompt, setShowSafeModePrompt] = useState(true);
  const [safeModeCountdown, setSafeModeCountdown] = useState(3);

  const bootMessages = [
    { text: "Urbanshade Hadal Blacksite BIOS v3.7.2-HADAL", duration: 500 },
    { text: "Copyright (C) 2024 Urbanshade Corporation. All Rights Reserved.", duration: 300 },
    { text: "", duration: 100 },
    { text: "Initializing Hadal Processing Unit...", duration: 800 },
    { text: "CPU: HPU-8000 Series @ 8 cores [OK]", duration: 600 },
    { text: "RAM: 64GB ECC DDR5 @ 8247m depth - Testing... [OK]", duration: 1200 },
    { text: "Cache: L1=512KB L2=16MB L3=64MB [OK]", duration: 400 },
    { text: "", duration: 100 },
    { text: "Detecting hardware...", duration: 700 },
    { text: "Primary storage: 2TB NVMe SSD RAID-10 [OK]", duration: 900 },
    { text: "Secondary storage: 8TB HDD Array (Research Data) [OK]", duration: 1100 },
    { text: "Pressure sensors: 24/24 online [OK]", duration: 500 },
    { text: "Hull integrity monitors: Active [OK]", duration: 400 },
    { text: "Biometric scanners: 12/12 operational [OK]", duration: 600 },
    { text: "", duration: 100 },
    { text: "Loading kernel modules:", duration: 500 },
    { text: "  * containment_core.ko", duration: 800 },
    { text: "  * pressure_monitor.ko", duration: 700 },
    { text: "  * specimen_tracking.ko", duration: 900 },
    { text: "  * emergency_protocols.ko", duration: 600 },
    { text: "  * life_support.ko", duration: 800 },
    { text: "", duration: 100 },
    { text: "Mounting filesystems:", duration: 600 },
    { text: "  /dev/sda1 on / type ext4 (rw,relatime) [OK]", duration: 1000 },
    { text: "  /dev/sdb1 on /data/research type ext4 (rw,noexec) [OK]", duration: 1200 },
    { text: "  /dev/sdc1 on /data/specimens type ext4 (rw,encrypted) [OK]", duration: 1500 },
    { text: "  /dev/sdd1 on /data/containment type ext4 (rw,encrypted,classified) [OK]", duration: 1300 },
    { text: "", duration: 100 },
    { text: "Starting system services:", duration: 600 },
    { text: "  [ OK ] systemd-udevd.service - Device Manager Daemon", duration: 500 },
    { text: "  [ OK ] network.service - Network Manager", duration: 800 },
    { text: "  [ OK ] postgresql.service - Database Service", duration: 1200 },
    { text: "  [ OK ] containment.service - Containment Monitor", duration: 700 },
    { text: "  [ WARN ] pressure-zone4.service - Zone 4 Pressure Monitor (elevated readings)", duration: 900 },
    { text: "  [ OK ] life-support.service - Life Support Systems", duration: 600 },
    { text: "  [ OK ] power-grid.service - Power Distribution", duration: 800 },
    { text: "  [ OK ] auth.service - Authentication Service", duration: 500 },
    { text: "  [ OK ] tracking.service - Personnel Tracking", duration: 700 },
    { text: "  [ WARN ] specimen-z13.service - Z-13 Monitor (increased activity)", duration: 1000 },
    { text: "  [ OK ] emergency.service - Emergency Protocols", duration: 600 },
    { text: "  [ OK ] biometric.service - Biometric Access Control", duration: 700 },
    { text: "  [ FAIL ] terminal-t07.service - Terminal T-07 (connection timeout)", duration: 800 },
    { text: "  [ WARN ] camera-c12.service - Security Camera C-12 (no signal)", duration: 900 },
    { text: "  [ OK ] audio-logs.service - Audio Log System", duration: 500 },
    { text: "  [ OK ] incident-report.service - Incident Reporting", duration: 600 },
    { text: "  [ OK ] research-db.service - Research Database", duration: 700 },
    { text: "", duration: 200 },
    { text: "System checks:", duration: 400 },
    { text: "  Depth: 8,247 meters [NOMINAL]", duration: 500 },
    { text: "  External pressure: 8,247 PSI [STABLE]", duration: 600 },
    { text: "  Hull integrity: 98.7% [ACCEPTABLE]", duration: 700 },
    { text: "  Power grid: STABLE (auxiliary ready)", duration: 600 },
    { text: "  Oxygen levels: 21% [NORMAL]", duration: 500 },
    { text: "  Temperature: 4.1°C [OPTIMAL]", duration: 600 },
    { text: "", duration: 200 },
    { text: "Loading display manager...", duration: 800 },
    { text: "Starting Urbanshade Desktop Environment v2.4", duration: 1000 },
    { text: "", duration: 300 },
  ];

  // Safe mode countdown
  useEffect(() => {
    if (!showSafeModePrompt) return;
    
    const interval = setInterval(() => {
      setSafeModeCountdown(prev => {
        if (prev <= 1) {
          setShowSafeModePrompt(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'F8' && showSafeModePrompt) {
        setShowSafeModePrompt(false);
        onSafeMode?.();
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [showSafeModePrompt, onSafeMode]);

  useEffect(() => {
    if (showSafeModePrompt) return;

    let currentIndex = 0;
    
    const showNextMessage = () => {
      if (currentIndex < bootMessages.length) {
        const item = bootMessages[currentIndex];
        if (item) {
          setMessages(prev => [...prev, item.text || ""]);
          const duration = item.duration || 500;
          currentIndex++;
          setTimeout(showNextMessage, duration);
        } else {
          // Skip invalid item defensively
          currentIndex++;
          setTimeout(showNextMessage, 100);
        }
      } else {
        setTimeout(() => {
          onComplete();
        }, 500);
      }
    };

    showNextMessage();
  }, [onComplete, showSafeModePrompt]);

  if (showSafeModePrompt) {
    return (
      <div className="fixed inset-0 bg-black text-primary font-mono flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-2xl font-bold animate-pulse">URBANSHADE OS</div>
          <div className="text-sm">
            Press <kbd className="px-3 py-1 bg-primary/20 rounded text-primary font-bold">F8</kbd> for Safe Mode
          </div>
          <div className="text-xs text-muted-foreground">
            Booting normally in {safeModeCountdown}...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black text-primary font-mono p-8 overflow-y-auto">
      <div className="space-y-0 text-xs">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`${
              msg?.includes('WARN') ? 'text-yellow-500' :
              msg?.includes('FAIL') ? 'text-red-500' :
              msg?.includes('OK') ? 'text-primary' :
              'text-muted-foreground'
            }`}
          >
            {msg || ''}
          </div>
        ))}
      </div>
    </div>
  );
};
