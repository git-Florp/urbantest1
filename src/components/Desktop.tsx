import { useState } from "react";
import { Taskbar } from "./Taskbar";
import { DesktopIcon } from "./DesktopIcon";
import { StartMenu } from "./StartMenu";
import { WindowManager } from "./WindowManager";
import { RecoveryMode } from "./RecoveryMode";
import { FileText, Database, Activity, Radio, FileBox, AlertTriangle, Terminal, Users, Wifi, Cpu, Mail, Globe, Music, Camera, Shield, MapPin, BookOpen, Zap, Wind, Calculator as CalcIcon, Lock, FileWarning, Grid3x3 } from "lucide-react";

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
      id: "explorer",
      name: "File Explorer",
      icon: <FileText className="w-11 h-11" />,
      run: () => openWindow(allApps[0]),
      minimalInclude: true
    },
    {
      id: "monitor",
      name: "System Monitor",
      icon: <Activity className="w-11 h-11" />,
      run: () => openWindow(allApps[1]),
      minimalInclude: true
    },
    {
      id: "personnel",
      name: "Personnel",
      icon: <Users className="w-11 h-11" />,
      run: () => openWindow(allApps[2]),
      standardInclude: true
    },
    {
      id: "logger",
      name: "Action Logger",
      icon: <Database className="w-11 h-11" />,
      run: () => openWindow(allApps[3]),
      minimalInclude: true
    },
    {
      id: "network",
      name: "Network Scanner",
      icon: <Wifi className="w-11 h-11" />,
      run: () => openWindow(allApps[4]),
      standardInclude: true
    },
    {
      id: "terminal",
      name: "Terminal",
      icon: <Terminal className="w-11 h-11" />,
      run: () => openWindow(allApps[5]),
      minimalInclude: true
    },
    {
      id: "task-manager",
      name: "Task Manager",
      icon: <Cpu className="w-11 h-11" />,
      run: () => openWindow(allApps[6]),
      minimalInclude: true
    },
    {
      id: "messages",
      name: "Messages",
      icon: <Mail className="w-11 h-11" />,
      run: () => openWindow(allApps[7]),
      standardInclude: true
    },
    {
      id: "incidents",
      name: "Incidents",
      icon: <FileWarning className="w-11 h-11" />,
      run: () => openWindow(allApps[8]),
      standardInclude: true
    },
    {
      id: "database",
      name: "Specimen DB",
      icon: <Database className="w-11 h-11" />,
      run: () => openWindow(allApps[9]),
      standardInclude: true
    },
    {
      id: "browser",
      name: "Browser",
      icon: <Globe className="w-11 h-11" />,
      run: () => openWindow(allApps[10]),
      minimalInclude: true
    },
    {
      id: "audio-logs",
      name: "Audio Logs",
      icon: <Music className="w-11 h-11" />,
      run: () => openWindow(allApps[11])
    },
    {
      id: "cameras",
      name: "Security Cameras",
      icon: <Camera className="w-11 h-11" />,
      run: () => openWindow(allApps[12]),
      standardInclude: true
    },
    {
      id: "protocols",
      name: "Emergency Protocols",
      icon: <Shield className="w-11 h-11" />,
      run: () => openWindow(allApps[13]),
      standardInclude: true
    },
    {
      id: "map",
      name: "Facility Map",
      icon: <MapPin className="w-11 h-11" />,
      run: () => openWindow(allApps[14]),
      standardInclude: true
    },
    {
      id: "research",
      name: "Research Notes",
      icon: <BookOpen className="w-11 h-11" />,
      run: () => openWindow(allApps[15])
    },
    {
      id: "power",
      name: "Power Grid",
      icon: <Zap className="w-11 h-11" />,
      run: () => openWindow(allApps[16])
    },
    {
      id: "containment",
      name: "Containment",
      icon: <Lock className="w-11 h-11" />,
      run: () => openWindow(allApps[17])
    },
    {
      id: "environment",
      name: "Environment",
      icon: <Wind className="w-11 h-11" />,
      run: () => openWindow(allApps[18])
    },
    {
      id: "calculator",
      name: "Calculator",
      icon: <CalcIcon className="w-11 h-11" />,
      run: () => openWindow(allApps[19]),
      minimalInclude: true
    },
    {
      id: "planner",
      name: "Facility Planner",
      icon: <Grid3x3 className="w-11 h-11" />,
      run: () => openWindow(allApps[20])
    }
  ];

  // Filter apps based on installation type
  const apps = allApps.filter(app => {
    if (installType === 'minimal') {
      return app.minimalInclude === true;
    } else if (installType === 'standard') {
      return app.minimalInclude === true || app.standardInclude === true;
    } else {
      return true; // full installation
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
