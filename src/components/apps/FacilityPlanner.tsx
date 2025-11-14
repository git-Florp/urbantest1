import { useState, useEffect, useRef } from "react";
import { Grid3x3, Plus, Trash2, Move, Square, Save, FolderOpen, Settings, Pen, DoorOpen, Eraser } from "lucide-react";
import { toast } from "sonner";
import { saveState, loadState } from "@/lib/persistence";

interface PlannerRoom {
  id: string;
  name: string;
  type: "control" | "research" | "containment" | "storage" | "medical" | "engineering" | "corridor" | "intersection" | "custom" | "door";
  x: number;
  y: number;
  width: number;
  height: number;
  connections: string[];
  isHallway?: boolean;
  isDoor?: boolean;
  rotation?: number;
}

interface DrawingPath {
  id: string;
  points: { x: number; y: number }[];
  color: string;
  width: number;
}

interface HallwaySettings {
  autoGenerate: boolean;
  hallwayWidth: number;
}

export const FacilityPlanner = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rooms, setRooms] = useState<PlannerRoom[]>(() =>
    loadState('facility_planner_rooms', [])
  );
  const [drawings, setDrawings] = useState<DrawingPath[]>(() =>
    loadState('facility_planner_drawings', [])
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
  const [drawMode, setDrawMode] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);
  const [drawColor, setDrawColor] = useState("#00d9ff");
  const [drawWidth, setDrawWidth] = useState(3);
  const [eraserMode, setEraserMode] = useState(false);

  useEffect(() => {
    saveState('facility_planner_rooms', rooms);
  }, [rooms]);

  useEffect(() => {
    saveState('facility_planner_drawings', drawings);
  }, [drawings]);

  useEffect(() => {
    saveState('facility_planner_hallway_settings', hallwaySettings);
  }, [hallwaySettings]);

  const addRoom = (type: PlannerRoom["type"]) => {
    const isDoorType = type === "door";
    const newRoom: PlannerRoom = {
      id: `room-${Date.now()}`,
      name: isDoorType ? "Door" : `${type.charAt(0).toUpperCase() + type.slice(1)} ${rooms.length + 1}`,
      type,
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      width: isDoorType ? 40 : 120,
      height: isDoorType ? 10 : 80,
      connections: [],
      isDoor: isDoorType,
      rotation: 0
    };
    setRooms([...rooms, newRoom]);
    setSelectedRoom(newRoom);
    toast.success(`Added ${type}${isDoorType ? "" : " room"}`);
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
    if (drawMode && isDrawing) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setCurrentPath([...currentPath, { x, y }]);
    } else if (selectedRoom) {
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
    if (isDrawing && currentPath.length > 0) {
      if (eraserMode) {
        // Erase any paths that intersect with the eraser
        setDrawings(prevDrawings => 
          prevDrawings.filter(path => {
            return !path.points.some(point => 
              currentPath.some(eraserPoint => 
                Math.abs(point.x - eraserPoint.x) < 15 && Math.abs(point.y - eraserPoint.y) < 15
              )
            );
          })
        );
      } else {
        const newPath: DrawingPath = {
          id: `path-${Date.now()}`,
          points: currentPath,
          color: drawColor,
          width: drawWidth
        };
        setDrawings([...drawings, newPath]);
      }
      setCurrentPath([]);
      setIsDrawing(false);
    }
    setIsDragging(false);
    setIsResizing(false);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (drawMode) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setIsDrawing(true);
      setCurrentPath([{ x, y }]);
    }
  };

  const clearDrawings = () => {
    setDrawings([]);
    toast.success("Drawings cleared");
  };

  const exportToFacilityMap = () => {
    const facilityMapData = rooms.filter(r => !r.isHallway && !r.isDoor).map(room => ({
      id: room.id,
      name: room.name,
      type: room.type as any,
      status: "operational" as const,
      personnel: 0,
      x: room.x,
      y: room.y,
      width: room.width,
      height: room.height,
      connections: room.connections
    }));
    
    localStorage.setItem('facility_map_import', JSON.stringify(facilityMapData));
    toast.success("Design exported! Open Facility Map to import.");
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

          <div className="grid grid-cols-2 gap-2 mb-4">
            <button onClick={saveDesign} className="px-3 py-2 rounded-lg bg-primary/20 border border-primary/30 hover:bg-primary/30 transition-colors text-xs flex items-center justify-center gap-2">
              <Save className="w-4 h-4" />Save
            </button>
            <button onClick={loadDesign} className="px-3 py-2 rounded-lg bg-primary/20 border border-primary/30 hover:bg-primary/30 transition-colors text-xs flex items-center justify-center gap-2">
              <FolderOpen className="w-4 h-4" />Load
            </button>
            <button onClick={exportToFacilityMap} className="col-span-2 px-3 py-2 rounded-lg bg-green-500/20 border border-green-500/30 hover:bg-green-500/30 transition-colors text-xs flex items-center gap-2">
              <Grid3x3 className="w-4 h-4" />Export to Facility Map
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
          <div className="text-xs text-muted-foreground font-bold mb-2">DRAWING TOOLS</div>
          
          <button onClick={() => { setDrawMode(!drawMode); setConnectMode(false); setEraserMode(false); }} className={`w-full px-3 py-2 rounded-lg mb-2 ${drawMode && !eraserMode ? "bg-primary/30 border-primary" : "bg-white/10"} border transition-all text-xs flex items-center gap-2`}>
            <Pen className="w-4 h-4" />{drawMode && !eraserMode ? "Drawing..." : "Draw"}
          </button>

          <button onClick={() => { setEraserMode(!eraserMode); setDrawMode(eraserMode ? false : true); setConnectMode(false); }} className={`w-full px-3 py-2 rounded-lg mb-2 ${eraserMode ? "bg-destructive/30 border-destructive" : "bg-white/10"} border transition-all text-xs flex items-center gap-2`}>
            <Eraser className="w-4 h-4" />{eraserMode ? "Erasing..." : "Eraser"}
          </button>

          {drawMode && (
            <div className="glass-panel p-3 mb-4 space-y-2">
              <div className="text-xs text-primary font-bold">COLOR & WIDTH</div>
              <input type="color" value={drawColor} onChange={(e) => setDrawColor(e.target.value)} className="w-full h-8 rounded cursor-pointer" />
              <div className="flex items-center gap-2">
                <input type="range" min="1" max="10" value={drawWidth} onChange={(e) => setDrawWidth(parseInt(e.target.value))} className="flex-1" />
                <span className="text-xs">{drawWidth}px</span>
              </div>
              <button onClick={clearDrawings} className="w-full px-2 py-1 rounded bg-destructive/20 border border-destructive/30 hover:bg-destructive/30 text-xs">Clear Drawings</button>
            </div>
          )}

          <div className="text-xs text-muted-foreground font-bold mb-2">ROOM TOOLS</div>
          
          {[
            { type: "control" as const, label: "Control Room" },
            { type: "research" as const, label: "Research Lab" },
            { type: "containment" as const, label: "Containment" },
            { type: "storage" as const, label: "Storage" },
            { type: "medical" as const, label: "Medical Bay" },
            { type: "engineering" as const, label: "Engineering" },
            { type: "corridor" as const, label: "Corridor" },
            { type: "intersection" as const, label: "Intersection" },
            { type: "custom" as const, label: "Custom Room" },
            { type: "door" as const, label: "Door" }
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
        onMouseDown={handleCanvasMouseDown}
        onClick={() => !isDragging && !isResizing && !drawMode && setSelectedRoom(null)}
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
              {/* Drawings */}
              {drawings.map(path => (
                <polyline
                  key={path.id}
                  points={path.points.map(p => `${p.x},${p.y}`).join(' ')}
                  stroke={path.color}
                  strokeWidth={path.width}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ))}
              {/* Current drawing */}
              {currentPath.length > 0 && (
                <polyline
                  points={currentPath.map(p => `${p.x},${p.y}`).join(' ')}
                  stroke={eraserMode ? "#ff0000" : drawColor}
                  strokeWidth={eraserMode ? drawWidth * 2 : drawWidth}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={eraserMode ? "0.5" : "1"}
                />
              )}
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
