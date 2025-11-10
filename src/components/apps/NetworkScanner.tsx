import { useState, useEffect } from "react";
import { Wifi, Server, Radio, AlertCircle } from "lucide-react";

interface Node {
  id: string;
  name: string;
  type: "server" | "terminal" | "sensor" | "comms";
  status: "online" | "offline" | "warning";
  ip: string;
  location: string;
  latency: number;
}

export const NetworkScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [selected, setSelected] = useState<Node | null>(null);
  const [pinging, setPinging] = useState(false);
  const [diagnostics, setDiagnostics] = useState<string[]>([]);

  const allNodes: Node[] = [
    { id: "N001", name: "Main Server", type: "server", status: "online", ip: "10.0.0.1", location: "Control Room", latency: 2 },
    { id: "N002", name: "Backup Server", type: "server", status: "online", ip: "10.0.0.2", location: "Server Bay", latency: 3 },
    { id: "T001", name: "Terminal Alpha", type: "terminal", status: "online", ip: "10.0.1.15", location: "Research Lab", latency: 12 },
    { id: "T002", name: "Terminal Beta", type: "terminal", status: "online", ip: "10.0.1.16", location: "Medical Bay", latency: 15 },
    { id: "T003", name: "Terminal Gamma", type: "terminal", status: "warning", ip: "10.0.1.17", location: "Engineering", latency: 245 },
    { id: "T007", name: "Zone 4 Terminal (DESTROYED)", type: "terminal", status: "offline", ip: "10.0.1.21", location: "Zone 4 Access", latency: 0 },
    { id: "S001", name: "Pressure Sensor Array", type: "sensor", status: "online", ip: "10.0.2.10", location: "Hull Monitors", latency: 8 },
    { id: "S002", name: "Temperature Sensors", type: "sensor", status: "online", ip: "10.0.2.11", location: "All Zones", latency: 6 },
    { id: "C001", name: "CommLink Relay", type: "comms", status: "online", ip: "10.0.3.5", location: "Communications", latency: 5 },
    { id: "C002", name: "Emergency Broadcast", type: "comms", status: "online", ip: "10.0.3.6", location: "Control Room", latency: 4 },
  ];

  const runScan = () => {
    setScanning(true);
    setNodes([]);
    setSelected(null);
    setDiagnostics([]);

    allNodes.forEach((node, idx) => {
      setTimeout(() => {
        setNodes(prev => [...prev, node]);
        if (idx === allNodes.length - 1) {
          setScanning(false);
        }
      }, idx * 200);
    });
  };

  const pingNode = () => {
    if (!selected) return;
    setPinging(true);
    setDiagnostics([]);
    
    // T07 terminal doesn't respond to pings
    if (selected.id === "T007") {
      const results = [
        `PING ${selected.ip} (${selected.name})`,
        ``,
        `Request timeout for icmp_seq 1`,
        `Request timeout for icmp_seq 2`,
        `Request timeout for icmp_seq 3`,
        `Request timeout for icmp_seq 4`,
        ``,
        `--- ${selected.ip} ping statistics ---`,
        `4 packets transmitted, 0 received, 100% packet loss`,
        ``,
        `[WARNING] Node unresponsive - possible hardware failure or security lockdown`
      ];
      
      results.forEach((line, i) => {
        setTimeout(() => {
          setDiagnostics(prev => [...prev, line]);
          if (i === results.length - 1) setPinging(false);
        }, i * 200);
      });
      return;
    }
    
    const results = [
      `PING ${selected.ip} (${selected.name})`,
      `64 bytes from ${selected.ip}: icmp_seq=1 ttl=64 time=${selected.latency}ms`,
      `64 bytes from ${selected.ip}: icmp_seq=2 ttl=64 time=${selected.latency + 1}ms`,
      `64 bytes from ${selected.ip}: icmp_seq=3 ttl=64 time=${selected.latency - 1}ms`,
      `64 bytes from ${selected.ip}: icmp_seq=4 ttl=64 time=${selected.latency + 2}ms`,
      ``,
      `--- ${selected.ip} ping statistics ---`,
      `4 packets transmitted, 4 received, 0% packet loss`,
      `rtt min/avg/max = ${selected.latency - 1}/${selected.latency}/${selected.latency + 2}ms`
    ];

    results.forEach((line, i) => {
      setTimeout(() => {
        setDiagnostics(prev => [...prev, line]);
        if (i === results.length - 1) setPinging(false);
      }, i * 150);
    });
  };

  const traceroute = () => {
    if (!selected) return;
    setPinging(true);
    setDiagnostics([]);
    
    const results = [
      `Traceroute to ${selected.name} (${selected.ip})`,
      `1  gateway (10.0.0.1)  1ms  1ms  1ms`,
      `2  switch-a (10.0.0.254)  ${Math.floor(selected.latency * 0.3)}ms  ${Math.floor(selected.latency * 0.3)}ms  ${Math.floor(selected.latency * 0.3)}ms`,
      `3  ${selected.name} (${selected.ip})  ${selected.latency}ms  ${selected.latency}ms  ${selected.latency}ms`,
      ``,
      `Trace complete.`
    ];

    results.forEach((line, i) => {
      setTimeout(() => {
        setDiagnostics(prev => [...prev, line]);
        if (i === results.length - 1) setPinging(false);
      }, i * 300);
    });
  };

  const portScan = () => {
    if (!selected) return;
    setPinging(true);
    setDiagnostics([]);
    
    const ports = selected.type === "server" 
      ? [22, 80, 443, 3306, 5432]
      : selected.type === "terminal"
      ? [22, 3389, 5900]
      : selected.type === "sensor"
      ? [80, 443, 8080]
      : [22, 80, 443];

    const results = [
      `Scanning ${selected.name} (${selected.ip})`,
      `Starting port scan...`,
      ``
    ];

    ports.forEach(port => {
      results.push(`PORT ${port}/tcp    OPEN    ${getServiceName(port)}`);
    });

    results.push(``);
    results.push(`Scan complete: ${ports.length} ports open`);

    results.forEach((line, i) => {
      setTimeout(() => {
        setDiagnostics(prev => [...prev, line]);
        if (i === results.length - 1) setPinging(false);
      }, i * 200);
    });
  };

  const getServiceName = (port: number) => {
    const services: Record<number, string> = {
      22: "SSH",
      80: "HTTP",
      443: "HTTPS",
      3306: "MySQL",
      5432: "PostgreSQL",
      3389: "RDP",
      5900: "VNC",
      8080: "HTTP-Alt"
    };
    return services[port] || "Unknown";
  };

  useEffect(() => {
    runScan();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "text-primary";
      case "warning": return "text-yellow-500";
      case "offline": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "server": return Server;
      case "terminal": return Wifi;
      case "sensor": return AlertCircle;
      case "comms": return Radio;
      default: return Server;
    }
  };

  return (
    <div className="flex h-full">
      {/* Node List */}
      <div className="flex-1 border-r border-white/5">
        <div className="p-4 border-b border-white/5 bg-black/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wifi className="w-5 h-5 text-primary" />
            <h2 className="font-bold">Network Nodes</h2>
          </div>
          <button
            onClick={runScan}
            disabled={scanning}
            className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-bold hover:bg-primary/20 transition-colors disabled:opacity-50"
          >
            {scanning ? "Scanning..." : "Rescan"}
          </button>
        </div>

        <div className="p-2">
          {scanning && nodes.length < allNodes.length && (
            <div className="p-3 text-xs text-primary font-mono">
              [SCAN] Discovering network nodes... {nodes.length}/{allNodes.length}
            </div>
          )}
          
          {nodes.map((node) => {
            const Icon = getIcon(node.type);
            return (
              <div
                key={node.id}
                onClick={() => setSelected(node)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                  selected?.id === node.id ? "bg-primary/20 border border-primary/30" : "hover:bg-white/5"
                }`}
              >
                <Icon className={`w-5 h-5 ${getStatusColor(node.status)}`} />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm">{node.name}</div>
                  <div className="text-xs text-muted-foreground">{node.id} • {node.type.toUpperCase()}</div>
                </div>
                <div className={`text-xs font-bold ${getStatusColor(node.status)}`}>
                  ● {node.status.toUpperCase()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Node Details */}
      <div className="w-96 p-6 bg-black/10">
        {selected ? (
          <>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                {(() => {
                  const Icon = getIcon(selected.type);
                  return <Icon className={`w-8 h-8 ${getStatusColor(selected.status)}`} />;
                })()}
                <div>
                  <h3 className="font-bold text-xl">{selected.name}</h3>
                  <div className="text-sm text-muted-foreground">{selected.id}</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-3 rounded-lg glass-panel">
                <div className="text-xs text-muted-foreground mb-1">Status</div>
                <div className={`font-bold text-lg ${getStatusColor(selected.status)}`}>
                  ● {selected.status.toUpperCase()}
                </div>
              </div>

              <div className="p-3 rounded-lg glass-panel">
                <div className="text-xs text-muted-foreground mb-1">Type</div>
                <div className="font-bold">{selected.type.toUpperCase()}</div>
              </div>

              <div className="p-3 rounded-lg glass-panel">
                <div className="text-xs text-muted-foreground mb-1">IP Address</div>
                <div className="font-mono font-bold text-primary">{selected.ip}</div>
              </div>

              <div className="p-3 rounded-lg glass-panel">
                <div className="text-xs text-muted-foreground mb-1">Location</div>
                <div className="font-bold">{selected.location}</div>
              </div>

              <div className="p-3 rounded-lg glass-panel">
                <div className="text-xs text-muted-foreground mb-1">Latency</div>
                <div className={`font-mono font-bold ${
                  selected.latency === 0 ? "text-destructive" :
                  selected.latency > 100 ? "text-yellow-500" : "text-primary"
                }`}>
                  {selected.latency === 0 ? "OFFLINE" : `${selected.latency}ms`}
                </div>
              </div>

              {selected.status === "warning" && (
                <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <div className="text-xs text-yellow-500 font-bold mb-1">⚠ WARNING</div>
                  <div className="text-xs text-yellow-400">High latency detected - Connection unstable</div>
                </div>
              )}

              {selected.status === "offline" && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <div className="text-xs text-destructive font-bold mb-1">⚠ OFFLINE</div>
                  <div className="text-xs text-destructive/80">Node not responding to ping requests</div>
                </div>
              )}

              <div className="pt-4 border-t border-white/5">
                <div className="text-xs text-muted-foreground mb-2 font-bold">DIAGNOSTIC TOOLS</div>
                <div className="flex gap-2">
                  <button
                    onClick={pingNode}
                    disabled={pinging}
                    className="flex-1 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-bold hover:bg-primary/20 transition-colors disabled:opacity-50"
                  >
                    Ping
                  </button>
                  <button
                    onClick={traceroute}
                    disabled={pinging}
                    className="flex-1 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-bold hover:bg-primary/20 transition-colors disabled:opacity-50"
                  >
                    Trace
                  </button>
                  <button
                    onClick={portScan}
                    disabled={pinging}
                    className="flex-1 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-bold hover:bg-primary/20 transition-colors disabled:opacity-50"
                  >
                    Ports
                  </button>
                </div>
              </div>

              {diagnostics.length > 0 && (
                <div className="p-3 rounded-lg bg-black/30 border border-white/5 max-h-48 overflow-y-auto">
                  <div className="text-xs font-mono space-y-0.5">
                    {diagnostics.map((line, i) => (
                      <div key={i} className={line ? "text-primary" : "h-2"}>{line}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            Select a node to view details
          </div>
        )}
      </div>
    </div>
  );
};
