import { useState, useEffect } from "react";
import { Activity, Filter } from "lucide-react";

interface LogEntry {
  time: string;
  type: "SYSTEM" | "APP" | "FILE" | "USER" | "SECURITY";
  message: string;
}

export const ActionLogger = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState<string>("ALL");

  useEffect(() => {
    // Initial logs
    const initialLogs: LogEntry[] = [
      { time: "16:32:18", type: "SYSTEM", message: "System boot successful" },
      { time: "16:32:20", type: "SYSTEM", message: "All core modules loaded" },
      { time: "16:32:22", type: "SYSTEM", message: "Network connection established" },
      { time: "16:30:15", type: "USER", message: "User 'Aswd' logged in with Level 5 clearance" },
      { time: "16:28:45", type: "APP", message: "File Explorer opened" },
      { time: "16:27:30", type: "FILE", message: "Accessed /archive/classified/specimen_z13.txt" },
      { time: "16:25:10", type: "SECURITY", message: "Security scan completed - No threats detected" },
      { time: "16:20:45", type: "SYSTEM", message: "WARNING: Pressure anomaly detected in Zone 4 - Investigating" },
      { time: "16:18:22", type: "USER", message: "User 'Dr_Chen' accessed Research Archive" },
      { time: "16:15:08", type: "APP", message: "System Monitor started" },
      { time: "16:12:55", type: "FILE", message: "File deleted: /user/temp_data.log" },
      { time: "16:10:30", type: "SECURITY", message: "Failed login attempt from terminal T-07 (Node unresponsive)" },
      { time: "16:08:15", type: "SYSTEM", message: "Automated backup completed successfully" },
      { time: "16:05:42", type: "SECURITY", message: "Containment door Z4-A sealed automatically" },
      { time: "16:03:11", type: "APP", message: "Emergency Protocol System accessed" },
      { time: "16:00:55", type: "USER", message: "User 'Tech_Morgan' logged out" },
      { time: "15:58:33", type: "SECURITY", message: "Perimeter sensors calibrated" },
      { time: "15:55:12", type: "FILE", message: "Created new file: /research/specimen_behavior_analysis.doc" },
      { time: "15:52:41", type: "APP", message: "Database Viewer query executed: SELECT * FROM specimens" },
      { time: "15:50:18", type: "SYSTEM", message: "Memory usage: 62% - Normal" },
      { time: "15:47:22", type: "USER", message: "User 'Dr_Rodriguez' accessed Medical Records" },
      { time: "15:44:09", type: "SECURITY", message: "Camera CAM-04 feed restored" },
      { time: "15:41:35", type: "FILE", message: "File modified: /system/config/pressure_thresholds.cfg" },
      { time: "15:38:47", type: "APP", message: "Power Grid Monitor: All systems nominal" },
      { time: "15:35:20", type: "SYSTEM", message: "Network bandwidth usage: 45%" },
      { time: "15:32:08", type: "USER", message: "User 'Security_045' clocked in for shift" },
      { time: "15:28:54", type: "SECURITY", message: "Zone 4 access request approved for maintenance crew" },
      { time: "15:25:30", type: "FILE", message: "Accessed /archive/incident_reports/INC-2047.txt" },
      { time: "15:22:15", type: "APP", message: "Environmental Control adjusted temperature Zone 2: 4.0°C" },
      { time: "15:18:42", type: "SYSTEM", message: "Disk space: 67% used - Normal" },
    ];
    setLogs(initialLogs);

    // Simulate new logs
    const interval = setInterval(() => {
      const messages = [
        { type: "SYSTEM", message: "System health check completed" },
        { type: "SYSTEM", message: "Automated diagnostic scan initiated" },
        { type: "SYSTEM", message: "Background process completed" },
        { type: "APP", message: "Terminal command executed" },
        { type: "APP", message: "Database query processed" },
        { type: "APP", message: "Application window minimized" },
        { type: "FILE", message: "File accessed by user" },
        { type: "FILE", message: "Temporary files cleaned" },
        { type: "FILE", message: "Log file rotated" },
        { type: "USER", message: "User activity detected" },
        { type: "USER", message: "Session keepalive ping" },
        { type: "SECURITY", message: "Security token refreshed" },
        { type: "SECURITY", message: "Access log updated" },
      ];
      
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      const newLog: LogEntry = {
        time: new Date().toLocaleTimeString('en-US', { hour12: false }),
        type: randomMessage.type as any,
        message: randomMessage.message
      };
      setLogs(prev => [newLog, ...prev].slice(0, 100));
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "SYSTEM": return "bg-primary/10 text-primary border-primary/20";
      case "APP": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "FILE": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "USER": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "SECURITY": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-white/5 text-muted-foreground border-white/10";
    }
  };

  const filteredLogs = filter === "ALL" ? logs : logs.filter(log => log.type === filter);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-white/5 bg-black/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            <h2 className="font-bold">Action Logger</h2>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Filter:</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {["ALL", "SYSTEM", "APP", "FILE", "USER", "SECURITY"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                filter === type
                  ? "bg-primary/20 text-primary border border-primary/30"
                  : "bg-white/5 text-muted-foreground hover:bg-white/10"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Log Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-sm">
        {filteredLogs.map((log, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 p-3 rounded-lg bg-black/20 border border-white/5 hover:bg-white/5 transition-colors"
          >
            <div className="text-muted-foreground text-xs min-w-[65px]">
              {log.time}
            </div>
            <div className={`px-2 py-0.5 rounded text-xs font-bold border ${getTypeColor(log.type)}`}>
              {log.type}
            </div>
            <div className="flex-1 text-xs text-foreground">
              {log.message}
            </div>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="p-4 border-t border-white/5 bg-black/20">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Total Entries:</span>
          <span className="font-mono font-bold text-primary">{logs.length}</span>
        </div>
      </div>
    </div>
  );
};
