import { useState } from "react";
import { Database, Search, Lock } from "lucide-react";

interface SpecimenData {
  id: string;
  codename: string;
  classification: string;
  threat_level: "MINIMAL" | "LOW" | "MODERATE" | "HIGH" | "EXTREME";
  containment: string;
  status: "CONTAINED" | "DECEASED" | "MISSING" | "TERMINATED";
  discovered: string;
  notes: string;
  clearance_required: number;
}

export const DatabaseViewer = () => {
  const [search, setSearch] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<SpecimenData | null>(null);
  const userClearance = 5; // aswd's clearance level

  const specimens: SpecimenData[] = [
    {
      id: "Z-13",
      codename: "EYEFESTATION",
      classification: "Aquatic Entity",
      threat_level: "EXTREME",
      containment: "Zone 4, Cell B-07",
      status: "CONTAINED",
      discovered: "2023-08-15",
      notes: "Highly aggressive. Multiple eyes capable of inducing psychological trauma. Containment requires specialized viewing restrictions. Staff advised to avoid direct visual contact. Recent containment stress detected.",
      clearance_required: 4
    },
    {
      id: "Z-09",
      codename: "PANDEMONIUM",
      classification: "Multi-Entity Organism",
      threat_level: "HIGH",
      containment: "Zone 3, Cell A-14",
      status: "CONTAINED",
      discovered: "2023-11-22",
      notes: "Exhibits collective intelligence. Multiple individual entities acting as one. Containment breach attempts: 3. Sound-based communication detected. Sedation protocols ready.",
      clearance_required: 3
    },
    {
      id: "Z-01",
      codename: "ANGLER",
      classification: "Deep-Sea Predator",
      threat_level: "HIGH",
      containment: "Zone 2, Cell C-03",
      status: "CONTAINED",
      discovered: "2022-03-08",
      notes: "Uses bioluminescent lure to attract prey. Extremely patient hunter. Has shown problem-solving capabilities. Containment stable. Feeding schedule: Weekly.",
      clearance_required: 2
    },
    {
      id: "Z-05",
      codename: "WALL DWELLER",
      classification: "Humanoid Entity",
      threat_level: "MODERATE",
      containment: "Zone 1, Cell D-22",
      status: "CONTAINED",
      discovered: "2023-01-19",
      notes: "Capable of flattening body to hide in narrow spaces. Non-aggressive unless cornered. Containment: Standard humanoid cell with reinforced walls.",
      clearance_required: 2
    },
    {
      id: "Z-17",
      codename: "[REDACTED]",
      classification: "[CLASSIFIED]",
      threat_level: "EXTREME",
      containment: "[DATA EXPUNGED]",
      status: "CONTAINED",
      discovered: "[CLASSIFIED]",
      notes: "[ACCESS DENIED - LEVEL 6 CLEARANCE REQUIRED]",
      clearance_required: 6
    },
    {
      id: "Z-23",
      codename: "SQUIDDLES",
      classification: "Cephalopod Swarm",
      threat_level: "LOW",
      containment: "Zone 1, Aquarium A-01",
      status: "CONTAINED",
      discovered: "2024-02-14",
      notes: "Generally docile. Exhibits playful behavior. Often used for stress relief for staff. Containment: Large saltwater tank. Feeding: Daily.",
      clearance_required: 1
    },
    {
      id: "Z-11",
      codename: "VOID MASS",
      classification: "Unknown Origin",
      threat_level: "HIGH",
      containment: "Zone 5, Special Cell",
      status: "CONTAINED",
      discovered: "2023-09-30",
      notes: "Absorbs all light in vicinity. Composition unknown. Containment requires specialized electromagnetic barriers. Research ongoing. Extreme caution advised.",
      clearance_required: 4
    },
    {
      id: "Z-06",
      codename: "GOOD PEOPLE",
      classification: "Humanoid Entity",
      threat_level: "MINIMAL",
      containment: "Zone 1, Cell B-09",
      status: "DECEASED",
      discovered: "2023-04-12",
      notes: "Former specimen. Displayed friendly behavior. Cause of death: Natural causes. Autopsy completed. Data archived.",
      clearance_required: 2
    },
    {
      id: "Z-███",
      codename: "[DATA EXPUNGED]",
      classification: "[REDACTED]",
      threat_level: "EXTREME",
      containment: "[CLASSIFIED]",
      status: "CONTAINED",
      discovered: "████-██-██",
      notes: "⚠️ WARNING: This file should not exist. If you can read this, report to Director Morrison immediately. [REMAINING DATA CORRUPTED]",
      clearance_required: 6
    }
  ];

  const getThreatColor = (level: string) => {
    switch (level) {
      case "EXTREME": return "text-destructive";
      case "HIGH": return "text-yellow-500";
      case "MODERATE": return "text-blue-400";
      case "LOW": return "text-primary";
      case "MINIMAL": return "text-green-400";
      default: return "text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONTAINED": return "text-primary";
      case "DECEASED": return "text-muted-foreground";
      case "MISSING": return "text-destructive";
      case "TERMINATED": return "text-yellow-500";
      default: return "text-muted-foreground";
    }
  };

  const filteredSpecimens = specimens.filter(s => 
    s.id.toLowerCase().includes(search.toLowerCase()) ||
    s.codename.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-full">
      {/* Database List */}
      <div className="flex-1 border-r border-white/5">
        <div className="p-4 border-b border-white/5 bg-black/20">
          <div className="flex items-center gap-2 mb-3">
            <Database className="w-5 h-5 text-primary" />
            <h2 className="font-bold">Specimen Database</h2>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search ID or codename..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-black/30 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-primary/50"
            />
          </div>
        </div>

        <div className="p-2">
          {filteredSpecimens.map((specimen) => {
            const hasAccess = userClearance >= specimen.clearance_required;
            return (
              <div
                key={specimen.id}
                onClick={() => hasAccess && setSelectedEntry(specimen)}
                className={`p-3 rounded-lg mb-2 transition-colors ${
                  !hasAccess ? "opacity-50 cursor-not-allowed" :
                  selectedEntry?.id === specimen.id ? "bg-primary/20 border border-primary/30" : 
                  "cursor-pointer hover:bg-white/5"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1">
                    <div className="font-bold text-sm mb-1 flex items-center gap-2">
                      {specimen.codename}
                      {!hasAccess && <Lock className="w-3 h-3 text-destructive" />}
                    </div>
                    <div className="text-xs text-muted-foreground font-mono">
                      ID: {specimen.id} • {specimen.classification}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <span className={`text-xs font-bold ${getThreatColor(specimen.threat_level)}`}>
                    ⚠ {specimen.threat_level}
                  </span>
                  <span className={`text-xs font-bold ${getStatusColor(specimen.status)}`}>
                    ● {specimen.status}
                  </span>
                </div>
                {!hasAccess && (
                  <div className="text-xs text-destructive mt-2">
                    CLEARANCE LEVEL {specimen.clearance_required} REQUIRED
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Entry Details */}
      <div className="w-96 p-6 bg-black/10">
        {selectedEntry ? (
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <div className="text-xs text-primary font-bold mb-1">SPECIMEN ID</div>
              <div className="font-mono font-bold text-2xl text-primary">{selectedEntry.id}</div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-1">Codename</div>
              <div className="font-bold text-xl">{selectedEntry.codename}</div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-1">Classification</div>
              <div className="font-bold">{selectedEntry.classification}</div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-1">Threat Level</div>
              <div className={`font-bold text-lg ${getThreatColor(selectedEntry.threat_level)}`}>
                ⚠ {selectedEntry.threat_level}
              </div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-1">Status</div>
              <div className={`font-bold ${getStatusColor(selectedEntry.status)}`}>
                ● {selectedEntry.status}
              </div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-1">Containment Location</div>
              <div className="font-mono text-sm">{selectedEntry.containment}</div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-1">Discovery Date</div>
              <div className="font-mono">{selectedEntry.discovered}</div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-2">Research Notes</div>
              <div className="p-3 rounded-lg bg-black/30 border border-white/5 text-sm leading-relaxed">
                {selectedEntry.notes}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-black/30 border border-white/5">
              <div className="text-xs text-muted-foreground">Clearance Required</div>
              <div className="font-bold text-primary">LEVEL {selectedEntry.clearance_required}</div>
              <div className="text-xs text-primary mt-1">✓ Access Granted</div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm text-center">
            <Database className="w-12 h-12 mb-4 opacity-50" />
            <p>Select a specimen entry to view details</p>
            <p className="text-xs mt-2">Your clearance: Level {userClearance}</p>
          </div>
        )}
      </div>
    </div>
  );
};
