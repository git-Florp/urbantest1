import { useState, useEffect } from "react";

interface BootScreenProps {
  onComplete: () => void;
}

export const BootScreen = ({ onComplete }: BootScreenProps) => {
  const [messages, setMessages] = useState<string[]>([]);

  const bootMessages = [
    "Urbanshade Hadal Blacksite BIOS v3.7.2-HADAL",
    "Copyright (C) 2024 Urbanshade Corporation. All Rights Reserved.",
    "",
    "Initializing Hadal Processing Unit...",
    "CPU: HPU-8000 Series @ 8 cores [OK]",
    "RAM: 64GB ECC DDR5 @ 8247m depth - Testing... [OK]",
    "Cache: L1=512KB L2=16MB L3=64MB [OK]",
    "",
    "Detecting hardware...",
    "Primary storage: 2TB NVMe SSD RAID-10 [OK]",
    "Secondary storage: 8TB HDD Array (Research Data) [OK]",
    "Pressure sensors: 24/24 online [OK]",
    "Hull integrity monitors: Active [OK]",
    "Biometric scanners: 12/12 operational [OK]",
    "",
    "Loading kernel modules:",
    "  * containment_core.ko",
    "  * pressure_monitor.ko",
    "  * specimen_tracking.ko",
    "  * emergency_protocols.ko",
    "  * life_support.ko",
    "",
    "Mounting filesystems:",
    "  /dev/sda1 on / type ext4 (rw,relatime) [OK]",
    "  /dev/sdb1 on /data/research type ext4 (rw,noexec) [OK]",
    "  /dev/sdc1 on /data/specimens type ext4 (rw,encrypted) [OK]",
    "  /dev/sdd1 on /data/containment type ext4 (rw,encrypted,classified) [OK]",
    "",
    "Starting system services:",
    "  [ OK ] systemd-udevd.service - Device Manager Daemon",
    "  [ OK ] network.service - Network Manager",
    "  [ OK ] postgresql.service - Database Service",
    "  [ OK ] containment.service - Containment Monitor",
    "  [ WARN ] pressure-zone4.service - Zone 4 Pressure Monitor (elevated readings)",
    "  [ OK ] life-support.service - Life Support Systems",
    "  [ OK ] power-grid.service - Power Distribution",
    "  [ OK ] auth.service - Authentication Service",
    "  [ OK ] tracking.service - Personnel Tracking",
    "  [ WARN ] specimen-z13.service - Z-13 Monitor (increased activity)",
    "  [ OK ] emergency.service - Emergency Protocols",
    "  [ OK ] biometric.service - Biometric Access Control",
    "  [ FAIL ] terminal-t07.service - Terminal T-07 (connection timeout)",
    "  [ WARN ] camera-c12.service - Security Camera C-12 (no signal)",
    "  [ OK ] audio-logs.service - Audio Log System",
    "  [ OK ] incident-report.service - Incident Reporting",
    "  [ OK ] research-db.service - Research Database",
    "",
    "System checks:",
    "  Depth: 8,247 meters [NOMINAL]",
    "  External pressure: 8,247 PSI [STABLE]",
    "  Hull integrity: 98.7% [ACCEPTABLE]",
    "  Power grid: STABLE (auxiliary ready)",
    "  Oxygen levels: 21% [NORMAL]",
    "  Temperature: 4.1°C [OPTIMAL]",
    "",
    "Loading display manager...",
    "Starting Urbanshade Desktop Environment v2.4",
    "",
  ];

  useEffect(() => {
    let currentIndex = 0;
    
    const showNextMessage = () => {
      if (currentIndex < bootMessages.length) {
        setMessages(prev => [...prev, bootMessages[currentIndex]]);
        currentIndex++;
        
        // Random delay between 50ms and 300ms for realistic boot timing
        const delay = Math.random() * 250 + 50;
        setTimeout(showNextMessage, delay);
      } else {
        setTimeout(() => {
          onComplete();
        }, 500);
      }
    };

    showNextMessage();
  }, [onComplete]);

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
