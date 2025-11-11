import { Play, Pause, SkipForward, SkipBack, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const PLAYLIST = [
  { id: 1, title: "Facility Ambient 01", artist: "System Audio", duration: "3:24" },
  { id: 2, title: "Deep Sea Echoes", artist: "Environmental", duration: "4:12" },
  { id: 3, title: "Containment Breach Alert", artist: "Security", duration: "2:45" },
  { id: 4, title: "Research Lab Background", artist: "Ambient", duration: "5:33" },
];

export const MusicPlayer = () => {
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-1 p-6 flex flex-col items-center justify-center">
        <div className="w-48 h-48 bg-accent rounded-lg mb-6 flex items-center justify-center">
          <Volume2 className="w-20 h-20 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-bold mb-2">Facility Ambient 01</h2>
        <p className="text-muted-foreground mb-6">System Audio</p>
        
        <div className="w-full max-w-md mb-6">
          <Slider defaultValue={[33]} max={100} step={1} />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>1:24</span>
            <span>3:24</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button size="icon" variant="outline">
            <SkipBack className="w-4 h-4" />
          </Button>
          <Button size="icon" className="w-12 h-12">
            <Play className="w-6 h-6" />
          </Button>
          <Button size="icon" variant="outline">
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="border-t border-border p-4 max-h-48 overflow-auto">
        <div className="space-y-2">
          {PLAYLIST.map(track => (
            <div key={track.id} className="flex items-center justify-between p-2 hover:bg-accent rounded cursor-pointer">
              <div>
                <p className="font-medium text-sm">{track.title}</p>
                <p className="text-xs text-muted-foreground">{track.artist}</p>
              </div>
              <span className="text-xs text-muted-foreground">{track.duration}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
