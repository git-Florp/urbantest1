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
}

export const Desktop = ({ onLogout, onReboot, onCriticalKill, onOpenAdminPanel, onLockdown }: { onLogout: () => void; onReboot: () => void; onCriticalKill: (processName: string, type?: "kernel" | "virus" | "bluescreen" | "memory" | "corruption" | "overload") => void; onOpenAdminPanel?: () => void; onLockdown?: (protocolName: string) => void; }) => {
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [windows, setWindows] = useState<Array<{ id: string; app: App; zIndex: number }>>([]);
  const [nextZIndex, setNextZIndex] = useState(100);

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

  const apps: App[] = [
    {
      id: "explorer",
      name: "File Explorer",
      icon: <FileText className="w-11 h-11" />,
      run: () => openWindow(apps[0])
    },
    {
      id: "monitor",
      name: "System Monitor",
      icon: <Activity className="w-11 h-11" />,
      run: () => openWindow(apps[1])
    },
    {
      id: "personnel",
      name: "Personnel",
      icon: <Users className="w-11 h-11" />,
      run: () => openWindow(apps[2])
    },
    {
      id: "logger",
      name: "Action Logger",
      icon: <Database className="w-11 h-11" />,
      run: () => openWindow(apps[3])
    },
    {
      id: "network",
      name: "Network Scanner",
      icon: <Wifi className="w-11 h-11" />,
      run: () => openWindow(apps[4])
    },
    {
      id: "terminal",
      name: "Terminal",
      icon: <Terminal className="w-11 h-11" />,
      run: () => openWindow(apps[5])
    },
    {
      id: "task-manager",
      name: "Task Manager",
      icon: <Cpu className="w-11 h-11" />,
      run: () => openWindow(apps[6])
    },
    {
      id: "messages",
      name: "Messages",
      icon: <Mail className="w-11 h-11" />,
      run: () => openWindow(apps[7])
    },
    {
      id: "incidents",
      name: "Incidents",
      icon: <FileWarning className="w-11 h-11" />,
      run: () => openWindow(apps[8])
    },
    {
      id: "database",
      name: "Specimen DB",
      icon: <Database className="w-11 h-11" />,
      run: () => openWindow(apps[9])
    },
    {
      id: "browser",
      name: "Browser",
      icon: <Globe className="w-11 h-11" />,
      run: () => openWindow(apps[10])
    },
    {
      id: "audio-logs",
      name: "Audio Logs",
      icon: <Music className="w-11 h-11" />,
      run: () => openWindow(apps[11])
    },
    {
      id: "cameras",
      name: "Security Cameras",
      icon: <Camera className="w-11 h-11" />,
      run: () => openWindow(apps[12])
    },
    {
      id: "protocols",
      name: "Emergency Protocols",
      icon: <Shield className="w-11 h-11" />,
      run: () => openWindow(apps[13])
    },
    {
      id: "map",
      name: "Facility Map",
      icon: <MapPin className="w-11 h-11" />,
      run: () => openWindow(apps[14])
    },
    {
      id: "research",
      name: "Research Notes",
      icon: <BookOpen className="w-11 h-11" />,
      run: () => openWindow(apps[15])
    },
    {
      id: "power",
      name: "Power Grid",
      icon: <Zap className="w-11 h-11" />,
      run: () => openWindow(apps[16])
    },
    {
      id: "containment",
      name: "Containment",
      icon: <Lock className="w-11 h-11" />,
      run: () => openWindow(apps[17])
    },
    {
      id: "environment",
      name: "Environment",
      icon: <Wind className="w-11 h-11" />,
      run: () => openWindow(apps[18])
    },
    {
      id: "calculator",
      name: "Calculator",
      icon: <CalcIcon className="w-11 h-11" />,
      run: () => openWindow(apps[19])
    },
    {
      id: "planner",
      name: "Facility Planner",
      icon: <Grid3x3 className="w-11 h-11" />,
      run: () => openWindow(apps[20])
    }
  ];

  const desktopApps = [apps[0], apps[1], apps[2], apps[3], apps[4], apps[5], apps[6], apps[7], apps[8], apps[9], apps[10], apps[11], apps[12], apps[13], apps[14], apps[15], apps[16], apps[17], apps[18], apps[19], apps[20]];

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Desktop Icons */}
      <div className="relative z-10 p-7 grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-4 content-start">
        {desktopApps.map(app => (
          <DesktopIcon key={app.id} app={app} onOpen={openWindow} />
        ))}
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
