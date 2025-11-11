import { useState, useEffect } from "react";
import { Shield, AlertTriangle, Check, X, Plus, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface FirewallRule {
  id: string;
  name: string;
  type: "allow" | "block";
  protocol: "tcp" | "udp" | "icmp";
  port?: number;
  ip?: string;
  enabled: boolean;
}

interface ThreatLog {
  id: string;
  timestamp: string;
  ip: string;
  type: string;
  blocked: boolean;
}

const INITIAL_RULES: FirewallRule[] = [
  { id: "1", name: "Allow HTTP", type: "allow", protocol: "tcp", port: 80, enabled: true },
  { id: "2", name: "Allow HTTPS", type: "allow", protocol: "tcp", port: 443, enabled: true },
  { id: "3", name: "Allow SSH", type: "allow", protocol: "tcp", port: 22, enabled: true },
  { id: "4", name: "Block Telnet", type: "block", protocol: "tcp", port: 23, enabled: true },
  { id: "5", name: "Allow DNS", type: "allow", protocol: "udp", port: 53, enabled: true },
];

export const Firewall = () => {
  const [firewallEnabled, setFirewallEnabled] = useState(true);
  const [rules, setRules] = useState<FirewallRule[]>(() => {
    const saved = localStorage.getItem('firewall_rules');
    return saved ? JSON.parse(saved) : INITIAL_RULES;
  });
  const [threats, setThreats] = useState<ThreatLog[]>(() => {
    const saved = localStorage.getItem('firewall_threats');
    return saved ? JSON.parse(saved) : [];
  });
  const [adding, setAdding] = useState(false);
  const [newRule, setNewRule] = useState({
    name: "",
    type: "block" as "allow" | "block",
    protocol: "tcp" as "tcp" | "udp" | "icmp",
    port: "",
    ip: ""
  });
  const [blockedCount, setBlockedCount] = useState(0);

  useEffect(() => {
    localStorage.setItem('firewall_rules', JSON.stringify(rules));
  }, [rules]);

  useEffect(() => {
    localStorage.setItem('firewall_threats', JSON.stringify(threats));
  }, [threats]);

  // Simulate threat detection
  useEffect(() => {
    if (!firewallEnabled) return;
    
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const threatTypes = ["Port Scan", "DDoS Attempt", "Unauthorized Access", "Malware", "SQL Injection"];
        const newThreat: ThreatLog = {
          id: Date.now().toString(),
          timestamp: new Date().toLocaleTimeString(),
          ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          type: threatTypes[Math.floor(Math.random() * threatTypes.length)],
          blocked: true
        };
        setThreats(prev => [newThreat, ...prev.slice(0, 49)]);
        setBlockedCount(prev => prev + 1);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [firewallEnabled]);

  const handleToggleFirewall = () => {
    setFirewallEnabled(!firewallEnabled);
    toast.success(firewallEnabled ? "Firewall disabled" : "Firewall enabled");
  };

  const handleToggleRule = (ruleId: string) => {
    setRules(prev => prev.map(r => 
      r.id === ruleId ? { ...r, enabled: !r.enabled } : r
    ));
    toast.success("Rule updated");
  };

  const handleDeleteRule = (ruleId: string) => {
    if (!window.confirm("Delete this rule?")) return;
    setRules(prev => prev.filter(r => r.id !== ruleId));
    toast.success("Rule deleted");
  };

  const handleAddRule = () => {
    if (!newRule.name) {
      toast.error("Rule name is required!");
      return;
    }

    const rule: FirewallRule = {
      id: Date.now().toString(),
      name: newRule.name,
      type: newRule.type,
      protocol: newRule.protocol,
      port: newRule.port ? parseInt(newRule.port) : undefined,
      ip: newRule.ip || undefined,
      enabled: true
    };

    setRules(prev => [...prev, rule]);
    setAdding(false);
    setNewRule({ name: "", type: "block", protocol: "tcp", port: "", ip: "" });
    toast.success("Rule added");
  };

  return (
    <div className="flex h-full bg-background">
      {/* Rules Panel */}
      <div className="w-96 border-r border-border">
        <div className="p-4 border-b border-border bg-black/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <h2 className="font-bold">Firewall Rules</h2>
            </div>
            <Switch checked={firewallEnabled} onCheckedChange={handleToggleFirewall} />
          </div>
          <Button onClick={() => setAdding(true)} size="sm" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Rule
          </Button>
        </div>

        <ScrollArea className="h-[calc(100%-140px)]">
          <div className="p-3 space-y-2">
            {rules.map(rule => (
              <div
                key={rule.id}
                className={`p-3 rounded-lg border transition-colors ${
                  rule.enabled ? 'border-border' : 'border-border/50 opacity-50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {rule.type === "block" ? (
                        <Ban className="w-4 h-4 text-destructive" />
                      ) : (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                      <span className="font-bold text-sm">{rule.name}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {rule.protocol.toUpperCase()}
                      {rule.port && ` • Port ${rule.port}`}
                      {rule.ip && ` • ${rule.ip}`}
                    </div>
                  </div>
                  <Switch 
                    checked={rule.enabled} 
                    onCheckedChange={() => handleToggleRule(rule.id)}
                    disabled={!firewallEnabled}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteRule(rule.id)}
                  className="w-full text-destructive"
                >
                  <X className="w-3 h-3 mr-1" />
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Status & Logs */}
      <div className="flex-1 p-6">
        {adding ? (
          <div className="space-y-4">
            <h3 className="text-lg font-bold mb-4">Add Firewall Rule</h3>
            
            <div>
              <label className="text-sm text-muted-foreground">Rule Name</label>
              <Input
                value={newRule.name}
                onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                placeholder="My Rule"
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground">Action</label>
              <select
                value={newRule.type}
                onChange={(e) => setNewRule(prev => ({ ...prev, type: e.target.value as "allow" | "block" }))}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border"
              >
                <option value="allow">Allow</option>
                <option value="block">Block</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-muted-foreground">Protocol</label>
              <select
                value={newRule.protocol}
                onChange={(e) => setNewRule(prev => ({ ...prev, protocol: e.target.value as any }))}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border"
              >
                <option value="tcp">TCP</option>
                <option value="udp">UDP</option>
                <option value="icmp">ICMP</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-muted-foreground">Port (optional)</label>
              <Input
                type="number"
                value={newRule.port}
                onChange={(e) => setNewRule(prev => ({ ...prev, port: e.target.value }))}
                placeholder="80"
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground">IP Address (optional)</label>
              <Input
                value={newRule.ip}
                onChange={(e) => setNewRule(prev => ({ ...prev, ip: e.target.value }))}
                placeholder="192.168.1.1"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddRule} className="flex-1">
                Add Rule
              </Button>
              <Button onClick={() => setAdding(false)} variant="outline">
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-4">Firewall Status</h3>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-lg glass-panel">
                  <div className="text-xs text-muted-foreground mb-1">Status</div>
                  <div className={`font-bold text-lg ${firewallEnabled ? 'text-primary' : 'text-destructive'}`}>
                    {firewallEnabled ? "ACTIVE" : "DISABLED"}
                  </div>
                </div>
                
                <div className="p-4 rounded-lg glass-panel">
                  <div className="text-xs text-muted-foreground mb-1">Active Rules</div>
                  <div className="font-bold text-lg">{rules.filter(r => r.enabled).length}</div>
                </div>
                
                <div className="p-4 rounded-lg glass-panel">
                  <div className="text-xs text-muted-foreground mb-1">Threats Blocked</div>
                  <div className="font-bold text-lg text-destructive">{blockedCount}</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                Threat Log
              </h4>
              <ScrollArea className="h-[400px] rounded-lg border border-border">
                <div className="p-3 space-y-2">
                  {threats.length === 0 ? (
                    <div className="text-center text-muted-foreground text-sm py-8">
                      No threats detected
                    </div>
                  ) : (
                    threats.map(threat => (
                      <div key={threat.id} className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <Ban className="w-4 h-4 text-destructive" />
                            <span className="font-bold text-sm">{threat.type}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{threat.timestamp}</span>
                        </div>
                        <div className="text-xs text-muted-foreground font-mono">
                          Source: {threat.ip}
                        </div>
                        <div className="text-xs text-destructive font-bold mt-1">
                          ● BLOCKED
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
