import { useState } from "react";
import { AlertTriangle, ChevronRight } from "lucide-react";

interface Incident {
  id: string;
  date: string;
  time: string;
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  location: string;
  reporter: string;
  description: string;
  status: "open" | "investigating" | "resolved";
}

export const IncidentReports = () => {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  const incidents: Incident[] = [
    {
      id: "INC-2047",
      date: "2024-10-12",
      time: "14:23",
      severity: "critical",
      title: "Containment Breach Alert - Zone 4",
      location: "Zone 4, Sector B",
      reporter: "Dr. Sarah Chen",
      description: "Emergency containment protocols activated after pressure sensors detected anomalous readings. Specimen Z-13 containment unit showing stress fractures. Automated lockdown initiated. Security teams dispatched. Area evacuated. No casualties reported. Cause: Unknown pressure surge from deep-sea currents.",
      status: "investigating"
    },
    {
      id: "INC-2046",
      date: "2024-10-11",
      time: "09:15",
      severity: "high",
      title: "Terminal T-07 Network Failure",
      location: "Zone 4, Terminal Room",
      reporter: "Systems Admin",
      description: "Terminal T-07 stopped responding to all network requests. Multiple ping attempts failed. Physical inspection scheduled. Terminal may have been damaged during last week's incident. Hardware replacement ordered.",
      status: "open"
    },
    {
      id: "INC-2045",
      date: "2024-10-10",
      time: "16:42",
      severity: "medium",
      title: "Unauthorized Access Attempt",
      location: "Main Server Room",
      reporter: "Security AI",
      description: "Failed login attempt detected from unknown IP address. Attempted to access classified research files. IP traced to external source. Firewall blocked. Security protocols updated.",
      status: "resolved"
    },
    {
      id: "INC-2044",
      date: "2024-10-09",
      time: "22:18",
      severity: "low",
      title: "HVAC System Malfunction",
      location: "Medical Bay",
      reporter: "Dr. Rodriguez",
      description: "Temperature control system in Medical Bay malfunctioned, causing temperature to rise to 28°C. Maintenance team dispatched. System reset and tested. All equipment within safe operating temperatures.",
      status: "resolved"
    },
    {
      id: "INC-2043",
      date: "2024-10-09",
      time: "11:30",
      severity: "high",
      title: "Power Fluctuation in Research Lab",
      location: "Research Lab Alpha",
      reporter: "Lead Researcher Evans",
      description: "Sudden power spike damaged several research instruments. Backup power engaged successfully. Equipment assessment in progress. Data recovery underway. Estimated repair time: 48 hours.",
      status: "investigating"
    },
    {
      id: "INC-2042",
      date: "2024-10-08",
      time: "03:45",
      severity: "medium",
      title: "Unusual Specimen Behavior",
      location: "Containment Unit 7",
      reporter: "Night Shift Monitor",
      description: "Specimen Z-09 exhibited unusual movement patterns and increased activity levels. Containment integrity maintained. Behavioral analysis requested. Sedation protocols on standby.",
      status: "resolved"
    },
    {
      id: "INC-2041",
      date: "2024-10-07",
      time: "18:20",
      severity: "low",
      title: "Network Latency Spike",
      location: "Server Room",
      reporter: "Network Monitoring System",
      description: "Brief network latency spike detected across all zones. Duration: 45 seconds. No data loss. Root cause identified as routine backup process conflict. Backup schedule adjusted to prevent future occurrences.",
      status: "resolved"
    },
    {
      id: "INC-2040",
      date: "2024-10-07",
      time: "12:30",
      severity: "critical",
      title: "Hull Integrity Warning",
      location: "Section C, Lower Level",
      reporter: "Automated Hull Monitor",
      description: "Micro-fracture detected in hull Section C during routine scan. Emergency repair team deployed immediately. Area sealed and depressurized. Welding repairs completed successfully. Full structural integrity scan scheduled for next maintenance window. No immediate danger.",
      status: "investigating"
    },
    {
      id: "INC-2039",
      date: "2024-10-06",
      time: "08:15",
      severity: "high",
      title: "Biohazard Spill - Research Lab",
      location: "Research Lab Beta",
      reporter: "Lab Technician Davis",
      description: "Chemical spill in Research Lab Beta. Hazmat team responded within 3 minutes. Area contained and decontaminated. No personnel injuries. Lab equipment cleaned and tested. Incident report filed with safety committee. Enhanced safety protocols implemented.",
      status: "resolved"
    },
    {
      id: "INC-2038",
      date: "2024-10-05",
      time: "23:55",
      severity: "medium",
      title: "Sensor Array Calibration Error",
      location: "Zone 3, Sensor Bay",
      reporter: "Systems Technician",
      description: "Environmental sensor array in Zone 3 reporting erroneous readings. Recalibration performed. Faulty sensor module replaced. System now operating within normal parameters. Preventive maintenance schedule updated.",
      status: "resolved"
    },
    {
      id: "INC-2037",
      date: "2024-10-05",
      time: "16:40",
      severity: "low",
      title: "Emergency Lighting Test Failure",
      location: "Zone 2, Corridor 4B",
      reporter: "Maintenance Supervisor",
      description: "Three emergency light units failed routine testing. Batteries replaced and lights returned to service. All other emergency lighting operational. Full facility emergency lighting audit scheduled.",
      status: "resolved"
    },
    {
      id: "INC-2036",
      date: "2024-10-04",
      time: "14:00",
      severity: "high",
      title: "Communication System Interference",
      location: "All Zones",
      reporter: "Communications Officer",
      description: "Unusual electromagnetic interference disrupted internal communications for approximately 20 minutes. Source identified as malfunctioning research equipment in Lab Alpha. Equipment powered down and removed for inspection. Communications restored to full capacity.",
      status: "resolved"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-destructive/10 text-destructive border-destructive/20";
      case "high": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "medium": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "low": return "bg-primary/10 text-primary border-primary/20";
      default: return "bg-white/5 text-muted-foreground border-white/10";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "text-destructive";
      case "investigating": return "text-yellow-500";
      case "resolved": return "text-primary";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="flex h-full">
      {/* Incident List */}
      <div className="flex-1 border-r border-white/5">
        <div className="p-4 border-b border-white/5 bg-black/20">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-primary" />
            <h2 className="font-bold">Incident Reports</h2>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {incidents.filter(i => i.status !== "resolved").length} active incidents
          </div>
        </div>

        <div className="p-2">
          {incidents.map((incident) => (
            <div
              key={incident.id}
              onClick={() => setSelectedIncident(incident)}
              className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                selectedIncident?.id === incident.id ? "bg-primary/20 border border-primary/30" : "hover:bg-white/5"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1">
                  <div className="font-bold text-sm mb-1">{incident.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {incident.id} • {incident.date} {incident.time}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </div>
              <div className="flex gap-2">
                <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getSeverityColor(incident.severity)}`}>
                  {incident.severity.toUpperCase()}
                </span>
                <span className={`text-xs font-bold ${getStatusColor(incident.status)}`}>
                  ● {incident.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Incident Details */}
      <div className="w-96 p-6 bg-black/10">
        {selectedIncident ? (
          <div className="space-y-4">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Incident ID</div>
              <div className="font-mono font-bold text-lg text-primary">{selectedIncident.id}</div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-1">Title</div>
              <div className="font-bold text-lg">{selectedIncident.title}</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Date</div>
                <div className="font-mono font-bold">{selectedIncident.date}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Time</div>
                <div className="font-mono font-bold">{selectedIncident.time}</div>
              </div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-1">Severity</div>
              <span className={`inline-block px-3 py-1 rounded text-xs font-bold border ${getSeverityColor(selectedIncident.severity)}`}>
                {selectedIncident.severity.toUpperCase()}
              </span>
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-1">Status</div>
              <span className={`font-bold ${getStatusColor(selectedIncident.status)}`}>
                ● {selectedIncident.status.toUpperCase()}
              </span>
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-1">Location</div>
              <div className="font-bold">{selectedIncident.location}</div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-1">Reported By</div>
              <div className="font-bold">{selectedIncident.reporter}</div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-2">Description</div>
              <div className="p-3 rounded-lg bg-black/30 border border-white/5 text-sm leading-relaxed">
                {selectedIncident.description}
              </div>
            </div>

            {selectedIncident.status !== "resolved" && (
              <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <div className="text-xs text-yellow-500 font-bold">⚠ ACTIVE INVESTIGATION</div>
                <div className="text-xs text-yellow-400 mt-1">
                  This incident is under active investigation. Updates will be logged automatically.
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            Select an incident to view details
          </div>
        )}
      </div>
    </div>
  );
};
