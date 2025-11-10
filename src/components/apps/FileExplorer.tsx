import { useState, useEffect } from "react";
import { Folder, File, Trash2, Download, Lock, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { saveState, loadState } from "@/lib/persistence";

interface FileItem {
  name: string;
  type: "file" | "folder";
  size?: string;
  modified: string;
  encrypted?: boolean;
  content?: string;
  critical?: boolean;
  virus?: boolean;
}

interface FileExplorerProps {
  onLog?: (action: string) => void;
  onVirusDetected?: () => void;
}

const initialFileSystem: Record<string, FileItem[]> = {
  "/": [
    { name: "system", type: "folder", modified: "2024-03-15 14:30" },
    { name: "archive", type: "folder", modified: "2024-03-14 09:15" },
    { name: "user", type: "folder", modified: "2024-03-16 11:45" },
    { name: "logs", type: "folder", modified: "2024-03-16 16:22" },
  ],
  "/system": [
    { name: "urbcore.dll", type: "file", size: "2.4 MB", modified: "2024-03-10 08:00", content: "[SYSTEM] Core system library - DO NOT DELETE", critical: true },
    { name: "bootmgr.sys", type: "file", size: "512 KB", modified: "2024-03-10 08:00", content: "[BOOT] Boot manager configuration", critical: true },
    { name: "recovery.dat", type: "file", size: "8.1 MB", modified: "2024-03-15 14:30", content: "[RECOVERY] Snapshot data for system restore", critical: true },
  ],
  "/archive": [
    { name: "pressure_001.txt", type: "file", size: "4 KB", modified: "2024-02-28 16:45", content: "EXPERIMENT LOG #001\nSubject: Z-13 'Pressure'\nStatus: Contained\nThreat Level: EXTREME\nNotes: Subject demonstrates adaptive behavior in high-pressure environments. Recommend increased security protocols." },
    { name: "experiment_log.dat", type: "file", size: "156 KB", modified: "2024-03-01 12:30", encrypted: true, content: "[ENCRYPTED] Access Level 4 Required" },
    { name: "specimen_data.xlsx", type: "file", size: "2.8 MB", modified: "2024-03-10 09:00", content: "[DATA] Specimen catalog and behavioral patterns" },
    { name: "VIRUS_SCANNER.exe", type: "file", size: "666 KB", modified: "████-██-██ ██:██", content: "[EXECUTING...]\n\n> Initializing system scan...\n> Analyzing memory...\n> Checking processes...\n\n[!] CRITICAL ERROR: MALICIOUS CODE DETECTED\n[!] SYSTEM CORRUPTION IN PROGRESS\n[!] ATTEMPTING TO QUARANTINE...\n\n[FAILED]\n\n█████████████ SYSTEM COMPROMISED █████████████\n\nAll your base are belong to us.", virus: true },
    { name: "DELETED_DO_NOT_OPEN.█████", type: "file", size: "??? MB", modified: "████-██-██ ██:██", content: "[FILE CORRUPTED]\n[WARNING: UNAUTHORIZED ACCESS DETECTED]\n[TRACING CONNECTION...]\n\n...they're watching...\n\n[CONNECTION TERMINATED]" },
    { name: "classified", type: "folder", modified: "2024-02-15 10:00" },
  ],
  "/user": [
    { name: "session.tmp", type: "file", size: "12 KB", modified: "2024-03-16 11:45", content: "[SESSION] Active user session data" },
    { name: "notes.txt", type: "file", size: "8 KB", modified: "2024-03-15 18:20", content: "Personal Notes:\n- Check pressure readings in Zone 7\n- Review specimen containment protocols\n- Meeting with Dr. Chen at 1400 hours" },
    { name: "downloads", type: "folder", modified: "2024-03-14 14:00" },
  ],
  "/logs": [
    { name: "system_log.txt", type: "file", size: "234 KB", modified: "2024-03-16 16:22", content: "[16:22:15] System boot successful\n[16:22:18] All core modules loaded\n[16:22:20] Network connection established\n[16:20:45] WARNING: Pressure anomaly detected in Zone 4" },
    { name: "access_log.txt", type: "file", size: "89 KB", modified: "2024-03-16 15:30", content: "[15:30:12] User 'Aswd' logged in\n[15:28:45] User 'Dr_Chen' accessed Archive\n[15:25:30] Failed login attempt from terminal T-07" },
  ],
  "/archive/classified": [
    { name: "project_hadal.pdf", type: "file", size: "45 MB", modified: "2024-01-20 22:00", encrypted: true, content: "[ENCRYPTED] Top Secret - Clearance Level 5 Required" },
  ],
};

export const FileExplorer = ({ onLog, onVirusDetected }: FileExplorerProps) => {
  const [currentPath, setCurrentPath] = useState("/");
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [fileSystem, setFileSystem] = useState<Record<string, FileItem[]>>(() => 
    loadState('file_system', initialFileSystem)
  );

  useEffect(() => {
    saveState('file_system', fileSystem);
  }, [fileSystem]);

  const currentFiles = fileSystem[currentPath] || [];

  const navigateToFolder = (folderName: string) => {
    if (folderName === "..") {
      const parts = currentPath.split("/").filter(Boolean);
      parts.pop();
      setCurrentPath("/" + parts.join("/"));
    } else {
      const newPath = currentPath === "/" ? `/${folderName}` : `${currentPath}/${folderName}`;
      setCurrentPath(newPath);
    }
    setSelectedFile(null);
    onLog?.(`Navigated to ${folderName}`);
  };

  const handleFileClick = (file: FileItem) => {
    setSelectedFile(file);
    if (file.type === "file") {
      onLog?.(`Opened ${file.name}`);
      
      // Trigger virus if virus file is opened
      if (file.virus) {
        toast.error("CRITICAL ERROR: MALWARE DETECTED!");
        setTimeout(() => {
          toast.error("SYSTEM CORRUPTION IN PROGRESS...");
          setTimeout(() => {
            localStorage.setItem('system_virus_infected', 'true');
            onVirusDetected?.();
          }, 2000);
        }, 1000);
      }
    }
  };

  const handleDeleteFile = (file: FileItem) => {
    if (file.critical) {
      toast.error("Cannot delete critical system file!");
      return;
    }

    const confirmDelete = window.confirm(`Are you sure you want to delete "${file.name}"?`);
    if (!confirmDelete) return;

    // Remove file from current directory
    const updatedFiles = currentFiles.filter(f => f.name !== file.name);
    const newFileSystem = { ...fileSystem, [currentPath]: updatedFiles };
    
    setFileSystem(newFileSystem);
    setSelectedFile(null);
    toast.success(`Deleted ${file.name}`);
    onLog?.(`Deleted ${file.name}`);
  };

  return (
    <div className="flex h-full">
      {/* File List */}
      <div className="flex-1 border-r border-white/5">
        {/* Path Bar */}
        <div className="px-4 py-3 border-b border-white/5 bg-black/20">
          <div className="flex items-center gap-2 text-sm font-mono text-primary">
            <span>Location:</span>
            <span className="text-foreground">{currentPath}</span>
            {currentPath !== "/" && (
              <button
                onClick={() => navigateToFolder("..")}
                className="ml-2 px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-xs"
              >
                ← Back
              </button>
            )}
          </div>
        </div>

        {/* File List */}
        <div className="p-2">
          {currentFiles.map((file, idx) => (
            <div
              key={idx}
              onClick={() => file.type === "folder" ? navigateToFolder(file.name) : handleFileClick(file)}
              onDoubleClick={() => file.type === "folder" && navigateToFolder(file.name)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                selectedFile === file ? "bg-primary/20 border border-primary/30" : "hover:bg-white/5"
              }`}
            >
              {file.type === "folder" ? (
                <Folder className="w-5 h-5 text-accent" />
              ) : (
                <File className="w-5 h-5 text-muted-foreground" />
              )}
              {file.encrypted && <Lock className="w-3 h-3 text-destructive" />}
              {file.virus && <AlertTriangle className="w-3 h-3 text-yellow-500 animate-pulse" />}
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{file.name}</div>
                <div className="text-xs text-muted-foreground">{file.modified}</div>
              </div>
              {file.size && <div className="text-xs text-muted-foreground">{file.size}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* File Preview */}
      <div className="w-96 p-4 bg-black/10">
        {selectedFile ? (
          <>
            <div className="mb-4">
              <h3 className="font-bold text-lg mb-2">{selectedFile.name}</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <div>Type: {selectedFile.type}</div>
                {selectedFile.size && <div>Size: {selectedFile.size}</div>}
                <div>Modified: {selectedFile.modified}</div>
                {selectedFile.encrypted && (
                  <div className="text-destructive flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Encrypted
                  </div>
                )}
              </div>
            </div>

            <div className="mb-4 flex gap-2">
              <button 
                className="flex-1 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-bold hover:bg-primary/20 transition-colors flex items-center justify-center gap-2"
                onClick={() => toast.info(`Downloading ${selectedFile.name}...`)}
              >
                <Download className="w-3 h-3" />
                Download
              </button>
              <button 
                onClick={() => handleDeleteFile(selectedFile)}
                disabled={selectedFile.critical}
                className="px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold hover:bg-destructive/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {selectedFile.critical && (
              <div className="mb-4 p-2 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-xs flex items-center gap-2">
                <Lock className="w-3 h-3" />
                Critical system file - Cannot be deleted
              </div>
            )}

            {selectedFile.virus && (
              <div className="mb-4 p-2 rounded bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2 animate-pulse">
                <AlertTriangle className="w-3 h-3" />
                WARNING: Suspicious file detected
              </div>
            )}

            {selectedFile.content && (
              <div className="p-3 rounded-lg bg-black/40 border border-white/5">
                <div className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">
                  {selectedFile.content}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            Select a file to preview
          </div>
        )}
      </div>
    </div>
  );
};
