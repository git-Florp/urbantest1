import { useState, useEffect } from "react";
import { Grid3x3, Plus, Trash2, Move, Square, Save, FolderOpen, Settings } from "lucide-react";
import { toast } from "sonner";
import { saveState, loadState } from "@/lib/persistence";

interface PlannerRoom {
  id: string;
  name: string;
  type: "control" | "research" | "containment" | "storage" | "medical" | "engineering" | "corridor" | "intersection" | "custom";
  x: number;
  y: number;
  width: number;
  height: number;
  connections: string[];
  isHallway?: boolean;
}

interface HallwaySettings {
  autoGenerate: boolean;
  hallwayWidth: number;
}

export const FacilityPlanner = () => {
  const [rooms, setRooms] = useState<PlannerRoom[]>(() =>
    loadState('facility_planner_rooms', [])
  );
  const [selectedRoom, setSelectedRoom] = useState<PlannerRoom | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [connectMode, setConnectMode] = useState(false);
  const [connectFrom, setConnectFrom] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [hallwaySettings, setHallwaySettings] = useState<HallwaySettings>(() =>
    loadState('facility_planner_hallway_settings', { autoGenerate: true, hallwayWidth: 40 })
  );

  useEffect(() => {
    saveState('facility_planner_rooms', rooms);
  }, [rooms]);

  useEffect(() => {
    saveState('facility_planner_hallway_settings', hallwaySettings);
  }, [hallwaySettings]);

  const addRoom = (type: PlannerRoom["type"]) => {
    const newRoom: PlannerRoom = {
      id: `room-${Date.now()}`,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${rooms.length + 1}`,
      type,
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      width: 120,
      height: 80,
      connections: []
    };
    setRooms([...rooms, newRoom]);
    setSelectedRoom(newRoom);
    toast.success(`Added ${type} room`);
  };

  const deleteRoom = (id: string) => {
    setRooms(rooms.filter(r => r.id !== id));
    if (selectedRoom?.id === id) setSelectedRoom(null);
    toast.success("Room deleted");
  };

  const updateRoom = (id: string, updates: Partial<PlannerRoom>) => {
    setRooms(rooms.map(r => r.id === id ? { ...r, ...updates } : r));
    if (selectedRoom?.id === id) {
      setSelectedRoom({ ...selectedRoom, ...updates });
    }
  };

  const handleMouseDown = (room: PlannerRoom, e: React.MouseEvent, isResize?: boolean) => {
    e.stopPropagation();
    setSelectedRoom(room);
    
    if (isResize) {
      setIsResizing(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    } else {
      setIsDragging(true);
      setDragStart({ x: e.clientX - room.x, y: e.clientY - room.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (selectedRoom) {
      if (isDragging) {
        updateRoom(selectedRoom.id, {
          x: Math.max(0, e.clientX - dragStart.x),
          y: Math.max(0, e.clientY - dragStart.y)
        });
      } else if (isResizing) {
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;
        updateRoom(selectedRoom.id, {
          width: Math.max(80, selectedRoom.width + deltaX),
          height: Math.max(60, selectedRoom.height + deltaY)
        });
        setDragStart({ x: e.clientX, y: e.clientY });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  const generateHallway = (room1: PlannerRoom, room2: PlannerRoom) => {
    const hallways: PlannerRoom[] = [];
    const width = hallwaySettings.hallwayWidth;
    
    const x1 = room1.x + room1.width / 2;
    const y1 = room1.y + room1.height / 2;
    const x2 = room2.x + room2.width / 2;
    const y2 = room2.y + room2.height / 2;
    
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    
    // Horizontal hallway from room1
    hallways.push({
      id: `hallway-${Date.now()}-h1`,
      name: "",
      type: "corridor",
      x: Math.min(x1, midX) - width / 2,
      y: y1 - width / 2,
      width: Math.abs(x1 - midX),
      height: width,
      connections: [],
      isHallway: true
    });
    
    // Vertical hallway
    hallways.push({
      id: `hallway-${Date.now()}-v`,
      name: "",
      type: "corridor",
      x: midX - width / 2,
      y: Math.min(y1, y2) - width / 2,
      width: width,
      height: Math.abs(y1 - y2),
      connections: [],
      isHallway: true
    });
    
    // Horizontal hallway to room2
    hallways.push({
      id: `hallway-${Date.now()}-h2`,
      name: "",
      type: "corridor",
      x: Math.min(midX, x2) - width / 2,
      y: y2 - width / 2,
      width: Math.abs(midX - x2),
      height: width,
      connections: [],
      isHallway: true
    });
    
    // Intersection
    hallways.push({
      id: `intersection-${Date.now()}`,
      name: "Intersection",
      type: "intersection",
      x: midX - width / 2,
      y: y1 - width / 2,
      width: width,
      height: width,
      connections: [],
      isHallway: true
    });
    
    return hallways;
  };

  const handleConnect = (roomId: string) => {
    if (!connectFrom) {
      setConnectFrom(roomId);
      toast.info("Select second room to connect");
    } else {
      if (connectFrom !== roomId) {
        const room1 = rooms.find(r => r.id === connectFrom);
        const room2 = rooms.find(r => r.id === roomId);
        
        if (room1 && room2) {
          let newRooms = [...rooms];
          
          // Generate hallways if auto-generate is enabled
          if (hallwaySettings.autoGenerate) {
            const hallways = generateHallway(room1, room2);
            newRooms = [...newRooms, ...hallways];
          }
          
          // Update connections
          const updatedRooms = newRooms.map(r => {
            if (r.id === connectFrom) {
              return { ...r, connections: [...r.connections, roomId] };
            }
            if (r.id === roomId) {
              return { ...r, connections: [...r.connections, connectFrom] };
            }
            return r;
          });
          
          setRooms(updatedRooms);
          toast.success(hallwaySettings.autoGenerate ? "Rooms connected with hallways" : "Rooms connected");
        }
      }
      setConnectFrom(null);
      setConnectMode(false);
    }
  };

  const saveDesign = () => {
    const designName = prompt("Enter design name:", `Design ${Date.now()}`);
    if (designName) {
      const designs = loadState('facility_designs', {});
      designs[designName] = rooms;
      saveState('facility_designs', designs);
      toast.success(`Design "${designName}" saved`);
    }
  };

  const loadDesign = () => {
    const designs = loadState('facility_designs', {});
    const designNames = Object.keys(designs);
    if (designNames.length === 0) {
      toast.error("No saved designs found");
      return;
    }
    
    const designName = prompt(`Load design:\n${designNames.join('\n')}`);
    if (designName && designs[designName]) {
      setRooms(designs[designName]);
      toast.success(`Design "${designName}" loaded`);
    }
  };

  const getRoomColor = (type: string, isHallway?: boolean) => {
    if (isHallway && type === "corridor") {
      return "bg-muted/50 border-muted-foreground/30";
    }
    if (isHallway && type === "intersection") {
      return "bg-muted/70 border-muted-foreground/50";
    }
    switch (type) {
      case "control": return "bg-blue-500/30 border-blue-500";
      case "research": return "bg-purple-500/30 border-purple-500";
      case "containment": return "bg-red-500/30 border-red-500";
      case "storage": return "bg-muted/30 border-muted-foreground";
      case "medical": return "bg-green-500/30 border-green-500";
      case "engineering": return "bg-yellow-500/30 border-yellow-500";
      case "corridor": return "bg-cyan-500/30 border-cyan-500";
      default: return "bg-primary/30 border-primary";
    }
  };

  const renderConnections = () => {
    const lines: JSX.Element[] = [];
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

            lines.push(
              <line
                key={key}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(0, 217, 255, 0.3)"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            );
          }
        }
      });
    });

    return lines;
  };

  return (
    <div className="flex h-full">
      {/* Toolbar */}
      <div className="w-64 border-r border-white/5 flex flex-col">
        <div className="p-4 border-b border-white/5 bg-black/20">
          <div className="flex items-center gap-2 mb-4">
            <Grid3x3 className="w-5 h-5 text-primary" />
            <h2 className="font-bold">Facility Planner</h2>
          </div>

          <div className="flex gap-2 mb-4">
            <button
              onClick={saveDesign}
              className="flex-1 px-3 py-2 rounded-lg bg-primary/20 border border-primary/30 hover:bg-primary/30 transition-colors text-xs flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={loadDesign}
              className="flex-1 px-3 py-2 rounded-lg bg-primary/20 border border-primary/30 hover:bg-primary/30 transition-colors text-xs flex items-center justify-center gap-2"
            >
              <FolderOpen className="w-4 h-4" />
              Load
            </button>
          </div>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="w-full px-3 py-2 rounded-lg bg-muted/20 border border-border hover:bg-muted/30 transition-colors text-xs flex items-center justify-center gap-2 mb-4"
          >
            <Settings className="w-4 h-4" />
            Hallway Settings
          </button>

          {showSettings && (
            <div className="glass-panel p-3 mb-4 space-y-3">
              <div className="text-xs font-bold text-primary mb-2">HALLWAY OPTIONS</div>
              
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <input
                  type="checkbox"
                  checked={hallwaySettings.autoGenerate}
                  onChange={(e) => setHallwaySettings({ ...hallwaySettings, autoGenerate: e.target.checked })}
                  className="w-4 h-4"
                />
                <span>Auto-generate hallways</span>
              </label>

              <div>
                <label className="text-xs text-muted-foreground">Hallway Width</label>
                <input
                  type="range"
                  min="20"
                  max="80"
                  value={hallwaySettings.hallwayWidth}
                  onChange={(e) => setHallwaySettings({ ...hallwaySettings, hallwayWidth: parseInt(e.target.value) })}
                  className="w-full mt-1"
                />
                <div className="text-xs text-muted-foreground mt-1">{hallwaySettings.hallwayWidth}px</div>
              </div>

              <div className="text-xs text-muted-foreground pt-2 border-t border-white/10">
                {hallwaySettings.autoGenerate 
                  ? "Hallways will be created automatically when connecting rooms" 
                  : "Place hallways manually using the corridor tool"}
              </div>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="text-xs text-muted-foreground font-bold mb-2">ADD ROOM</div>
          
          {[
            { type: "control" as const, label: "Control Room" },
            { type: "research" as const, label: "Research Lab" },
            { type: "containment" as const, label: "Containment" },
            { type: "storage" as const, label: "Storage" },
            { type: "medical" as const, label: "Medical Bay" },
            { type: "engineering" as const, label: "Engineering" },
            { type: "corridor" as const, label: "Corridor" },
            { type: "intersection" as const, label: "Intersection" },
            { type: "custom" as const, label: "Custom Room" }
          ].map(({ type, label }) => (
            <button
              key={type}
              onClick={() => addRoom(type)}
              className={`w-full px-3 py-2 rounded-lg ${getRoomColor(type)} hover:brightness-125 transition-all text-xs flex items-center gap-2`}
            >
              <Plus className="w-4 h-4" />
              {label}
            </button>
          ))}

          <div className="text-xs text-muted-foreground font-bold mt-6 mb-2">TOOLS</div>
          
          <button
            onClick={() => {
              setConnectMode(!connectMode);
              setConnectFrom(null);
            }}
            className={`w-full px-3 py-2 rounded-lg ${
              connectMode ? "bg-primary/30 border-primary" : "bg-white/10"
            } border transition-all text-xs flex items-center gap-2`}
          >
            <Move className="w-4 h-4" />
            {connectMode ? "Connecting..." : "Connect Rooms"}
          </button>

          {selectedRoom && (
            <>
              <div className="text-xs text-muted-foreground font-bold mt-6 mb-2">SELECTED ROOM</div>
              
              <div className="glass-panel p-3 space-y-2">
                <div>
                  <label className="text-xs text-muted-foreground">Name</label>
                  <input
                    type="text"
                    value={selectedRoom.name}
                    onChange={(e) => updateRoom(selectedRoom.id, { name: e.target.value })}
                    className="w-full px-2 py-1 mt-1 rounded bg-black/50 border border-white/10 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-muted-foreground">Width</label>
                    <input
                      type="number"
                      value={selectedRoom.width}
                      onChange={(e) => updateRoom(selectedRoom.id, { width: Math.max(80, parseInt(e.target.value) || 120) })}
                      className="w-full px-2 py-1 mt-1 rounded bg-black/50 border border-white/10 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Height</label>
                    <input
                      type="number"
                      value={selectedRoom.height}
                      onChange={(e) => updateRoom(selectedRoom.id, { height: Math.max(60, parseInt(e.target.value) || 80) })}
                      className="w-full px-2 py-1 mt-1 rounded bg-black/50 border border-white/10 text-xs"
                    />
                  </div>
                </div>

                <button
                  onClick={() => deleteRoom(selectedRoom.id)}
                  className="w-full px-3 py-2 rounded-lg bg-destructive/20 border border-destructive/30 hover:bg-destructive/30 transition-colors text-xs flex items-center justify-center gap-2 text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Room
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Canvas */}
      <div 
        className="flex-1 relative overflow-auto bg-black/40"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={() => !isDragging && !isResizing && setSelectedRoom(null)}
      >
        <div className="p-4">
          <div className="relative bg-black/60 rounded-lg border border-white/10 p-4" style={{ minHeight: "800px", minWidth: "1000px" }}>
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
                onClick={(e) => {
                  e.stopPropagation();
                  if (connectMode) {
                    handleConnect(room.id);
                  } else {
                    setSelectedRoom(room);
                  }
                }}
                onMouseDown={(e) => !connectMode && handleMouseDown(room, e)}
                className={`absolute cursor-move transition-all ${getRoomColor(room.type, room.isHallway)} ${
                  selectedRoom?.id === room.id ? "ring-2 ring-primary shadow-lg shadow-primary/50" : ""
                } ${
                  connectFrom === room.id ? "ring-2 ring-yellow-500 animate-pulse" : ""
                } ${room.isHallway ? "rounded-sm border" : "rounded border-2 p-2"} hover:brightness-125`}
                style={{
                  left: `${room.x}px`,
                  top: `${room.y}px`,
                  width: `${room.width}px`,
                  height: `${room.height}px`,
                }}
              >
                {!room.isHallway && (
                  <div className="flex flex-col h-full justify-between pointer-events-none">
                    <div className="text-xs font-bold leading-tight">{room.name}</div>
                    <div className="text-xs opacity-60">{room.type}</div>
                  </div>
                )}
                
                {room.isHallway && room.type === "intersection" && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-xs font-bold opacity-70">+</div>
                  </div>
                )}

                {/* Resize handle */}
                {selectedRoom?.id === room.id && !connectMode && (
                  <div
                    onMouseDown={(e) => handleMouseDown(room, e, true)}
                    className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize pointer-events-auto group"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Square className="w-3 h-3 text-primary group-hover:text-primary/80" />
                  </div>
                )}
              </div>
            ))}

            {rooms.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
                <div className="text-center">
                  <Grid3x3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <div>Click a room type on the left to start designing</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
