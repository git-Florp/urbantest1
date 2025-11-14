import { useState, useEffect } from "react";
import { MapPin, AlertTriangle, CheckCircle, XCircle, Users, Activity } from "lucide-react";
import { toast } from "sonner";

interface Room {
  id: string;
  name: string;
  type: "control" | "research" | "containment" | "storage" | "medical" | "engineering" | "corridor";
  status: "operational" | "warning" | "critical" | "offline";
  personnel: number;
  x: number;
  y: number;
  width: number;
  height: number;
  connections: string[];
}

export const FacilityMap = () => {
  const [rooms, setRooms] = useState<Room[]>(() => {
    const importedData = localStorage.getItem('facility_map_import');
    if (importedData) {
      localStorage.removeItem('facility_map_import');
      toast.success("Design imported from Facility Planner!");
      return JSON.parse(importedData);
    }
    return [
    // Top row - Level 1
    { id: "control", name: "Control Room", type: "control", status: "operational", personnel: 3, x: 350, y: 50, width: 120, height: 80, connections: ["corridor-1", "server"] },
    { id: "server", name: "Server Bay", type: "storage", status: "operational", personnel: 0, x: 550, y: 50, width: 100, height: 80, connections: ["control", "corridor-2"] },
    
    // Corridors - connecting sections
    { id: "corridor-1", name: "Corridor A", type: "corridor", status: "operational", personnel: 0, x: 250, y: 150, width: 300, height: 40, connections: ["control", "corridor-3", "research-a"] },
    { id: "corridor-2", name: "Corridor B", type: "corridor", status: "operational", personnel: 0, x: 550, y: 150, width: 150, height: 40, connections: ["server", "medical", "corridor-3"] },
    { id: "corridor-3", name: "Main Corridor", type: "corridor", status: "operational", personnel: 1, x: 100, y: 250, width: 600, height: 40, connections: ["corridor-1", "corridor-2", "research-a", "research-b", "containment", "engineering"] },
    
    // Middle row - Level 2
    { id: "research-a", name: "Research Lab A", type: "research", status: "operational", personnel: 2, x: 100, y: 350, width: 150, height: 100, connections: ["corridor-1", "corridor-3", "corridor-4"] },
    { id: "research-b", name: "Research Lab B", type: "research", status: "warning", personnel: 1, x: 300, y: 350, width: 150, height: 100, connections: ["corridor-3", "containment", "corridor-4"] },
    { id: "containment", name: "Containment Zone", type: "containment", status: "critical", personnel: 4, x: 500, y: 350, width: 200, height: 100, connections: ["corridor-3", "research-b", "storage"] },
    
    // Bottom row - Level 3
    { id: "corridor-4", name: "Corridor C", type: "corridor", status: "operational", personnel: 0, x: 100, y: 500, width: 400, height: 40, connections: ["research-a", "research-b", "medical", "engineering"] },
    { id: "medical", name: "Medical Bay", type: "medical", status: "operational", personnel: 1, x: 550, y: 500, width: 150, height: 80, connections: ["corridor-2", "corridor-4"] },
    
    // Lower level
    { id: "engineering", name: "Engineering Deck", type: "engineering", status: "operational", personnel: 3, x: 100, y: 600, width: 180, height: 100, connections: ["corridor-3", "corridor-4", "storage"] },
    { id: "storage", name: "Storage Facility", type: "storage", status: "offline", personnel: 0, x: 350, y: 600, width: 350, height: 100, connections: ["containment", "engineering"] },
  ];
  });

  const [selectedRoom, setSelectedRoom] = useState<Room>(rooms[0]);
  const [entityEscaped, setEntityEscaped] = useState(false);
  const [entityPosition, setEntityPosition] = useState({ x: 0, y: 0 });

  // Rare entity escape event
  useEffect(() => {
    const checkForEscape = () => {
      // 1% chance every 5 minutes
      if (Math.random() < 0.01) {
        setEntityEscaped(true);
        // Random position in containment zone area
        setEntityPosition({
          x: 550 + Math.random() * 100,
          y: 380 + Math.random() * 50
        });
        
        // Update containment zone to critical
        setRooms(prev => prev.map(r => 
          r.id === "containment" ? { ...r, status: "critical" } : r
        ));
      }
    };

    const interval = setInterval(checkForEscape, 300000); // Every 5 minutes
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational": return "bg-primary/30 border-primary";
      case "warning": return "bg-yellow-500/30 border-yellow-500";
      case "critical": return "bg-destructive/30 border-destructive";
      case "offline": return "bg-muted/30 border-muted-foreground";
      default: return "bg-muted/30 border-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational": return <CheckCircle className="w-4 h-4 text-primary" />;
      case "warning": return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "critical": return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case "offline": return <XCircle className="w-4 h-4 text-muted-foreground" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getRoomTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      control: "Control Center",
      research: "Research Lab",
      containment: "Containment",
      storage: "Storage",
      medical: "Medical",
      engineering: "Engineering",
      corridor: "Access Corridor"
    };
    return labels[type] || type;
  };

  // Draw connections between rooms
  const renderConnections = () => {
    const connections: JSX.Element[] = [];
    const processed = new Set<string>();

    rooms.forEach(room => {
      room.connections.forEach(connId => {
        const connRoom = rooms.find(r => r.id === connId);
        if (connRoom) {
          const key = [room.id, connRoom.id].sort().join("-");
          if (!processed.has(key)) {
            processed.add(key);
            
            const x1 = room.x + room.width / 2;
            const y1 = room.y + room.height / 2;
            const x2 = connRoom.x + connRoom.width / 2;
            const y2 = connRoom.y + connRoom.height / 2;

            connections.push(
              <line
                key={key}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(0, 217, 255, 0.2)"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            );
          }
        }
      });
    });

    return connections;
  };

  return (
    <div className="flex h-full">
      {/* Map View */}
      <div className="flex-1 relative overflow-auto bg-black/40">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-primary" />
            <h2 className="font-bold">FACILITY SCHEMATIC</h2>
            <span className="text-xs text-muted-foreground ml-auto">Depth: 8,247m</span>
          </div>

          {/* Map Canvas */}
          <div className="relative bg-black/60 rounded-lg border border-white/10 p-4" style={{ minHeight: "750px", minWidth: "800px" }}>
            {/* Grid background */}
            <div 
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: `
                  linear-gradient(0deg, transparent 24%, rgba(0, 217, 255, 0.1) 25%, rgba(0, 217, 255, 0.1) 26%, transparent 27%, transparent 74%, rgba(0, 217, 255, 0.1) 75%, rgba(0, 217, 255, 0.1) 76%, transparent 77%, transparent),
                  linear-gradient(90deg, transparent 24%, rgba(0, 217, 255, 0.1) 25%, rgba(0, 217, 255, 0.1) 26%, transparent 27%, transparent 74%, rgba(0, 217, 255, 0.1) 75%, rgba(0, 217, 255, 0.1) 76%, transparent 77%, transparent)
                `,
                backgroundSize: '50px 50px'
              }}
            />

            {/* Connection lines */}
            <svg className="absolute inset-0 pointer-events-none" style={{ width: "100%", height: "100%" }}>
              {renderConnections()}
            </svg>

            {/* Rooms */}
            {rooms.map((room) => (
              <div
                key={room.id}
                onClick={() => setSelectedRoom(room)}
                className={`absolute cursor-pointer transition-all ${getStatusColor(room.status)} ${
                  selectedRoom.id === room.id ? "ring-2 ring-primary shadow-lg shadow-primary/50" : ""
                } rounded border-2 p-2 hover:brightness-125`}
                style={{
                  left: `${room.x}px`,
                  top: `${room.y}px`,
                  width: `${room.width}px`,
                  height: `${room.height}px`,
                }}
              >
                <div className="flex flex-col h-full justify-between">
                  <div className="flex items-start justify-between gap-1">
                    {getStatusIcon(room.status)}
                    {room.personnel > 0 && (
                      <div className="flex items-center gap-1 text-xs">
                        <Users className="w-3 h-3" />
                        <span>{room.personnel}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-xs font-bold leading-tight">{room.name}</div>
                </div>
              </div>
            ))}

            {/* Entity indicator */}
            {entityEscaped && (
              <div
                className="absolute w-8 h-8 bg-destructive rounded-full animate-pulse flex items-center justify-center text-2xl"
                style={{
                  left: `${entityPosition.x}px`,
                  top: `${entityPosition.y}px`,
                  filter: "drop-shadow(0 0 10px rgba(239, 68, 68, 0.8))"
                }}
                title="ENTITY DETECTED"
              >
                👁️
              </div>
            )}

            {/* Legend */}
            <div className="absolute bottom-4 left-4 glass-panel p-3 text-xs space-y-1">
              <div className="font-bold mb-2">LEGEND</div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-primary/30 border border-primary rounded" />
                <span>Operational</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500/30 border border-yellow-500 rounded" />
                <span>Warning</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-destructive/30 border border-destructive rounded" />
                <span>Critical</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-muted/30 border border-muted-foreground rounded" />
                <span>Offline</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Room Details Panel */}
      <div className="w-80 border-l border-white/5 flex flex-col">
        <div className="p-4 border-b border-white/5 bg-black/20">
          <div className="flex items-center gap-2 mb-2">
            {getStatusIcon(selectedRoom.status)}
            <h3 className="font-bold">{selectedRoom.name}</h3>
          </div>
          <div className="text-xs text-muted-foreground">{getRoomTypeLabel(selectedRoom.type)}</div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Status */}
          <div className="glass-panel p-3">
            <div className="text-xs text-muted-foreground mb-2">STATUS</div>
            <div className={`font-bold uppercase ${
              selectedRoom.status === "operational" ? "text-primary" :
              selectedRoom.status === "warning" ? "text-yellow-500" :
              selectedRoom.status === "critical" ? "text-destructive" :
              "text-muted-foreground"
            }`}>
              {selectedRoom.status}
            </div>
          </div>

          {/* Personnel */}
          <div className="glass-panel p-3">
            <div className="text-xs text-muted-foreground mb-2">PERSONNEL</div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="font-bold">{selectedRoom.personnel} active</span>
            </div>
          </div>

          {/* Connected Rooms */}
          <div className="glass-panel p-3">
            <div className="text-xs text-muted-foreground mb-2">CONNECTED AREAS</div>
            <div className="space-y-1">
              {selectedRoom.connections.map(connId => {
                const connRoom = rooms.find(r => r.id === connId);
                return connRoom ? (
                  <div 
                    key={connId}
                    onClick={() => setSelectedRoom(connRoom)}
                    className="text-xs p-2 bg-white/5 rounded hover:bg-primary/20 cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <span>{connRoom.name}</span>
                    {getStatusIcon(connRoom.status)}
                  </div>
                ) : null;
              })}
            </div>
          </div>

          {/* Room-specific info */}
          {selectedRoom.status === "critical" && (
            <div className="glass-panel p-3 border-destructive/30">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-bold text-destructive mb-1">CRITICAL ALERT</div>
                  <div className="text-muted-foreground">
                    {selectedRoom.type === "containment" 
                      ? "Containment breach detected. Z-13 specimen showing unusual behavior. Armed response team deployed."
                      : "System malfunction detected. Immediate maintenance required."}
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedRoom.status === "warning" && (
            <div className="glass-panel p-3 border-yellow-500/30">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-bold text-yellow-500 mb-1">WARNING</div>
                  <div className="text-muted-foreground">
                    Minor system anomalies detected. Monitoring situation.
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedRoom.status === "offline" && (
            <div className="glass-panel p-3 border-muted-foreground/30">
              <div className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-bold text-muted-foreground mb-1">OFFLINE</div>
                  <div className="text-muted-foreground">
                    Systems powered down. Area temporarily inaccessible.
                  </div>
                </div>
              </div>
            </div>
          )}

          {entityEscaped && (
            <div className="glass-panel p-3 border-destructive/30 bg-destructive/10 animate-pulse">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                <div className="text-xs">
                  <div className="font-bold text-destructive mb-1">🚨 ENTITY BREACH DETECTED</div>
                  <div className="text-destructive">
                    Z-13 has escaped containment! Activate CODE-BLACK lockdown immediately to recapture.
                  </div>
                  <div className="text-muted-foreground mt-2">
                    Location: Containment Zone (moving)
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
