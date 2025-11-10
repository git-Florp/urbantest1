import { useState, useEffect } from "react";
import { AlertTriangle, ShieldAlert, Radio, Skull, Lock } from "lucide-react";
import { toast } from "sonner";
import { saveState, loadState } from "@/lib/persistence";

interface Protocol {
  id: string;
  code: string;
  name: string;
  severity: "HIGH" | "CRITICAL" | "EXTREME";
  description: string;
  steps: string[];
  activated: boolean;
  effects: string[];
}

interface EmergencyProtocolsProps {
  onLockdown?: (protocolName: string) => void;
}

export const EmergencyProtocols = ({ onLockdown }: EmergencyProtocolsProps) => {
  const [protocols, setProtocols] = useState<Protocol[]>(() => 
    loadState('emergency_protocols', [
      {
        id: "black",
        code: "CODE-BLACK",
        name: "Total Facility Lockdown",
        severity: "EXTREME",
        description: "Complete facility lockdown. All zones sealed, life support reduced to minimum, containment priority mode.",
        steps: [
          "1. Sound facility-wide alarm (145dB klaxon)",
          "2. Seal all bulkhead doors and airlocks",
          "3. Activate emergency blast shields on all containment cells",
          "4. Switch life support to minimum operational levels",
          "5. Disable all non-essential power systems",
          "6. Lock down personnel in current zones",
          "7. Activate automated defense systems",
          "8. Establish communications blackout (internal only)",
          "9. Deploy security teams to containment breach zones",
          "10. Prepare emergency evacuation pods (armed personnel only)",
        ],
        effects: ["All doors sealed", "Power redirected", "Communications restricted", "Automated defenses active"],
        activated: false
      },
      {
        id: "red",
        code: "CODE-RED",
        name: "Containment Breach",
        severity: "CRITICAL",
        description: "Major specimen containment breach detected. Immediate threat to personnel safety.",
        steps: [
          "1. Activate breach alarm in affected zones",
          "2. Seal affected zones immediately",
          "3. Deploy containment teams with sedation equipment",
          "4. Evacuate non-essential personnel from affected areas",
          "5. Activate specimen tracking systems",
        ],
        effects: ["Affected zones sealed", "Security teams deployed", "Tracking systems active"],
        activated: false
      },
    ])
  );

  const [selected, setSelected] = useState<Protocol | null>(null);
  const [activating, setActivating] = useState(false);
  const userClearanceLevel = 5;

  useEffect(() => {
    saveState('emergency_protocols', protocols);
  }, [protocols]);

  const handleActivate = (protocol: Protocol) => {
    if (protocol.activated) {
      setActivating(true);
      toast.info(`Deactivating ${protocol.code}...`);
      setTimeout(() => {
        setProtocols(prev => prev.map(p => p.id === protocol.id ? { ...p, activated: false } : p));
        setActivating(false);
        toast.success(`${protocol.code} deactivated`);
      }, 2000);
      return;
    }

    if (userClearanceLevel < 4) {
      toast.error("Access denied. Clearance Level 4+ required.");
      return;
    }

    setActivating(true);
    toast.warning(`Activating ${protocol.code}...`);
    setTimeout(() => {
      setProtocols(prev => prev.map(p => p.id === protocol.id ? { ...p, activated: true } : { ...p, activated: false }));
      setActivating(false);
      toast.error(`${protocol.code} ACTIVATED!`);
      
      // Trigger lockdown for CODE-BLACK
      if (protocol.id === "black" && onLockdown) {
        setTimeout(() => {
          onLockdown(protocol.name);
        }, 1000);
      }
    }, 2000);
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 border-r border-white/5">
        <div className="p-4 border-b border-white/5 bg-black/20">
          <AlertTriangle className="w-5 h-5 text-primary inline mr-2" />
          <span className="font-bold">Emergency Protocols</span>
        </div>
        <div className="p-2">
          {protocols.map((protocol) => (
            <div
              key={protocol.id}
              onClick={() => setSelected(protocol)}
              className={`p-4 rounded-lg mb-2 cursor-pointer ${
                protocol.activated ? "bg-destructive/20 border-2 border-destructive" :
                selected?.id === protocol.id ? "bg-primary/20" : "hover:bg-white/5"
              }`}
            >
              <div className="font-bold">{protocol.code}</div>
              <div className="text-sm text-muted-foreground">{protocol.name}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-[500px] p-6 bg-black/10">
        {selected ? (
          <div className="space-y-4">
            <div className="text-2xl font-bold">{selected.code}</div>
            <div>{selected.description}</div>
            <div className="space-y-2">
              {selected.steps.map((step, i) => (
                <div key={i} className="p-2 bg-black/20 text-xs">{step}</div>
              ))}
            </div>
            <button
              onClick={() => handleActivate(selected)}
              disabled={activating}
              className={`w-full px-4 py-3 rounded-lg font-bold ${
                selected.activated ? "bg-primary/20 text-primary" : "bg-destructive/20 text-destructive"
              }`}
            >
              {activating ? "PROCESSING..." : selected.activated ? "DEACTIVATE" : "ACTIVATE"}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};
