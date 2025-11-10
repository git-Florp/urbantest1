import { Window } from "./Window";
import { App } from "./Desktop";
import { FileExplorer } from "./apps/FileExplorer";
import { SystemMonitor } from "./apps/SystemMonitor";
import { PersonnelDirectory } from "./apps/PersonnelDirectory";
import { ActionLogger } from "./apps/ActionLogger";
import { NetworkScanner } from "./apps/NetworkScanner";
import { Terminal } from "./apps/Terminal";
import { TaskManager } from "./apps/TaskManager";
import { Messages } from "./apps/Messages";
import { IncidentReports } from "./apps/IncidentReports";
import { DatabaseViewer } from "./apps/DatabaseViewer";
import { Browser } from "./apps/Browser";
import { AudioLogs } from "./apps/AudioLogs";
import { SecurityCameras } from "./apps/SecurityCameras";
import { EmergencyProtocols } from "./apps/EmergencyProtocols";
import { FacilityMap } from "./apps/FacilityMap";
import { ResearchNotes } from "./apps/ResearchNotes";
import { PowerGrid } from "./apps/PowerGrid";
import { ContainmentMonitor } from "./apps/ContainmentMonitor";
import { EnvironmentalControl } from "./apps/EnvironmentalControl";
import { Calculator } from "./apps/Calculator";
import { FacilityPlanner } from "./apps/FacilityPlanner";

interface WindowData {
  id: string;
  app: App;
  zIndex: number;
}

interface WindowManagerProps {
  windows: WindowData[];
  onClose: (id: string) => void;
  onFocus: (id: string) => void;
  allWindows: WindowData[];
  onCloseWindow: (id: string) => void;
  onCriticalKill: (processName: string, type?: "kernel" | "virus" | "bluescreen" | "memory" | "corruption" | "overload") => void;
  onOpenAdminPanel?: () => void;
  onLockdown?: (protocolName: string) => void;
}

export const WindowManager = ({ windows, onClose, onFocus, allWindows, onCloseWindow, onCriticalKill, onOpenAdminPanel, onLockdown }: WindowManagerProps) => {
  const getAppContent = (appId: string) => {
    switch (appId) {
      case "explorer":
        return <FileExplorer onVirusDetected={() => {
          setTimeout(() => {
            onCriticalKill("VIRUS_INFECTION", "virus");
          }, 3000);
        }} />;
      case "monitor":
        return <SystemMonitor />;
      case "personnel":
        return <PersonnelDirectory />;
      case "logger":
        return <ActionLogger />;
      case "network":
        return <NetworkScanner />;
      case "terminal":
        return <Terminal onCrash={(type) => onCriticalKill("terminal.exe", type)} onOpenAdminPanel={onOpenAdminPanel} />;
      case "task-manager":
        return <TaskManager windows={allWindows} onCloseWindow={onCloseWindow} onCriticalKill={onCriticalKill} />;
      case "messages":
        return <Messages />;
      case "incidents":
        return <IncidentReports />;
      case "database":
        return <DatabaseViewer />;
      case "browser":
        return <Browser />;
      case "audio-logs":
        return <AudioLogs />;
      case "cameras":
        return <SecurityCameras />;
      case "protocols":
        return <EmergencyProtocols onLockdown={onLockdown} />;
      case "map":
        return <FacilityMap />;
      case "research":
        return <ResearchNotes />;
      case "power":
        return <PowerGrid />;
      case "containment":
        return <ContainmentMonitor />;
      case "environment":
        return <EnvironmentalControl />;
      case "calculator":
        return <Calculator />;
      case "planner":
        return <FacilityPlanner />;
      default:
        return (
          <div className="p-4 text-muted-foreground">
            <p className="font-mono text-sm">
              [{appId.toUpperCase()}] Application interface loading...
            </p>
            <p className="mt-4 text-xs">
              Urbanshade OS v3.7 — Application module
            </p>
          </div>
        );
    }
  };

  return (
    <>
      {windows.map(window => (
        <Window
          key={window.id}
          title={window.app.name}
          zIndex={window.zIndex}
          onClose={() => onClose(window.id)}
          onFocus={() => onFocus(window.id)}
        >
          {getAppContent(window.app.id)}
        </Window>
      ))}
    </>
  );
};
