import { useEffect, useState } from "react";

interface CrashScreenProps {
  onReboot: () => void;
  killedProcess?: string;
  crashType?: "kernel" | "virus" | "bluescreen" | "memory" | "corruption" | "overload";
  customData?: { title: string; message: string } | null;
}

export const CrashScreen = ({ onReboot, killedProcess, crashType = "kernel", customData }: CrashScreenProps) => {
  const [showScreen, setShowScreen] = useState(false);

  useEffect(() => {
    // Black screen for 3 seconds before showing crash
    const showTimeout = setTimeout(() => {
      setShowScreen(true);
    }, 3000);

    return () => {
      clearTimeout(showTimeout);
    };
  }, []);

  // Show black screen first
  if (!showScreen) {
    return <div className="fixed inset-0 bg-black" />;
  }

  // Custom crash screen
  if (customData) {
    const bgClass = crashType === "bluescreen" ? "bg-blue-600" :
                    crashType === "memory" ? "bg-black" :
                    crashType === "corruption" ? "bg-black" :
                    crashType === "overload" ? "bg-black" :
                    crashType === "virus" ? "bg-black" :
                    "bg-black";
    
    const textClass = crashType === "bluescreen" ? "text-white" :
                      crashType === "memory" ? "text-red-500" :
                      crashType === "corruption" ? "text-purple-500" :
                      crashType === "overload" ? "text-orange-500" :
                      crashType === "virus" ? "text-green-500" :
                      "text-red-500";

    return (
      <div className={`fixed inset-0 ${bgClass} flex flex-col items-center justify-center text-white font-mono p-8 ${crashType === "virus" ? "animate-pulse" : ""}`}>
        <div className="max-w-4xl w-full space-y-8">
          <div className="text-center space-y-4">
            <h1 className={`text-6xl font-bold tracking-wider ${textClass} ${crashType === "virus" ? "glitch-text" : ""}`}>
              {customData.title}
            </h1>
          </div>

          <div className="glass-panel p-6 bg-black/30 border border-white/20">
            <pre className="text-sm whitespace-pre-wrap leading-relaxed">
              {customData.message}
            </pre>
          </div>

          <div className="text-center space-y-2 text-xs text-muted-foreground">
            <div>Process: {killedProcess}</div>
            <div>Type: {crashType.toUpperCase()}</div>
            <div>Time: {new Date().toISOString()}</div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={onReboot}
              className="px-8 py-3 bg-primary text-background font-bold hover:bg-primary/80 transition-colors text-lg"
            >
              [ REBOOT SYSTEM ]
            </button>
          </div>
        </div>

        {crashType === "virus" && (
          <style>{`
            @keyframes glitch {
              0%, 100% { transform: translate(0); }
              20% { transform: translate(-5px, 5px); }
              40% { transform: translate(-5px, -5px); }
              60% { transform: translate(5px, 5px); }
              80% { transform: translate(5px, -5px); }
            }
            @keyframes glitch-text {
              0%, 90%, 100% { 
                opacity: 1; 
                text-shadow: none; 
              }
              10%, 50% { 
                opacity: 0.8; 
                text-shadow: -3px 0 #ff00de, 3px 0 #00ff9f;
              }
              30%, 70% { 
                opacity: 0.9;
                text-shadow: 3px 0 #ff00de, -3px 0 #00ff9f;
              }
            }
            .glitch-text {
              animation: glitch 0.3s infinite, glitch-text 0.5s infinite;
            }
          `}</style>
        )}
      </div>
    );
  }

  // Blue Screen of Death variation
  if (crashType === "bluescreen") {
    return (
      <div className="fixed inset-0 bg-blue-600 text-white font-mono p-8 overflow-auto">
        <div className="max-w-4xl">
          <div className="mb-8 text-[80px] leading-none">:(</div>
          
          <div className="space-y-4 text-lg mb-8">
            <div>Your PC ran into a problem and needs to restart. We're</div>
            <div>just collecting some error info, and then we'll restart for</div>
            <div>you.</div>
          </div>

          <div className="text-2xl mb-8">0% complete</div>

          <div className="space-y-2 text-sm mb-8">
            <div>If you'd like to know more, you can search online later for this error:</div>
            <div className="mt-4 text-base">CRITICAL_PROCESS_DIED: {killedProcess || "system.core"}</div>
          </div>

          <button
            onClick={onReboot}
            className="px-6 py-2 bg-white text-blue-600 font-bold hover:bg-gray-200 transition-colors"
          >
            [ RESTART NOW ]
          </button>
        </div>
      </div>
    );
  }

  // Memory corruption crash
  if (crashType === "memory") {
    return (
      <div className="fixed inset-0 bg-black text-red-500 font-mono p-8 overflow-auto">
        <div className="max-w-4xl">
          <pre className="text-sm mb-6">
{`███╗   ███╗███████╗███╗   ███╗ ██████╗ ██████╗ ██╗   ██╗
████╗ ████║██╔════╝████╗ ████║██╔═══██╗██╔══██╗╚██╗ ██╔╝
██╔████╔██║█████╗  ██╔████╔██║██║   ██║██████╔╝ ╚████╔╝ 
██║╚██╔╝██║██╔══╝  ██║╚██╔╝██║██║   ██║██╔══██╗  ╚██╔╝  
██║ ╚═╝ ██║███████╗██║ ╚═╝ ██║╚██████╔╝██║  ██║   ██║   
╚═╝     ╚═╝╚══════╝╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝   
 ██████╗ ██████╗ ██████╗ ██████╗ ██╗   ██╗██████╗ ████████╗
██╔════╝██╔═══██╗██╔══██╗██╔══██╗██║   ██║██╔══██╗╚══██╔══╝
██║     ██║   ██║██████╔╝██████╔╝██║   ██║██████╔╝   ██║   
██║     ██║   ██║██╔══██╗██╔══██╗██║   ██║██╔═══╝    ██║   
╚██████╗╚██████╔╝██║  ██║██║  ██║╚██████╔╝██║        ██║   
 ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝ ╚═╝        ╚═╝`}
          </pre>

          <div className="space-y-2 text-sm mb-6">
            <div className="text-red-500 font-bold">FATAL: MEMORY CORRUPTION DETECTED</div>
            <div className="text-yellow-400">Process: {killedProcess || "memory.manager"}</div>
            <div className="text-yellow-400">Status: HEAP OVERFLOW - SEGMENTATION FAULT</div>
          </div>

          <div className="space-y-1 text-xs mb-6">
            <div>*** STOP: 0x0000001E (0xC0000005, 0x8054D32A, 0x00000001, 0x8054D32A)</div>
            <div>*** ADDRESS 0x8054D32A base at 0x80400000, DateStamp 3e801c19</div>
            <div className="text-red-500 mt-2">Dumping physical memory to disk: 100</div>
            <div className="text-red-500">Physical memory dump complete.</div>
            <div className="text-yellow-400 mt-2">Contact system administrator or technical support.</div>
          </div>

          <button
            onClick={onReboot}
            className="px-6 py-2 bg-red-500 text-white font-bold hover:bg-red-600 transition-colors"
          >
            [ EMERGENCY REBOOT ]
          </button>
        </div>
      </div>
    );
  }

  // System corruption/glitch crash
  if (crashType === "corruption") {
    const glitchChars = "█▓▒░!@#$%^&*()_+-=[]{}|;:',.<>?/~`";
    const glitchText = (text: string) => {
      return text.split('').map(char => 
        Math.random() > 0.7 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : char
      ).join('');
    };

    return (
      <div className="fixed inset-0 bg-black text-primary font-mono p-8 overflow-auto animate-pulse">
        <div className="max-w-4xl">
          <div className="mb-6 text-lg text-red-500 animate-pulse">
            {glitchText("SYSTEM CORRUPTION DETECTED")}
          </div>

          <div className="space-y-2 text-xs mb-6">
            <div className="text-primary">{glitchText("ERROR: File system integrity check failed")}</div>
            <div className="text-yellow-500">{glitchText("WARNING: Data corruption in critical sectors")}</div>
            <div className="text-red-500">{glitchText("CRITICAL: System files damaged beyond repair")}</div>
            <div className="text-primary">Process: {glitchText(killedProcess || "░░░░░.░░░")}</div>
          </div>

          <div className="space-y-1 text-xs mb-6 text-muted-foreground">
            <div>0x{Math.random().toString(16).substring(2, 10).toUpperCase()}: ██████░░░░░░░░░░</div>
            <div>0x{Math.random().toString(16).substring(2, 10).toUpperCase()}: ░░░░░░████████░░</div>
            <div>0x{Math.random().toString(16).substring(2, 10).toUpperCase()}: ████░░░░░░░░████</div>
            <div>0x{Math.random().toString(16).substring(2, 10).toUpperCase()}: ░░░░████████░░░░</div>
            <div className="text-red-500 animate-pulse">CORRUPTION SPREADING... ABORT ABORT ABORT</div>
          </div>

          <button
            onClick={onReboot}
            className="px-6 py-2 bg-primary text-background font-bold hover:bg-primary/80 transition-colors animate-pulse"
          >
            [ {glitchText("REBOOT")} ]
          </button>
        </div>
      </div>
    );
  }

  // System overload crash
  if (crashType === "overload") {
    return (
      <div className="fixed inset-0 bg-black text-orange-500 font-mono p-8 overflow-auto">
        <div className="max-w-4xl">
          <pre className="text-destructive text-sm mb-4">
{`███████╗██╗   ██╗███████╗████████╗███████╗███╗   ███╗
██╔════╝╚██╗ ██╔╝██╔════╝╚══██╔══╝██╔════╝████╗ ████║
███████╗ ╚████╔╝ ███████╗   ██║   █████╗  ██╔████╔██║
╚════██║  ╚██╔╝  ╚════██║   ██║   ██╔══╝  ██║╚██╔╝██║
███████║   ██║   ███████║   ██║   ███████╗██║ ╚═╝ ██║
╚══════╝   ╚═╝   ╚══════╝   ╚═╝   ╚══════╝╚═╝     ╚═╝
 ██████╗ ██╗   ██╗███████╗██████╗ ██╗      ██████╗  █████╗ ██████╗ 
██╔═══██╗██║   ██║██╔════╝██╔══██╗██║     ██╔═══██╗██╔══██╗██╔══██╗
██║   ██║██║   ██║█████╗  ██████╔╝██║     ██║   ██║███████║██║  ██║
██║   ██║╚██╗ ██╔╝██╔══╝  ██╔══██╗██║     ██║   ██║██╔══██║██║  ██║
╚██████╔╝ ╚████╔╝ ███████╗██║  ██║███████╗╚██████╔╝██║  ██║██████╔╝
 ╚═════╝   ╚═══╝  ╚══════╝╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═════╝`}
          </pre>

          <div className="space-y-2 text-sm mb-6">
            <div className="text-orange-500 font-bold">SYSTEM OVERLOAD - THERMAL SHUTDOWN</div>
            <div className="text-yellow-400">Process: {killedProcess || "power.management"}</div>
            <div className="text-red-500">Temperature: CRITICAL (127°C)</div>
            <div className="text-red-500">CPU Load: 100% | RAM: 100% | Disk I/O: MAXED</div>
          </div>

          <div className="space-y-1 text-xs mb-6">
            <div className="text-red-500">🔴 CPU Temperature: 127°C (MAX: 85°C) - CRITICAL</div>
            <div className="text-red-500">🔴 GPU Temperature: 103°C (MAX: 90°C) - CRITICAL</div>
            <div className="text-orange-400">🟠 Fan Speed: 100% - Unable to cool system</div>
            <div className="text-orange-400">🟠 Power Draw: 450W - Exceeding PSU rating</div>
            <div className="text-red-500 mt-2">Emergency thermal shutdown initiated to prevent hardware damage</div>
          </div>

          <div className="p-4 border border-orange-500 bg-orange-500/10 mb-6">
            <div className="font-bold mb-2">⚠ HARDWARE PROTECTION ACTIVATED:</div>
            <div className="text-xs">
              System has been forcefully shut down to prevent permanent damage to components.
              Allow system to cool before rebooting. Check thermal paste and cooling solutions.
            </div>
          </div>

          <button
            onClick={onReboot}
            className="px-6 py-2 bg-orange-500 text-black font-bold hover:bg-orange-600 transition-colors"
          >
            [ COOL DOWN & REBOOT ]
          </button>
        </div>
      </div>
    );
  }

  // Kernel panic (default)
  if (crashType === "kernel") {
    return (
      <div className="fixed inset-0 bg-black text-primary font-mono p-8 overflow-auto">
        <div className="max-w-4xl">
          <div className="mb-4">
            <pre className="text-destructive text-sm">
{`███████╗██╗   ██╗███████╗████████╗███████╗███╗   ███╗
██╔════╝╚██╗ ██╔╝██╔════╝╚══██╔══╝██╔════╝████╗ ████║
███████╗ ╚████╔╝ ███████╗   ██║   █████╗  ██╔████╔██║
╚════██║  ╚██╔╝  ╚════██║   ██║   ██╔══╝  ██║╚██╔╝██║
███████║   ██║   ███████║   ██║   ███████╗██║ ╚═╝ ██║
╚══════╝   ╚═╝   ╚══════╝   ╚═╝   ╚══════╝╚═╝     ╚═╝
 ██████╗██████╗  █████╗ ███████╗██╗  ██╗
██╔════╝██╔══██╗██╔══██╗██╔════╝██║  ██║
██║     ██████╔╝███████║███████╗███████║
██║     ██╔══██╗██╔══██║╚════██║██╔══██║
╚██████╗██║  ██║██║  ██║███████║██║  ██║
 ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝`}
            </pre>
          </div>

          <div className="space-y-2 text-sm mb-6">
            <div className="text-destructive font-bold">CRITICAL SYSTEM FAILURE - KERNEL PANIC</div>
            <div className="text-yellow-500">Process: {killedProcess || "system.core"}</div>
            <div className="text-yellow-500">Status: TERMINATED BY USER</div>
            <div>Time: {new Date().toISOString()}</div>
          </div>

          <div className="space-y-1 text-xs mb-6 text-muted-foreground font-mono">
            <div>[    0.000000] Kernel panic - not syncing: Fatal exception in interrupt</div>
            <div>[    0.000001] CPU: 2 PID: 1847 Comm: {killedProcess || "system.core"} Tainted: G      D</div>
            <div>[    0.000001] Call Trace:</div>
            <div>[    0.000002]  ? critical_process_handler+0x47/0x80</div>
            <div>[    0.000002]  ? emergency_shutdown+0x2a/0x90</div>
            <div>[    0.000003]  ? sys_terminate+0x4e/0x70</div>
            <div>[    0.000004] ---[ end Kernel panic - not syncing ]---</div>
            <div className="text-destructive">[    0.000005] ERROR: Cannot continue operation</div>
            <div className="text-destructive">[    0.000006] CRITICAL: Operating system integrity compromised</div>
          </div>

          <div className="p-4 border border-destructive bg-destructive/10 mb-6">
            <div className="font-bold text-destructive mb-2">⚠ SYSTEM STATE:</div>
            <div className="space-y-1 text-xs">
              <div>Error Code: 0x0000007B_URBANSHADE_OS</div>
              <div>Exception: FORCED_TERMINATION_OF_CRITICAL_PROCESS</div>
              <div>Module: {killedProcess || "system.core"}.sys</div>
              <div>Status: IRRECOVERABLE_ERROR</div>
              <div className="mt-2 text-yellow-500">
                A critical operating system process has been forcefully terminated.
                The computer cannot continue to operate. Manual reboot required.
              </div>
            </div>
          </div>

          <div className="mb-6">
            <button
              onClick={onReboot}
              className="px-6 py-2 bg-primary text-background font-bold hover:bg-primary/80 transition-colors"
            >
              [ FORCE REBOOT ]
            </button>
          </div>

          <div className="text-xs text-muted-foreground">
            Press FORCE REBOOT to restart the system. All unsaved data will be lost.
          </div>
        </div>
      </div>
    );
  }

  // Virus crash - full facility failure
  return (
    <div className="fixed inset-0 bg-black text-primary font-mono p-8 overflow-auto animate-pulse">
      <div className="max-w-4xl glitch-container">
        <div className="mb-4">
          <pre className="text-destructive text-sm">
{`███████╗ █████╗  ██████╗██╗██╗     ██╗████████╗██╗   ██╗
██╔════╝██╔══██╗██╔════╝██║██║     ██║╚══██╔══╝╚██╗ ██╔╝
█████╗  ███████║██║     ██║██║     ██║   ██║    ╚████╔╝ 
██╔══╝  ██╔══██║██║     ██║██║     ██║   ██║     ╚██╔╝  
██║     ██║  ██║╚██████╗██║███████╗██║   ██║      ██║   
╚═╝     ╚═╝  ╚═╝ ╚═════╝╚═╝╚══════╝╚═╝   ╚═╝      ╚═╝   
███████╗ █████╗ ██╗██╗     ██╗   ██╗██████╗ ███████╗
██╔════╝██╔══██╗██║██║     ██║   ██║██╔══██╗██╔════╝
█████╗  ███████║██║██║     ██║   ██║██████╔╝█████╗  
██╔══╝  ██╔══██║██║██║     ██║   ██║██╔══██╗██╔══╝  
██║     ██║  ██║██║███████╗╚██████╔╝██║  ██║███████╗
╚═╝     ╚═╝  ╚═╝╚═╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝`}
          </pre>
        </div>

        <div className="space-y-2 text-sm mb-6">
          <div className="text-destructive font-bold">CATASTROPHIC SYSTEM FAILURE - MALWARE DETECTED</div>
          <div className="text-yellow-500">Malicious Process: {killedProcess || "UNKNOWN_VIRUS.exe"}</div>
          <div className="text-yellow-500">Status: CRITICAL SYSTEMS COMPROMISED</div>
          <div>Time: {new Date().toISOString()}</div>
          <div>Location: Hadal Blacksite - 8,247 meters depth</div>
        </div>

        <div className="space-y-1 text-xs mb-6 text-muted-foreground font-mono">
          <div className="text-destructive">[    0.000000] FATAL: Malware execution detected</div>
          <div className="text-destructive">[    0.000001] CRITICAL: Core systems infected</div>
          <div className="text-destructive">[    0.000002] ERROR: life_support.service - CORRUPTED</div>
          <div className="text-destructive">[    0.000003] ERROR: containment.service - OFFLINE</div>
          <div className="text-destructive">[    0.000004] ERROR: power-grid.service - UNSTABLE</div>
          <div className="text-destructive">[    0.000005] ERROR: emergency.service - UNRESPONSIVE</div>
          <div className="text-yellow-500">[    0.000006] WARNING: Facility integrity at risk</div>
          <div className="text-yellow-500">[    0.000007] WARNING: Personnel evacuation recommended</div>
        </div>

        <div className="p-4 border border-destructive bg-destructive/10 mb-6">
          <div className="font-bold text-destructive mb-2">⚠ FACILITY STATUS - CRITICAL:</div>
          <div className="space-y-1 text-xs">
            <div>Error Code: 0xDEADBEEF_MALWARE_INFECTION</div>
            <div>Threat Vector: Malicious executable in file system</div>
            <div>Systems Affected: ALL CRITICAL INFRASTRUCTURE</div>
            <div>Facility Status: COMPROMISED</div>
            <div className="mt-2 text-yellow-500">
              Malicious software has infected core facility systems. Life support,
              containment fields, and power distribution have been compromised.
              Immediate evacuation and system restoration required.
            </div>
          </div>
        </div>

        <div className="p-4 bg-destructive/20 border border-destructive mb-6">
          <div className="font-bold text-destructive mb-2">🔴 CRITICAL SYSTEMS STATUS:</div>
          <div className="space-y-1 text-xs">
            <div>🔴 Life Support: CRITICAL - Oxygen production failing</div>
            <div>🔴 Containment Fields: OFFLINE - All specimens unsecured</div>
            <div>🔴 Power Grid: UNSTABLE - Cascading failures detected</div>
            <div>🔴 Communications: DOWN - Cannot contact surface</div>
            <div>🔴 Hull Integrity: COMPROMISED - Pressure seals failing</div>
            <div>🟡 Emergency Lighting: ACTIVE (battery backup)</div>
          </div>
        </div>

        <div className="mb-6">
          <button
            onClick={onReboot}
            className="px-6 py-2 bg-primary text-background font-bold hover:bg-primary/80 transition-colors"
          >
            [ EMERGENCY REBOOT & RECOVERY ]
          </button>
        </div>

        <div className="text-xs text-destructive">
          ⚠ WARNING: Facility systems critically compromised. Emergency reboot will attempt
          automated recovery procedures. All personnel should proceed to evacuation zones.
          Containment breach imminent. This is not a drill.
        </div>
      </div>

      {/* Glitch effects for virus */}
      <style>{`
        @keyframes glitch {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-5px, 5px); }
          40% { transform: translate(-5px, -5px); }
          60% { transform: translate(5px, 5px); }
          80% { transform: translate(5px, -5px); }
        }
        @keyframes glitch-text {
          0%, 90%, 100% { 
            opacity: 1; 
            text-shadow: none; 
          }
          10%, 50% { 
            opacity: 0.8; 
            text-shadow: -3px 0 #ff00de, 3px 0 #00ff9f, -3px 0 #ff00de;
          }
          30%, 70% { 
            opacity: 0.9;
            text-shadow: 3px 0 #ff00de, -3px 0 #00ff9f, 3px 0 #ff00de;
          }
        }
        @keyframes screen-flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.9; }
        }
        .glitch-container {
          animation: glitch 0.3s infinite, screen-flicker 0.1s infinite;
        }
        .glitch-container pre,
        .glitch-container div {
          animation: glitch-text 0.6s infinite;
        }
      `}</style>
    </div>
  );
};
