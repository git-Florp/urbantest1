import { useState } from "react";
import { FileText, Lock, AlertTriangle } from "lucide-react";

interface Note {
  id: string;
  title: string;
  date: string;
  classification: "top-secret" | "confidential" | "restricted";
  author: string;
  content: string;
  tags: string[];
}

export const ResearchNotes = () => {
  const [notes] = useState<Note[]>([
    {
      id: "1",
      title: "Specimen Z-13 Behavioral Analysis",
      date: "2024-03-15",
      classification: "top-secret",
      author: "Dr. Sarah Chen",
      content: "Subject demonstrates unprecedented adaptive intelligence. Containment protocols may need revision. The specimen has shown ability to manipulate its environment in ways we didn't anticipate. Recommend immediate review of security measures.",
      tags: ["specimen", "behavior", "security"]
    },
    {
      id: "2",
      title: "Pressure System Optimization",
      date: "2024-03-14",
      classification: "confidential",
      author: "Engineer Mark Torres",
      content: "New pressure management algorithm reduces energy consumption by 12%. Implementation scheduled for next maintenance cycle. Testing shows stable operation under extreme conditions.",
      tags: ["engineering", "pressure", "optimization"]
    },
    {
      id: "3",
      title: "Emergency Protocol Revision - Code Black",
      date: "2024-03-13",
      classification: "top-secret",
      author: "Director James Morrison",
      content: "Following last month's incident, Code Black protocols must be updated. New evacuation routes established. All personnel must complete updated training by end of quarter.",
      tags: ["protocols", "safety", "training"]
    },
    {
      id: "4",
      title: "Bioluminescent Properties Study",
      date: "2024-03-12",
      classification: "confidential",
      author: "Dr. Emily Rodriguez",
      content: "Deep-sea specimens exhibit unique bioluminescent patterns that may serve communication purposes. Frequency analysis ongoing. Potential applications for facility lighting systems being explored.",
      tags: ["biology", "research", "specimens"]
    },
    {
      id: "5",
      title: "Network Security Audit Results",
      date: "2024-03-11",
      classification: "restricted",
      author: "IT Security Team",
      content: "Annual security audit complete. Minor vulnerabilities patched. Recommend implementing two-factor authentication for all Level 3+ clearance personnel. Overall system integrity: excellent.",
      tags: ["security", "network", "audit"]
    },
    {
      id: "6",
      title: "Containment Field Generator Upgrade",
      date: "2024-03-10",
      classification: "confidential",
      author: "Dr. Alan Foster",
      content: "New electromagnetic containment field shows 40% improvement in stability. Testing phase successful. Recommend deployment in Alpha and Beta containment zones.",
      tags: ["containment", "engineering", "upgrade"]
    },
    {
      id: "7",
      title: "Personnel Psychological Evaluation",
      date: "2024-03-09",
      classification: "restricted",
      author: "Dr. Lisa Park",
      content: "Extended deep-sea isolation showing predictable stress patterns in staff. Implementing mandatory recreation periods and increased surface communication time. Morale improvement noted.",
      tags: ["personnel", "psychology", "health"]
    },
    {
      id: "8",
      title: "Specimen Transportation Incident Report",
      date: "2024-03-08",
      classification: "top-secret",
      author: "Security Chief David Kumar",
      content: "Incident during specimen transfer to Lab B contained successfully. No casualties. Transport protocols being reviewed. Subject sedation levels insufficient - updating standards.",
      tags: ["incident", "specimens", "security"]
    },
    {
      id: "9",
      title: "[REDACTED]",
      date: "████-██-██",
      classification: "top-secret",
      author: "[ACCESS DENIED]",
      content: "███████ ████ ██████ PRESSURE ███████\n\n[SECTION REDACTED]\n\n...it's not a specimen. It's ████████...\n\n[SECTION REDACTED]\n\n...Director Morrison has ordered ████████ under Protocol ██████...\n\n[REMAINING TEXT CORRUPTED]",
      tags: ["█████", "classified", "urgent"]
    },
    {
      id: "10",
      title: "Deep Sea Microbiology Study",
      date: "2024-03-07",
      classification: "confidential",
      author: "Dr. Patricia Wong",
      content: "New extremophile bacteria discovered at depths exceeding 11,000m. Demonstrates unprecedented survival mechanisms. Potential applications in biotech industry. Sample collection ongoing. DNA sequencing reveals unique genetic markers not found in surface organisms.",
      tags: ["microbiology", "discovery", "research"]
    },
    {
      id: "11",
      title: "Quantum Sensor Array Installation",
      date: "2024-03-06",
      classification: "restricted",
      author: "Dr. Michael Zhang",
      content: "New quantum sensor array operational in all zones. Provides real-time environmental monitoring with 99.8% accuracy. Integration with main monitoring system complete. Training sessions scheduled for all technical staff next week.",
      tags: ["technology", "sensors", "upgrade"]
    },
    {
      id: "12",
      title: "Specimen Communication Patterns",
      date: "2024-03-05",
      classification: "top-secret",
      author: "Dr. Sarah Chen",
      content: "Analysis of specimen vocalizations reveals potential communication framework. Frequency patterns suggest intelligence beyond initial estimates. Recommend expanding linguistic analysis team. Ethics committee review requested for extended observation protocols.",
      tags: ["specimens", "communication", "research"]
    },
    {
      id: "13",
      title: "Emergency Evacuation Drill Results",
      date: "2024-03-04",
      classification: "restricted",
      author: "Safety Officer Blake",
      content: "Facility-wide evacuation drill completed successfully. All personnel reached safe zones within 8 minutes, exceeding target time of 10 minutes. Minor issues with Zone 4 emergency lighting addressed. Next drill scheduled for next quarter.",
      tags: ["safety", "drills", "emergency"]
    },
    {
      id: "14",
      title: "Bioluminescent Energy Harvesting Proposal",
      date: "2024-03-03",
      classification: "confidential",
      author: "Dr. Alan Foster",
      content: "Preliminary research suggests we could harness bioluminescent energy from certain specimens to supplement facility power. Initial calculations show 5-8% reduction in reactor load possible. Budget proposal submitted for prototype development.",
      tags: ["energy", "innovation", "specimens"]
    },
    {
      id: "15",
      title: "Personnel Rotation Schedule Update",
      date: "2024-03-02",
      classification: "restricted",
      author: "HR Department",
      content: "Updated rotation schedule for deep-sea assignments. Maximum continuous deployment reduced from 90 to 60 days based on psychological evaluations. Surface leave extended to 30 days. New schedule effective next month.",
      tags: ["personnel", "schedule", "health"]
    },
    {
      id: "16",
      title: "Anomalous Acoustic Signatures",
      date: "2024-03-01",
      classification: "confidential",
      author: "Acoustic Research Team",
      content: "Long-range sensors detected unusual acoustic patterns originating from depths below facility level. Patterns do not match any known marine life or geological activity. Further investigation authorized. Data being analyzed.",
      tags: ["acoustics", "anomaly", "investigation"]
    },
    {
      id: "17",
      title: "Material Science Breakthrough",
      date: "2024-02-28",
      classification: "confidential",
      author: "Dr. Jennifer Martinez",
      content: "New pressure-resistant alloy developed for containment units. Withstands 15% more pressure than current materials. Manufacturing process optimized. Recommend gradual replacement of existing containment materials over next fiscal year.",
      tags: ["materials", "engineering", "containment"]
    }
  ]);

  const [selected, setSelected] = useState<Note | null>(null);

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case "top-secret": return "text-destructive";
      case "confidential": return "text-yellow-500";
      case "restricted": return "text-primary";
      default: return "text-foreground";
    }
  };

  return (
    <div className="flex h-full">
      {/* Notes List */}
      <div className="w-1/3 border-r border-white/10 flex flex-col">
        <div className="p-4 border-b border-white/10 bg-black/20">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <h2 className="font-bold">Research Notes</h2>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {notes.length} documents
          </p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {notes.map((note) => (
            <div
              key={note.id}
              onClick={() => setSelected(note)}
              className={`p-4 border-b border-white/5 cursor-pointer transition-colors ${
                selected?.id === note.id ? "bg-primary/20" : "hover:bg-white/5"
              }`}
            >
              <div className="flex items-start gap-2">
                <Lock className={`w-4 h-4 mt-1 flex-shrink-0 ${getClassificationColor(note.classification)}`} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm line-clamp-2">{note.title}</h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-muted-foreground font-mono">{note.date}</span>
                    <span className={`text-xs font-bold uppercase ${getClassificationColor(note.classification)}`}>
                      {note.classification}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Note Details */}
      <div className="flex-1 flex flex-col">
        {selected ? (
          <>
            <div className="p-6 border-b border-white/10 bg-black/20">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className={`w-5 h-5 ${getClassificationColor(selected.classification)}`} />
                    <span className={`text-xs font-bold uppercase ${getClassificationColor(selected.classification)}`}>
                      {selected.classification}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold">{selected.title}</h2>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span>By {selected.author}</span>
                    <span>•</span>
                    <span className="font-mono">{selected.date}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="prose prose-invert max-w-none">
                <p className="text-sm leading-relaxed">{selected.content}</p>
              </div>

              <div className="mt-6">
                <h4 className="text-xs font-bold text-muted-foreground uppercase mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selected.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-primary/20 text-primary text-xs font-mono rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {selected.classification === "top-secret" && (
                <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded">
                  <div className="flex items-center gap-2 text-destructive font-bold text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    TOP SECRET CLASSIFICATION
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    This document contains highly sensitive information. Unauthorized disclosure is strictly prohibited and may result in immediate termination and legal action.
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm">Select a document to view</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
