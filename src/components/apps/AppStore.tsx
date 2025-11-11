import { useState, useEffect } from "react";
import { Download, Check, Search, Package, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface StoreApp {
  id: string;
  name: string;
  category: string;
  description: string;
  version: string;
  size: string;
  rating: number;
}

const AVAILABLE_APPS: StoreApp[] = [
  { id: "notepad", name: "Notepad", category: "Productivity", description: "Simple text editor for quick notes", version: "2.1.0", size: "1.2 MB", rating: 4.5 },
  { id: "paint", name: "Paint Tool", category: "Graphics", description: "Basic image editing and drawing", version: "3.0.1", size: "2.8 MB", rating: 4.2 },
  { id: "music-player", name: "Media Player", category: "Entertainment", description: "Audio and video playback", version: "5.2.0", size: "8.4 MB", rating: 4.7 },
  { id: "weather", name: "Weather Monitor", category: "Utilities", description: "Local weather tracking system", version: "1.8.3", size: "3.1 MB", rating: 4.3 },
  { id: "clock", name: "World Clock", category: "Utilities", description: "Time zones and alarms", version: "2.5.0", size: "1.5 MB", rating: 4.4 },
  { id: "calendar", name: "Event Calendar", category: "Productivity", description: "Schedule and event management", version: "4.1.2", size: "4.7 MB", rating: 4.6 },
  { id: "notes", name: "Advanced Notes", category: "Productivity", description: "Rich text note-taking app", version: "3.3.0", size: "5.2 MB", rating: 4.8 },
  { id: "vpn", name: "Secure VPN", category: "Security", description: "Encrypted network tunneling", version: "2.0.4", size: "6.3 MB", rating: 4.5 },
  { id: "firewall", name: "Network Firewall", category: "Security", description: "Advanced packet filtering", version: "7.1.0", size: "12.5 MB", rating: 4.7 },
  { id: "antivirus", name: "Virus Scanner", category: "Security", description: "Real-time threat detection", version: "9.2.1", size: "45.8 MB", rating: 4.9 },
  { id: "backup", name: "Data Backup", category: "Utilities", description: "Automated backup system", version: "3.4.0", size: "7.9 MB", rating: 4.6 },
  { id: "compression", name: "File Compressor", category: "Utilities", description: "Archive and compress files", version: "4.0.2", size: "2.3 MB", rating: 4.4 },
  { id: "pdf-reader", name: "PDF Viewer", category: "Productivity", description: "Read and annotate PDFs", version: "6.1.0", size: "8.7 MB", rating: 4.5 },
  { id: "spreadsheet", name: "Data Sheets", category: "Productivity", description: "Spreadsheet calculations", version: "5.3.1", size: "15.2 MB", rating: 4.7 },
  { id: "presentation", name: "Slide Maker", category: "Productivity", description: "Create presentations", version: "4.2.0", size: "11.4 MB", rating: 4.3 },
  { id: "video-editor", name: "Video Editor", category: "Graphics", description: "Edit and cut video files", version: "8.0.3", size: "78.5 MB", rating: 4.8 },
  { id: "image-viewer", name: "Photo Gallery", category: "Graphics", description: "View and organize images", version: "3.1.5", size: "4.8 MB", rating: 4.4 },
  { id: "audio-editor", name: "Sound Editor", category: "Entertainment", description: "Record and edit audio", version: "6.2.1", size: "23.4 MB", rating: 4.6 },
  { id: "game-center", name: "Game Hub", category: "Entertainment", description: "Mini games collection", version: "2.0.0", size: "34.2 MB", rating: 4.5 },
  { id: "chat", name: "Instant Chat", category: "Communication", description: "Real-time messaging", version: "7.4.2", size: "9.8 MB", rating: 4.7 },
  { id: "video-call", name: "Video Conference", category: "Communication", description: "Video calls and meetings", version: "5.1.0", size: "18.6 MB", rating: 4.6 },
  { id: "email-client", name: "Mail Client Pro", category: "Communication", description: "Advanced email management", version: "8.3.1", size: "14.3 MB", rating: 4.5 },
  { id: "ftp", name: "FTP Manager", category: "Network", description: "File transfer protocol client", version: "3.8.0", size: "5.7 MB", rating: 4.3 },
  { id: "ssh", name: "SSH Terminal", category: "Network", description: "Secure shell connections", version: "4.5.2", size: "6.4 MB", rating: 4.8 },
  { id: "packet-analyzer", name: "Packet Sniffer", category: "Network", description: "Network traffic analysis", version: "5.2.0", size: "11.2 MB", rating: 4.7 },
  { id: "disk-manager", name: "Disk Utility", category: "System", description: "Drive management tools", version: "6.0.1", size: "8.9 MB", rating: 4.5 },
  { id: "registry", name: "Registry Editor", category: "System", description: "System registry management", version: "4.1.3", size: "3.2 MB", rating: 4.2 },
  { id: "performance", name: "Performance Analyzer", category: "System", description: "System diagnostics", version: "7.2.0", size: "10.5 MB", rating: 4.6 },
  { id: "scanner", name: "Document Scanner", category: "Utilities", description: "Scan physical documents", version: "2.9.1", size: "6.7 MB", rating: 4.4 },
  { id: "translator", name: "Language Translator", category: "Utilities", description: "Multi-language translation", version: "3.5.0", size: "25.8 MB", rating: 4.7 },
  { id: "dictionary", name: "Digital Dictionary", category: "Reference", description: "Comprehensive word lookup", version: "5.1.2", size: "42.3 MB", rating: 4.5 },
  { id: "encyclopedia", name: "Encyclopedia", category: "Reference", description: "General knowledge database", version: "4.0.0", size: "156.7 MB", rating: 4.8 },
  { id: "map-viewer", name: "Map Navigator", category: "Navigation", description: "Interactive maps", version: "6.3.1", size: "34.5 MB", rating: 4.6 },
  { id: "gps", name: "GPS Tracker", category: "Navigation", description: "Location tracking system", version: "3.2.4", size: "8.3 MB", rating: 4.4 },
  { id: "astronomy", name: "Star Chart", category: "Science", description: "Celestial object tracking", version: "2.7.0", size: "18.9 MB", rating: 4.7 },
  { id: "chemistry", name: "Chemistry Lab", category: "Science", description: "Molecular modeling tools", version: "4.4.1", size: "23.6 MB", rating: 4.5 },
  { id: "physics", name: "Physics Simulator", category: "Science", description: "Physical phenomena modeling", version: "3.1.0", size: "15.2 MB", rating: 4.6 },
  { id: "biometric", name: "Biometric Scanner", category: "Security", description: "Fingerprint and iris scanning", version: "5.0.2", size: "9.4 MB", rating: 4.8 },
  { id: "encryption", name: "File Encryptor", category: "Security", description: "Military-grade encryption", version: "6.2.0", size: "4.8 MB", rating: 4.9 },
  { id: "password-manager", name: "Password Vault", category: "Security", description: "Secure password storage", version: "7.1.3", size: "5.6 MB", rating: 4.7 },
];

export const AppStore = ({ onInstall }: { onInstall?: (appId: string) => void }) => {
  const [installedApps, setInstalledApps] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    const installed = localStorage.getItem("urbanshade_installed_apps");
    if (installed) {
      setInstalledApps(JSON.parse(installed));
    }
  }, []);

  const categories = ["All", ...Array.from(new Set(AVAILABLE_APPS.map(app => app.category)))];

  const filteredApps = AVAILABLE_APPS.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(search.toLowerCase()) || 
                         app.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleInstall = (appId: string, appName: string) => {
    const newInstalled = [...installedApps, appId];
    setInstalledApps(newInstalled);
    localStorage.setItem("urbanshade_installed_apps", JSON.stringify(newInstalled));
    toast.success(`${appName} installed successfully!`);
    onInstall?.(appId);
    
    // Trigger storage event for other components
    window.dispatchEvent(new Event('storage'));
  };

  const isInstalled = (appId: string) => installedApps.includes(appId);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border p-4 space-y-4">
        <div className="flex items-center gap-3">
          <Package className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold">App Store</h1>
          <Badge variant="secondary" className="ml-auto">
            {AVAILABLE_APPS.length} Apps Available
          </Badge>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search applications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* App List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {filteredApps.map(app => (
            <div
              key={app.id}
              className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{app.name}</h3>
                    <Badge variant="outline">{app.category}</Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">{app.description}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>v{app.version}</span>
                    <span>{app.size}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                      <span>{app.rating}</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => handleInstall(app.id, app.name)}
                  disabled={isInstalled(app.id)}
                  className="shrink-0"
                >
                  {isInstalled(app.id) ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Installed
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Install
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}

          {filteredApps.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No apps found matching your search</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
