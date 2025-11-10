import { useState, useRef, useEffect } from "react";

interface RecoveryModeProps {
  onExit: () => void;
}

export const RecoveryMode = ({ onExit }: RecoveryModeProps) => {
  const [output, setOutput] = useState<string[]>([
    "URBANSHADE RECOVERY ENVIRONMENT v3.7",
    "================================================",
    "",
    "[SYSTEM] Entering recovery mode...",
    "[OK] File system mounted",
    "[OK] Core modules loaded",
    "",
    "Type 'help' for available commands",
    ""
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const consoleEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [output]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const commands: Record<string, () => string[]> = {
    help: () => [
      "Available commands:",
      "  help       - Show this help message",
      "  list       - List files in directory",
      "  ls         - Alias for list",
      "  diag       - Run diagnostics",
      "  repair     - Attempt system repair",
      "  restore    - Restore from backup",
      "  virus      - Scan and remove viruses",
      "  clearvirus - Remove virus infection",
      "  logs       - View system logs",
      "  network    - Network diagnostics",
      "  disk       - Disk check",
      "  memory     - Memory test",
      "  boot       - Boot sector check",
      "  registry   - Registry repair",
      "  drivers    - Check drivers",
      "  permissions- Fix permissions",
      "  cleanup    - Clean temp files",
      "  optimize   - Optimize system",
      "  reboot     - Reboot system",
      "  shutdown   - Power off system",
      "  exit       - Exit recovery mode",
      "  clear      - Clear screen",
      "  status     - Show system status",
      "  scan       - Scan for errors",
      ""
    ],
    list: () => [
      "/system/",
      "  urbcore.dll",
      "  bootmgr.sys",
      "  recovery.dat",
      "/archive/",
      "  pressure_001.txt",
      "  experiment_log.dat",
      "/user/",
      "  session.tmp",
      ""
    ],
    ls: () => commands.list(),
    diag: () => {
      const isInfected = localStorage.getItem('system_virus_infected') === 'true';
      return [
        "[DIAG] Running diagnostics...",
        "[OK] Memory check passed",
        "[OK] Disk integrity verified",
        "[WARNING] 3 deleted files detected",
        "[OK] Network connection stable",
        isInfected ? "[CRITICAL] VIRUS INFECTION DETECTED" : "[OK] No malware detected",
        ""
      ];
    },
    virus: () => {
      const isInfected = localStorage.getItem('system_virus_infected') === 'true';
      if (!isInfected) {
        return [
          "[VIRUS SCAN]",
          "Scanning system...",
          "",
          "[OK] No threats detected",
          "System is clean.",
          ""
        ];
      }
      return [
        "[VIRUS SCAN]",
        "Scanning system...",
        "",
        "[!!!] CRITICAL THREAT DETECTED",
        "Type: Trojan.Hadal.Blacksite",
        "Location: /archive/VIRUS_SCANNER.exe",
        "Severity: CRITICAL",
        "",
        "Run 'clearvirus' to remove infection.",
        ""
      ];
    },
    clearvirus: () => {
      const isInfected = localStorage.getItem('system_virus_infected') === 'true';
      if (!isInfected) {
        return [
          "[ANTIVIRUS]",
          "System is already clean.",
          ""
        ];
      }
      
      localStorage.removeItem('system_virus_infected');
      return [
        "[ANTIVIRUS]",
        "Removing malware...",
        "",
        "Quarantining infected files...",
        "Cleaning registry entries...",
        "Repairing system files...",
        "Removing malicious processes...",
        "",
        "[SUCCESS] Virus removed successfully",
        "System has been cleaned.",
        "Safe to reboot.",
        ""
      ];
    },
    repair: () => {
      // Clear the needs recovery flag
      localStorage.removeItem('needs_recovery');
      return [
        "[REPAIR] Initiating repair sequence...",
        "[OK] Scanning file system",
        "[OK] Checking core modules",
        "[OK] Verifying checksums",
        "[OK] Repairing corrupted sectors",
        "[OK] Rebuilding boot configuration",
        "[COMPLETE] System repair successful",
        "[INFO] System can now boot normally",
        ""
      ];
    },
    restore: () => [
      "[RESTORE] Loading backup snapshot...",
      "[OK] Snapshot found: 2024-03-15 14:30:22",
      "[OK] Restoring files...",
      "[OK] 3 files restored",
      "[COMPLETE] Restore successful",
      ""
    ],
    status: () => [
      "SYSTEM STATUS:",
      "  Version: Urbanshade OS v3.7",
      "  Uptime: 14:23:45",
      "  Memory: 87% available",
      "  Disk: 234 GB free",
      "  Network: Connected",
      ""
    ],
    scan: () => [
      "[SCAN] Scanning for errors...",
      "[OK] File system: Clean",
      "[OK] Registry: Clean",
      "[WARNING] Found 2 corrupted sectors",
      "[OK] Network stack: Operational",
      ""
    ],
    logs: () => [
      "[SYSTEM LOGS]",
      "Loading recent system events...",
      "",
      "[16:32:18] BOOT: System started successfully",
      "[16:20:45] WARNING: Pressure anomaly Zone 4",
      "[16:10:30] ERROR: Failed login attempt T-07",
      "[15:45:12] INFO: Backup completed",
      "[14:30:00] WARNING: High CPU usage detected",
      "",
      "End of logs.",
      ""
    ],
    network: () => [
      "[NETWORK DIAGNOSTICS]",
      "Testing network connectivity...",
      "",
      "Main Server:       [OK] 2ms",
      "Backup Server:     [OK] 3ms",
      "DNS Resolution:    [OK]",
      "External Gateway:  [FAIL] Timeout",
      "Local Network:     [OK]",
      "",
      "Local network operational.",
      "External connection unavailable.",
      ""
    ],
    disk: () => [
      "[DISK CHECK]",
      "Scanning file system...",
      "",
      "Disk 0: /system    [OK] 78% used",
      "Disk 1: /data      [OK] 45% used",
      "Disk 2: /backup    [OK] 67% used",
      "Disk 3: /logs      [WARNING] 92% used",
      "",
      "Recommendation: Clear old logs",
      "No errors detected.",
      ""
    ],
    memory: () => [
      "[MEMORY TEST]",
      "Testing RAM modules...",
      "",
      "Module 0 (8GB):    [PASS]",
      "Module 1 (8GB):    [PASS]",
      "Module 2 (8GB):    [PASS]",
      "Module 3 (8GB):    [PASS]",
      "",
      "Total: 32GB",
      "Available: 18GB",
      "",
      "Memory test passed.",
      ""
    ],
    boot: () => [
      "[BOOT SECTOR CHECK]",
      "Analyzing boot configuration...",
      "",
      "Boot loader:       [OK]",
      "Boot partition:    [OK]",
      "Kernel image:      [OK]",
      "Init system:       [OK]",
      "Boot sequence:     [OK]",
      "",
      "Boot sector is healthy.",
      ""
    ],
    registry: () => [
      "[REGISTRY REPAIR]",
      "Scanning system registry...",
      "",
      "Checking keys:     [OK]",
      "Verifying values:  [OK]",
      "Orphan entries:    3 found",
      "Cleaning orphans:  [OK]",
      "Compacting:        [OK]",
      "",
      "Registry repaired successfully.",
      ""
    ],
    drivers: () => [
      "[DRIVER CHECK]",
      "Verifying system drivers...",
      "",
      "Display driver:    v3.2.1 [OK]",
      "Network driver:    v2.8.4 [OK]",
      "Storage driver:    v4.1.0 [OK]",
      "Security driver:   v5.0.2 [OK]",
      "",
      "All drivers up to date.",
      ""
    ],
    permissions: () => [
      "[PERMISSION FIX]",
      "Repairing file permissions...",
      "",
      "/system:           [FIXED]",
      "/data:             [OK]",
      "/user:             [FIXED]",
      "/logs:             [OK]",
      "",
      "Permissions corrected.",
      ""
    ],
    cleanup: () => [
      "[SYSTEM CLEANUP]",
      "Removing temporary files...",
      "",
      "Temp files:        247 MB freed",
      "Old logs:          1.2 GB freed",
      "Cache:             89 MB freed",
      "Recycle bin:       0 MB",
      "",
      "Total freed: 1.53 GB",
      ""
    ],
    optimize: () => [
      "[SYSTEM OPTIMIZATION]",
      "Optimizing system performance...",
      "",
      "Defragmenting:     [OK]",
      "Indexing:          [OK]",
      "Cache rebuild:     [OK]",
      "Registry compact:  [OK]",
      "Startup optimize:  [OK]",
      "",
      "System optimized.",
      ""
    ],
    shutdown: () => {
      setTimeout(onExit, 2000);
      return [
        "[SHUTDOWN]",
        "Preparing to power off...",
        "",
        "Closing applications...",
        "Unmounting disks...",
        "Powering down...",
        "",
        "[SYSTEM HALTED]",
        ""
      ];
    },
    reboot: () => {
      setTimeout(onExit, 1500);
      return [
        "[SYSTEM] Initiating reboot sequence...",
        "[OK] Unmounting file systems",
        "[OK] Stopping services",
        "[OK] Rebooting...",
        ""
      ];
    },
    exit: () => {
      setTimeout(onExit, 1000);
      return [
        "[SYSTEM] Exiting recovery mode...",
        ""
      ];
    },
    clear: () => {
      setOutput([]);
      return [];
    }
  };

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    
    if (!trimmed) {
      setOutput(prev => [...prev, ""]);
      return;
    }

    setHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);

    setOutput(prev => [...prev, `> ${cmd}`, ""]);

    if (commands[trimmed]) {
      const result = commands[trimmed]();
      setOutput(prev => [...prev, ...result]);
    } else {
      setOutput(prev => [...prev, `Command not found: ${trimmed}`, `Type 'help' for available commands`, ""]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = Math.min(history.length - 1, historyIndex + 1);
        setHistoryIndex(newIndex);
        setInput(newIndex === history.length - 1 && historyIndex === history.length - 1 ? "" : history[newIndex]);
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black text-[#00f0e0] font-mono overflow-hidden z-[9999]"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="h-full overflow-y-auto p-4 pb-20">
        {output.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap">
            {line}
          </div>
        ))}
        <div ref={consoleEndRef} />
      </div>
      
      {/* Command input at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-[#00f0e0]/20 p-4">
        <div className="flex items-center gap-2">
          <span className="text-[#00f0e0]">&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-[#00f0e0] font-mono"
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
};
