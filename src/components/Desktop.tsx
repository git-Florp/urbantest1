import { useState, useEffect } from "react";
import { Taskbar } from "./Taskbar";
import { DesktopIcon } from "./DesktopIcon";
import { StartMenu } from "./StartMenu";
import { WindowManager } from "./WindowManager";
import { RecoveryMode } from "./RecoveryMode";
import { FileText, Database, Activity, Radio, FileBox, AlertTriangle, Terminal, Users, Wifi, Cpu, Mail, Globe, Music, Camera, Shield, MapPin, BookOpen, Zap, Wind, Calculator as CalcIcon, Lock, FileWarning, Grid3x3, ShoppingBag, StickyNote, Palette, Volume2, CloudRain, Clock as ClockIcon, Calendar, Newspaper, Key, HardDrive, FileArchive, FileText as PdfIcon, Sheet, Presentation, Video, Image, Mic, Gamepad2, MessageSquare, VideoIcon, MailOpen, FolderUp, TerminalSquare, Network, HardDrive as DiskIcon, Settings, Activity as PerformanceIcon, ScanLine, Languages, BookOpenCheck, Globe2, MapPinned, Telescope, Beaker, Calculator as PhysicsIcon, Fingerprint, Lock as EncryptionIcon, KeyRound } from "lucide-react";

export interface App {
  id: string;
  name: string;
  icon: React.ReactNode;
  run: () => void;
  minimalInclude?: boolean;
  standardInclude?: boolean;
}

export const Desktop = ({ onLogout, onReboot, onCriticalKill, onOpenAdminPanel, onLockdown }: { onLogout: () => void; onReboot: () => void; onCriticalKill: (processName: string, type?: "kernel" | "virus" | "bluescreen" | "memory" | "corruption" | "overload") => void; onOpenAdminPanel?: () => void; onLockdown?: (protocolName: string) => void; }) => {
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [windows, setWindows] = useState<Array<{ id: string; app: App; zIndex: number }>>([]);
  const [nextZIndex, setNextZIndex] = useState(100);
  const [draggedIcon, setDraggedIcon] = useState<string | null>(null);
  const [iconPositions, setIconPositions] = useState<Record<string, { x: number; y: number }>>(() => {
    const saved = localStorage.getItem('icon_positions');
    return saved ? JSON.parse(saved) : {};
  });
  const [installedApps, setInstalledApps] = useState<string[]>(() => {
    const installed = localStorage.getItem('urbanshade_installed_apps');
    return installed ? JSON.parse(installed) : [];
  });

  const openWindow = (app: App) => {
    const existing = windows.find(w => w.id === app.id);
    if (existing) {
      // Bring to front
      setWindows(prev => prev.map(w => 
        w.id === app.id ? { ...w, zIndex: nextZIndex } : w
      ));
      setNextZIndex(prev => prev + 1);
    } else {
      setWindows(prev => [...prev, { id: app.id, app, zIndex: nextZIndex }]);
      setNextZIndex(prev => prev + 1);
    }
    setStartMenuOpen(false);
  };

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
  };

  const focusWindow = (id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, zIndex: nextZIndex } : w
    ));
    setNextZIndex(prev => prev + 1);
  };

  // Get installation type to filter apps
  const installType = localStorage.getItem('urbanshade_install_type') || 'standard';
  
  const allApps: App[] = [
    {
      id: "app-store",
      name: "App Store",
      icon: <ShoppingBag className="w-11 h-11" />,
      run: () => openWindow(allApps[0]),
      minimalInclude: true
    },
    {
      id: "explorer",
      name: "File Explorer",
      icon: <FileText className="w-11 h-11" />,
      run: () => openWindow(allApps[1]),
      minimalInclude: true
    },
    {
      id: "monitor",
      name: "System Monitor",
      icon: <Activity className="w-11 h-11" />,
      run: () => openWindow(allApps[2]),
      minimalInclude: true
    },
    {
      id: "personnel",
      name: "Personnel",
      icon: <Users className="w-11 h-11" />,
      run: () => openWindow(allApps[3]),
      standardInclude: true
    },
    {
      id: "logger",
      name: "Action Logger",
      icon: <Database className="w-11 h-11" />,
      run: () => openWindow(allApps[4]),
      minimalInclude: true
    },
    {
      id: "network",
      name: "Network Scanner",
      icon: <Wifi className="w-11 h-11" />,
      run: () => openWindow(allApps[5]),
      standardInclude: true
    },
    {
      id: "terminal",
      name: "Terminal",
      icon: <Terminal className="w-11 h-11" />,
      run: () => openWindow(allApps[6]),
      minimalInclude: true
    },
    {
      id: "task-manager",
      name: "Task Manager",
      icon: <Cpu className="w-11 h-11" />,
      run: () => openWindow(allApps[7]),
      minimalInclude: true
    },
    {
      id: "messages",
      name: "Messages",
      icon: <Mail className="w-11 h-11" />,
      run: () => openWindow(allApps[8]),
      standardInclude: true
    },
    {
      id: "incidents",
      name: "Incidents",
      icon: <FileWarning className="w-11 h-11" />,
      run: () => openWindow(allApps[9]),
      standardInclude: true
    },
    {
      id: "database",
      name: "Specimen DB",
      icon: <Database className="w-11 h-11" />,
      run: () => openWindow(allApps[10]),
      standardInclude: true
    },
    {
      id: "browser",
      name: "Browser",
      icon: <Globe className="w-11 h-11" />,
      run: () => openWindow(allApps[11]),
      minimalInclude: true
    },
    {
      id: "audio-logs",
      name: "Audio Logs",
      icon: <Music className="w-11 h-11" />,
      run: () => openWindow(allApps[12])
    },
    {
      id: "cameras",
      name: "Security Cameras",
      icon: <Camera className="w-11 h-11" />,
      run: () => openWindow(allApps[13]),
      standardInclude: true
    },
    {
      id: "protocols",
      name: "Emergency Protocols",
      icon: <Shield className="w-11 h-11" />,
      run: () => openWindow(allApps[14]),
      standardInclude: true
    },
    {
      id: "map",
      name: "Facility Map",
      icon: <MapPin className="w-11 h-11" />,
      run: () => openWindow(allApps[15]),
      standardInclude: true
    },
    {
      id: "research",
      name: "Research Notes",
      icon: <BookOpen className="w-11 h-11" />,
      run: () => openWindow(allApps[16])
    },
    {
      id: "power",
      name: "Power Grid",
      icon: <Zap className="w-11 h-11" />,
      run: () => openWindow(allApps[17])
    },
    {
      id: "containment",
      name: "Containment",
      icon: <Lock className="w-11 h-11" />,
      run: () => openWindow(allApps[18])
    },
    {
      id: "environment",
      name: "Environment",
      icon: <Wind className="w-11 h-11" />,
      run: () => openWindow(allApps[19])
    },
    {
      id: "calculator",
      name: "Calculator",
      icon: <CalcIcon className="w-11 h-11" />,
      run: () => openWindow(allApps[20]),
      minimalInclude: true
    },
    {
      id: "planner",
      name: "Facility Planner",
      icon: <Grid3x3 className="w-11 h-11" />,
      run: () => openWindow(allApps[21])
    },
    // Downloadable Apps
    {
      id: "notepad",
      name: "Notepad",
      icon: <StickyNote className="w-11 h-11" />,
      run: () => openWindow(allApps[22])
    },
    {
      id: "paint",
      name: "Paint Tool",
      icon: <Palette className="w-11 h-11" />,
      run: () => openWindow(allApps[23])
    },
    {
      id: "music-player",
      name: "Media Player",
      icon: <Volume2 className="w-11 h-11" />,
      run: () => openWindow(allApps[24])
    },
    {
      id: "weather",
      name: "Weather Monitor",
      icon: <CloudRain className="w-11 h-11" />,
      run: () => openWindow(allApps[25])
    },
    {
      id: "clock",
      name: "World Clock",
      icon: <ClockIcon className="w-11 h-11" />,
      run: () => openWindow(allApps[26])
    },
    {
      id: "calendar",
      name: "Event Calendar",
      icon: <Calendar className="w-11 h-11" />,
      run: () => openWindow(allApps[27])
    },
    {
      id: "notes",
      name: "Advanced Notes",
      icon: <Newspaper className="w-11 h-11" />,
      run: () => openWindow(allApps[28])
    },
    {
      id: "vpn",
      name: "Secure VPN",
      icon: <Shield className="w-11 h-11" />,
      run: () => openWindow(allApps[29])
    },
    {
      id: "firewall",
      name: "Network Firewall",
      icon: <Shield className="w-11 h-11" />,
      run: () => openWindow(allApps[30])
    },
    {
      id: "antivirus",
      name: "Virus Scanner",
      icon: <Shield className="w-11 h-11" />,
      run: () => openWindow(allApps[31])
    },
    {
      id: "backup",
      name: "Data Backup",
      icon: <HardDrive className="w-11 h-11" />,
      run: () => openWindow(allApps[32])
    },
    {
      id: "compression",
      name: "File Compressor",
      icon: <FileArchive className="w-11 h-11" />,
      run: () => openWindow(allApps[33])
    },
    {
      id: "pdf-reader",
      name: "PDF Viewer",
      icon: <PdfIcon className="w-11 h-11" />,
      run: () => openWindow(allApps[34])
    },
    {
      id: "spreadsheet",
      name: "Data Sheets",
      icon: <Sheet className="w-11 h-11" />,
      run: () => openWindow(allApps[35])
    },
    {
      id: "presentation",
      name: "Slide Maker",
      icon: <Presentation className="w-11 h-11" />,
      run: () => openWindow(allApps[36])
    },
    {
      id: "video-editor",
      name: "Video Editor",
      icon: <Video className="w-11 h-11" />,
      run: () => openWindow(allApps[37])
    },
    {
      id: "image-viewer",
      name: "Photo Gallery",
      icon: <Image className="w-11 h-11" />,
      run: () => openWindow(allApps[38])
    },
    {
      id: "audio-editor",
      name: "Sound Editor",
      icon: <Mic className="w-11 h-11" />,
      run: () => openWindow(allApps[39])
    },
    {
      id: "game-center",
      name: "Game Hub",
      icon: <Gamepad2 className="w-11 h-11" />,
      run: () => openWindow(allApps[40])
    },
    {
      id: "chat",
      name: "Instant Chat",
      icon: <MessageSquare className="w-11 h-11" />,
      run: () => openWindow(allApps[41])
    },
    {
      id: "video-call",
      name: "Video Conference",
      icon: <VideoIcon className="w-11 h-11" />,
      run: () => openWindow(allApps[42])
    },
    {
      id: "email-client",
      name: "Mail Client Pro",
      icon: <MailOpen className="w-11 h-11" />,
      run: () => openWindow(allApps[43])
    },
    {
      id: "ftp",
      name: "FTP Manager",
      icon: <FolderUp className="w-11 h-11" />,
      run: () => openWindow(allApps[44])
    },
    {
      id: "ssh",
      name: "SSH Terminal",
      icon: <TerminalSquare className="w-11 h-11" />,
      run: () => openWindow(allApps[45])
    },
    {
      id: "packet-analyzer",
      name: "Packet Sniffer",
      icon: <Network className="w-11 h-11" />,
      run: () => openWindow(allApps[46])
    },
    {
      id: "disk-manager",
      name: "Disk Utility",
      icon: <DiskIcon className="w-11 h-11" />,
      run: () => openWindow(allApps[47])
    },
    {
      id: "registry",
      name: "Registry Editor",
      icon: <Settings className="w-11 h-11" />,
      run: () => openWindow(allApps[48])
    },
    {
      id: "performance",
      name: "Performance Analyzer",
      icon: <PerformanceIcon className="w-11 h-11" />,
      run: () => openWindow(allApps[49])
    },
    {
      id: "scanner",
      name: "Document Scanner",
      icon: <ScanLine className="w-11 h-11" />,
      run: () => openWindow(allApps[50])
    },
    {
      id: "translator",
      name: "Language Translator",
      icon: <Languages className="w-11 h-11" />,
      run: () => openWindow(allApps[51])
    },
    {
      id: "dictionary",
      name: "Digital Dictionary",
      icon: <BookOpenCheck className="w-11 h-11" />,
      run: () => openWindow(allApps[52])
    },
    {
      id: "encyclopedia",
      name: "Encyclopedia",
      icon: <Globe2 className="w-11 h-11" />,
      run: () => openWindow(allApps[53])
    },
    {
      id: "map-viewer",
      name: "Map Navigator",
      icon: <MapPinned className="w-11 h-11" />,
      run: () => openWindow(allApps[54])
    },
    {
      id: "gps",
      name: "GPS Tracker",
      icon: <MapPin className="w-11 h-11" />,
      run: () => openWindow(allApps[55])
    },
    {
      id: "astronomy",
      name: "Star Chart",
      icon: <Telescope className="w-11 h-11" />,
      run: () => openWindow(allApps[56])
    },
    {
      id: "chemistry",
      name: "Chemistry Lab",
      icon: <Beaker className="w-11 h-11" />,
      run: () => openWindow(allApps[57])
    },
    {
      id: "physics",
      name: "Physics Simulator",
      icon: <PhysicsIcon className="w-11 h-11" />,
      run: () => openWindow(allApps[58])
    },
    {
      id: "biometric",
      name: "Biometric Scanner",
      icon: <Fingerprint className="w-11 h-11" />,
      run: () => openWindow(allApps[59])
    },
    {
      id: "encryption",
      name: "File Encryptor",
      icon: <EncryptionIcon className="w-11 h-11" />,
      run: () => openWindow(allApps[60])
    },
    {
      id: "password-manager",
      name: "Password Vault",
      icon: <KeyRound className="w-11 h-11" />,
      run: () => openWindow(allApps[61])
    }
  ];

  // Listen for app installations
  useEffect(() => {
    const handleStorage = () => {
      const installed = localStorage.getItem('urbanshade_installed_apps');
      setInstalledApps(installed ? JSON.parse(installed) : []);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Filter apps based on installation type and installed apps
  const apps = allApps.filter(app => {
    // App Store and system apps are always available
    const isSystemApp = app.minimalInclude || app.standardInclude || app.id === 'app-store';
    const isDownloadedApp = installedApps.includes(app.id);
    
    if (isDownloadedApp) return true;
    
    if (installType === 'minimal') {
      return app.minimalInclude === true || app.id === 'app-store';
    } else if (installType === 'standard') {
      return app.minimalInclude === true || app.standardInclude === true || app.id === 'app-store';
    } else {
      return isSystemApp; // full installation includes all base apps
    }
  });

  const desktopApps = apps;

  const handleIconDragStart = (appId: string) => {
    setDraggedIcon(appId);
  };

  const handleIconDragEnd = (appId: string, x: number, y: number) => {
    const gridSize = 120;
    const snappedX = Math.round(x / gridSize) * gridSize;
    const snappedY = Math.round(y / gridSize) * gridSize;
    
    const newPositions = {
      ...iconPositions,
      [appId]: { x: snappedX, y: snappedY }
    };
    
    setIconPositions(newPositions);
    localStorage.setItem('icon_positions', JSON.stringify(newPositions));
    setDraggedIcon(null);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Desktop Icons */}
      <div className="relative z-10 p-7">
        <div className="relative" style={{ minHeight: '100vh' }}>
          {desktopApps.map((app, index) => {
            const position = iconPositions[app.id];
            const gridSize = 120;
            const defaultX = (index % 10) * gridSize + 20;
            const defaultY = Math.floor(index / 10) * gridSize + 20;
            
            return (
              <div
                key={app.id}
                style={{
                  position: 'absolute',
                  left: position?.x ?? defaultX,
                  top: position?.y ?? defaultY,
                  width: gridSize,
                }}
              >
                <DesktopIcon 
                  app={app} 
                  onOpen={openWindow}
                  onDragStart={handleIconDragStart}
                  onDragEnd={handleIconDragEnd}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Windows */}
      <WindowManager 
        windows={windows} 
        onClose={closeWindow}
        onFocus={focusWindow}
        allWindows={windows}
        onCloseWindow={closeWindow}
        onCriticalKill={onCriticalKill}
        onOpenAdminPanel={onOpenAdminPanel}
        onLockdown={onLockdown}
      />

      {/* Start Menu */}
      <StartMenu 
        open={startMenuOpen} 
        apps={apps}
        onClose={() => setStartMenuOpen(false)}
        onOpenApp={openWindow}
        onReboot={onReboot}
        onLogout={onLogout}
      />

      {/* Taskbar */}
      <Taskbar 
        onStartClick={() => setStartMenuOpen(!startMenuOpen)}
        pinnedApps={apps.slice(0, 4)}
        onPinnedClick={openWindow}
      />
    </div>
  );
};
