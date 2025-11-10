import { useState, useEffect } from "react";
import { Camera, Video, AlertTriangle } from "lucide-react";

interface CameraFeed {
  id: string;
  name: string;
  location: string;
  status: "online" | "offline" | "warning";
  description: string;
}

export const SecurityCameras = () => {
  const cameras: CameraFeed[] = [
    { id: "CAM-01", name: "Main Entrance", location: "Airlock Alpha", status: "online", description: "Clear visibility. No activity detected." },
    { id: "CAM-02", name: "Control Room", location: "Operations Center", status: "online", description: "Personnel present. All systems operational." },
    { id: "CAM-03", name: "Research Lab A", location: "Research Division", status: "online", description: "Lab equipment active. 2 personnel on duty." },
    { id: "CAM-04", name: "Containment Z-13", location: "Zone 4", status: "warning", description: "⚠️ ALERT: Subject pressing against containment glass. Unusual behavior." },
    { id: "CAM-05", name: "Server Bay", location: "Level 2", status: "online", description: "Temperature normal. No personnel present. [Feed flickers occasionally]" },
    { id: "CAM-06", name: "Corridor 7-B", location: "Zone 7", status: "online", description: "Emergency lighting active. Shadow movement detected 3 times in past hour." },
    { id: "CAM-07", name: "Terminal T-07", location: "Zone 4 Access", status: "offline", description: "⚠️ CAMERA DESTROYED - Lens shattered. Wet residue on housing." },
    { id: "CAM-08", name: "Medical Bay", location: "Medical Division", status: "online", description: "1 personnel on duty. Equipment standby mode." },
    { id: "CAM-09", name: "Engineering", location: "Engineering Deck", status: "online", description: "Active maintenance. 3 personnel present." },
  ];

  const [selectedCamera, setSelectedCamera] = useState<CameraFeed>(cameras[0]);
  const [scanLines, setScanLines] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanLines(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "text-primary";
      case "warning": return "text-yellow-500";
      case "offline": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="flex h-full">
      {/* Camera List */}
      <div className="w-72 border-r border-white/5">
        <div className="p-4 border-b border-white/5 bg-black/20">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-primary" />
            <h2 className="font-bold">Security Cameras</h2>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {cameras.filter(c => c.status === "online").length}/{cameras.length} online
          </div>
        </div>

        <div className="overflow-y-auto">
          {cameras.map((camera) => (
            <div
              key={camera.id}
              onClick={() => setSelectedCamera(camera)}
              className={`p-3 border-b border-white/5 cursor-pointer transition-colors ${
                selectedCamera.id === camera.id ? "bg-primary/20" : "hover:bg-white/5"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Video className={`w-4 h-4 ${getStatusColor(camera.status)}`} />
                <div className="font-bold text-sm">{camera.name}</div>
              </div>
              <div className="text-xs text-muted-foreground">{camera.location}</div>
              <div className={`text-xs font-bold mt-1 ${getStatusColor(camera.status)}`}>
                ● {camera.status.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Camera Feed */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-white/5 bg-black/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-bold text-lg">{selectedCamera.name}</div>
              <div className="text-sm text-muted-foreground">{selectedCamera.location}</div>
            </div>
            <div className={`flex items-center gap-2 text-sm font-bold ${getStatusColor(selectedCamera.status)}`}>
              <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
              {selectedCamera.status.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Video Feed */}
        <div className="flex-1 bg-black relative overflow-hidden">
          {selectedCamera.status === "offline" ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
                <div className="text-destructive font-bold text-lg">SIGNAL LOST</div>
                <div className="text-muted-foreground text-sm mt-2">Camera offline - maintenance required</div>
              </div>
            </div>
          ) : (
            <>
              {/* Simulated camera feed with noise */}
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent">
                {/* Grid overlay */}
                <div className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `
                      linear-gradient(0deg, transparent 24%, rgba(0, 217, 255, 0.05) 25%, rgba(0, 217, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 217, 255, 0.05) 75%, rgba(0, 217, 255, 0.05) 76%, transparent 77%, transparent),
                      linear-gradient(90deg, transparent 24%, rgba(0, 217, 255, 0.05) 25%, rgba(0, 217, 255, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 217, 255, 0.05) 75%, rgba(0, 217, 255, 0.05) 76%, transparent 77%, transparent)
                    `,
                    backgroundSize: '50px 50px'
                  }}
                />
                
                {/* Scan lines */}
                <div 
                  className="absolute inset-0 opacity-30 pointer-events-none"
                  style={{
                    background: `linear-gradient(180deg, transparent ${scanLines}%, rgba(0, 217, 255, 0.1) ${scanLines + 1}%, transparent ${scanLines + 2}%)`
                  }}
                />

                {/* Static noise */}
                <div className="absolute inset-0 opacity-5"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                  }}
                />
              </div>

              {/* Camera info overlay */}
              <div className="absolute top-4 left-4 font-mono text-xs space-y-1 text-primary">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
                  <span>REC</span>
                </div>
                <div>{selectedCamera.id}</div>
                <div>{new Date().toLocaleTimeString()}</div>
              </div>

              {selectedCamera.status === "warning" && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="text-center animate-pulse">
                    <AlertTriangle className="w-20 h-20 text-yellow-500 mx-auto mb-3" />
                    <div className="text-yellow-500 font-bold text-xl">⚠ WARNING</div>
                    <div className="text-yellow-400 mt-2">Unusual activity detected</div>
                  </div>
                </div>
              )}

              {/* Location label */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="glass-panel p-3">
                  <div className="font-bold text-sm mb-1">{selectedCamera.location}</div>
                  <div className="text-xs text-muted-foreground">{selectedCamera.description}</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
