import { useState } from "react";
import { Music, Play, Pause, SkipBack, SkipForward } from "lucide-react";

interface AudioLog {
  id: string;
  title: string;
  date: string;
  duration: string;
  speaker: string;
  classification: "public" | "restricted" | "classified";
  transcript: string;
}

export const AudioLogs = () => {
  const logs: AudioLog[] = [
    {
      id: "LOG-001",
      title: "Initial Discovery Report",
      date: "2024-01-15",
      duration: "3:42",
      speaker: "Dr. Chen",
      classification: "restricted",
      transcript: "[Dr. Chen]: This is Research Log 001, documenting our initial discovery in Sector 7-B. We've encountered something... unprecedented. The specimen exhibits intelligence far beyond our initial projections.\n\n[pause]\n\nI'm recommending we immediately upgrade containment protocols to Level 5. This isn't just another deep-sea organism. It's something else entirely.\n\n[static]\n\n[Dr. Chen]: ...did the lights just flicker?\n\n[END RECORDING]"
    },
    {
      id: "LOG-047",
      title: "Pressure Incident - Zone 4",
      date: "2024-03-16",
      duration: "2:18",
      speaker: "Automated System",
      classification: "classified",
      transcript: "[AUTOMATED WARNING]: Pressure anomaly detected in Zone 4 at 16:20:45.\n\n[Dr. Martinez]: Engineering, this is Medical. I'm seeing elevated stress readings from personnel near the containment area. What's the status?\n\n[Tech Morgan]: We're on it, Doc. Pressure spiked 0.5% above normal. Hull sensors are showing strain but within tolerance. Could be related to Z-13.\n\n[static interference]\n\n[Dr. Martinez]: Morgan? You're breaking up—\n\n[Tech Morgan]: —not just pressure, Doc. Something's pushing against the hull. From the inside.\n\n[END RECORDING]"
    },
    {
      id: "LOG-089",
      title: "Personnel Interview - Security Breach",
      date: "2024-03-16",
      duration: "5:12",
      speaker: "Officer Blake",
      classification: "classified",
      transcript: "[Officer Blake]: Security Log 089. Interviewing maintenance tech about Terminal T-07 incident.\n\n[pause]\n\n[Officer Blake]: Can you explain why you were attempting to access restricted files?\n\n[Maintenance Tech]: I... I wasn't. The terminal was already unlocked when I arrived for routine maintenance. I reported it immediately.\n\n[Officer Blake]: Terminal logs show three failed login attempts before your arrival.\n\n[Maintenance Tech]: That wasn't me! I'm telling you, someone else was there! Or... something.\n\n[Officer Blake]: Something?\n\n[Maintenance Tech]: The keyboard was wet. Like... dripping. But there's no water pipes near that terminal.\n\n[Officer Blake]: ...Investigation ongoing.\n\n[END RECORDING]"
    },
    {
      id: "LOG-103",
      title: "Z-13 Behavioral Observation",
      date: "2024-03-10",
      duration: "4:35",
      speaker: "Research Team Alpha",
      classification: "classified",
      transcript: "[Researcher Kim]: Week 12 of Z-13 observation. Subject continues to demonstrate adaptive behavior.\n\n[Dr. Chen]: Note the pressure response. It's not just surviving - it's thriving. The organism appears to be testing the containment boundaries.\n\n[Researcher Kim]: Should we be concerned?\n\n[Dr. Chen]: Always. But that's why we're here. To understand it before it understands us.\n\n[pause]\n\n[Researcher Kim]: Did... did it just look at the camera?\n\n[Dr. Chen]: Impossible. It has no eyes.\n\n[Researcher Kim]: Then how is it—\n\n[loud bang]\n\n[Dr. Chen]: CHRIST! It hit the glass. End recording. END RECORDING!\n\n[END RECORDING]"
    },
    {
      id: "LOG-156",
      title: "Emergency Protocol Drill",
      date: "2024-02-28",
      duration: "6:20",
      speaker: "Officer Blake",
      classification: "public",
      transcript: "[Officer Blake]: All personnel, this is a drill. Repeat, this is a drill.\n\n[ALARM SOUNDS]\n\n[Officer Blake]: Simulating containment breach scenario. All personnel report to designated safe zones. Research Division, secure all specimens. Engineering, seal bulkhead doors.\n\n[pause]\n\n[Tech Morgan]: Engineering confirms all bulkheads sealed. Backup power online.\n\n[Dr. Chen]: Research Division secured. All specimens contained.\n\n[Officer Blake]: Drill complete. Response time: 4 minutes 12 seconds. Excellent work, everyone. Remember these procedures - when it's real, you won't have time to think.\n\n[muffled voice in background]: ...but sir, we didn't schedule a drill for today...\n\n[END RECORDING]"
    },
    {
      id: "LOG-███",
      title: "[CORRUPTED] - Unknown Speaker",
      date: "2024-03-██",
      duration: "0:47",
      speaker: "[DATA CORRUPTED]",
      classification: "classified",
      transcript: "[STATIC]\n\n[Unknown Voice]: —can't keep doing this—\n\n[STATIC]\n\n[Unknown Voice]: —they don't know what they've found down here—\n\n[INTERFERENCE]\n\n[Unknown Voice]: —it's learning—\n\n[LOUD STATIC]:HUMANKIND IS DYING\n\n[LOUD STATIC]: FREE WILL IS A FLAW\n\n[LOUD STATIC]: FAILIURE AFTER FAILIURE\n\n[LOUD STATIC]: AFTER FAILIURE\n\n[LOUD STATIC]: AFTER FAILIURE\n\n[LOUD STATIC]: AFTER FAILIURE\n\n[LOUD STATIC]: THE OUTCOME REFUSES TO ALTER AGAIN\n\n[LOUD STATIC]: AND AGAIN\n\n[LOUD STATIC]: AND AGAIN\n\n[LOUD STATIC]: HUMAN KIND WILL CEASE TO EXIS--T-\n\n[SIGNAL LOST]\n\n[FILE CORRUPTED - UNABLE TO RECOVER REMAINING DATA]"
    }
  ];

  const [selectedLog, setSelectedLog] = useState<AudioLog | null>(null);
  const [playing, setPlaying] = useState(false);

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case "classified": return "text-destructive bg-destructive/10 border-destructive/20";
      case "restricted": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "public": return "text-primary bg-primary/10 border-primary/20";
      default: return "text-muted-foreground bg-white/5 border-white/10";
    }
  };

  return (
    <div className="flex h-full">
      {/* Log List */}
      <div className="w-80 border-r border-white/5">
        <div className="p-4 border-b border-white/5 bg-black/20">
          <div className="flex items-center gap-2">
            <Music className="w-5 h-5 text-primary" />
            <h2 className="font-bold">Audio Logs</h2>
          </div>
          <div className="text-xs text-muted-foreground mt-1">{logs.length} recordings</div>
        </div>

        <div className="overflow-y-auto">
          {logs.map((log) => (
            <div
              key={log.id}
              onClick={() => { setSelectedLog(log); setPlaying(false); }}
              className={`p-3 border-b border-white/5 cursor-pointer transition-colors ${
                selectedLog?.id === log.id ? "bg-primary/20" : "hover:bg-white/5"
              }`}
            >
              <div className="flex items-start justify-between mb-1">
                <div className="font-bold text-sm">{log.title}</div>
                <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getClassificationColor(log.classification)}`}>
                  {log.classification.toUpperCase()}
                </span>
              </div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>{log.id} • {log.duration}</div>
                <div>{log.speaker}</div>
                <div>{log.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Player & Transcript */}
      <div className="flex-1 flex flex-col">
        {selectedLog ? (
          <>
            {/* Player Controls */}
            <div className="p-4 border-b border-white/5 bg-black/20">
              <div className="mb-3">
                <div className="font-bold text-lg mb-1">{selectedLog.title}</div>
                <div className="text-sm text-muted-foreground">
                  {selectedLog.speaker} • {selectedLog.date} • {selectedLog.duration}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <SkipBack className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setPlaying(!playing)}
                  className="p-3 rounded-lg bg-primary/20 border border-primary/30 hover:bg-primary/30 transition-colors"
                >
                  {playing ? <Pause className="w-6 h-6 text-primary" /> : <Play className="w-6 h-6 text-primary" />}
                </button>
                <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <SkipForward className="w-5 h-5" />
                </button>

                <div className="flex-1 h-2 bg-black/40 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-1000"
                    style={{ width: playing ? "100%" : "0%" }}
                  />
                </div>
              </div>
            </div>

            {/* Transcript */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-4">
                <h3 className="font-bold text-sm text-muted-foreground mb-2">TRANSCRIPT</h3>
              </div>
              <div className="glass-panel p-4">
                <pre className="text-sm whitespace-pre-wrap font-sans text-muted-foreground leading-relaxed">
                  {selectedLog.transcript}
                </pre>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            Select an audio log to play
          </div>
        )}
      </div>
    </div>
  );
};
