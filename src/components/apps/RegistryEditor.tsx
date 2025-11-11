import { useState, useEffect } from "react";
import { Settings, Plus, Trash2, Edit, Save, X, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RegistryKey {
  path: string;
  name: string;
  value: string;
  type: "string" | "dword" | "binary";
  critical?: boolean;
}

const INITIAL_REGISTRY: RegistryKey[] = [
  { path: "HKEY_LOCAL_MACHINE\\SYSTEM", name: "BootDevice", value: "\\Device\\HarddiskVolume1", type: "string", critical: true },
  { path: "HKEY_LOCAL_MACHINE\\SYSTEM", name: "SystemRoot", value: "C:\\Windows", type: "string", critical: true },
  { path: "HKEY_LOCAL_MACHINE\\SOFTWARE\\Urbanshade", name: "InstallPath", value: "C:\\Program Files\\Urbanshade", type: "string" },
  { path: "HKEY_LOCAL_MACHINE\\SOFTWARE\\Urbanshade", name: "Version", value: "2.4.1", type: "string" },
  { path: "HKEY_LOCAL_MACHINE\\SOFTWARE\\Urbanshade\\Security", name: "ClearanceRequired", value: "3", type: "dword" },
  { path: "HKEY_LOCAL_MACHINE\\SOFTWARE\\Urbanshade\\Security", name: "EncryptionEnabled", value: "1", type: "dword" },
  { path: "HKEY_CURRENT_USER\\Control Panel", name: "Theme", value: "Urbanshade Dark", type: "string" },
  { path: "HKEY_CURRENT_USER\\Environment", name: "FACILITY_ID", value: "HADAL-7", type: "string" },
  { path: "HKEY_CURRENT_USER\\Software\\Urbanshade", name: "AutoBackup", value: "1", type: "dword" },
];

export const RegistryEditor = () => {
  const [registry, setRegistry] = useState<RegistryKey[]>(() => {
    const saved = localStorage.getItem('system_registry');
    return saved ? JSON.parse(saved) : INITIAL_REGISTRY;
  });
  const [selectedKey, setSelectedKey] = useState<RegistryKey | null>(null);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", value: "", type: "string" as RegistryKey["type"] });
  const [adding, setAdding] = useState(false);
  const [newForm, setNewForm] = useState({ path: "", name: "", value: "", type: "string" as RegistryKey["type"] });
  const [searchPath, setSearchPath] = useState("");

  useEffect(() => {
    localStorage.setItem('system_registry', JSON.stringify(registry));
  }, [registry]);

  const paths = Array.from(new Set(registry.map(k => k.path)));
  const filteredPaths = searchPath 
    ? paths.filter(p => p.toLowerCase().includes(searchPath.toLowerCase()))
    : paths;

  const getKeysForPath = (path: string) => registry.filter(k => k.path === path);

  const handleEdit = (key: RegistryKey) => {
    if (key.critical) {
      toast.error("Cannot edit critical system key!");
      return;
    }
    setSelectedKey(key);
    setEditForm({ name: key.name, value: key.value, type: key.type });
    setEditing(true);
  };

  const handleSaveEdit = () => {
    if (!selectedKey) return;
    
    setRegistry(prev => prev.map(k => 
      k === selectedKey 
        ? { ...k, name: editForm.name, value: editForm.value, type: editForm.type }
        : k
    ));
    setEditing(false);
    setSelectedKey(null);
    toast.success("Registry key updated");
  };

  const handleDelete = (key: RegistryKey) => {
    if (key.critical) {
      toast.error("Cannot delete critical system key!");
      return;
    }
    
    if (!window.confirm(`Delete registry key "${key.name}"?`)) return;
    
    setRegistry(prev => prev.filter(k => k !== key));
    if (selectedKey === key) setSelectedKey(null);
    toast.success("Registry key deleted");
  };

  const handleAdd = () => {
    if (!newForm.path || !newForm.name) {
      toast.error("Path and name are required!");
      return;
    }
    
    const newKey: RegistryKey = {
      path: newForm.path,
      name: newForm.name,
      value: newForm.value,
      type: newForm.type
    };
    
    setRegistry(prev => [...prev, newKey]);
    setAdding(false);
    setNewForm({ path: "", name: "", value: "", type: "string" });
    toast.success("Registry key added");
  };

  return (
    <div className="flex h-full bg-background">
      {/* Path Tree */}
      <div className="w-96 border-r border-border">
        <div className="p-4 border-b border-border bg-black/20">
          <div className="flex items-center gap-2 mb-3">
            <Settings className="w-5 h-5 text-primary" />
            <h2 className="font-bold">Registry Editor</h2>
          </div>
          <Input
            placeholder="Search paths..."
            value={searchPath}
            onChange={(e) => setSearchPath(e.target.value)}
            className="text-sm"
          />
        </div>
        
        <ScrollArea className="h-[calc(100%-140px)]">
          {filteredPaths.map(path => (
            <div key={path} className="border-b border-border/50">
              <div className="p-3 bg-accent/30 font-mono text-xs font-bold">{path}</div>
              {getKeysForPath(path).map((key, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedKey(key)}
                  className={`p-2 pl-6 text-sm cursor-pointer hover:bg-accent/50 ${
                    selectedKey === key ? 'bg-primary/20 border-l-2 border-primary' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {key.critical && <AlertTriangle className="w-3 h-3 text-yellow-500" />}
                    <span className="font-mono">{key.name}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </ScrollArea>
        
        <div className="p-3 border-t border-border">
          <Button onClick={() => setAdding(true)} className="w-full" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add New Key
          </Button>
        </div>
      </div>

      {/* Key Details */}
      <div className="flex-1 p-6">
        {adding ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Add Registry Key</h3>
              <Button variant="ghost" size="sm" onClick={() => setAdding(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div>
              <label className="text-sm text-muted-foreground">Path</label>
              <Input
                value={newForm.path}
                onChange={(e) => setNewForm(prev => ({ ...prev, path: e.target.value }))}
                placeholder="HKEY_LOCAL_MACHINE\\SOFTWARE\\..."
                className="font-mono"
              />
            </div>
            
            <div>
              <label className="text-sm text-muted-foreground">Name</label>
              <Input
                value={newForm.name}
                onChange={(e) => setNewForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="KeyName"
              />
            </div>
            
            <div>
              <label className="text-sm text-muted-foreground">Value</label>
              <Input
                value={newForm.value}
                onChange={(e) => setNewForm(prev => ({ ...prev, value: e.target.value }))}
                placeholder="Value"
              />
            </div>
            
            <div>
              <label className="text-sm text-muted-foreground">Type</label>
              <select
                value={newForm.type}
                onChange={(e) => setNewForm(prev => ({ ...prev, type: e.target.value as RegistryKey["type"] }))}
                className="w-full px-3 py-2 rounded-lg bg-background border border-border"
              >
                <option value="string">REG_SZ (String)</option>
                <option value="dword">REG_DWORD (32-bit)</option>
                <option value="binary">REG_BINARY</option>
              </select>
            </div>
            
            <Button onClick={handleAdd} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Add Key
            </Button>
          </div>
        ) : selectedKey ? (
          editing ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Edit Registry Key</h3>
                <Button variant="ghost" size="sm" onClick={() => { setEditing(false); setSelectedKey(null); }}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground">Name</label>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground">Value</label>
                <Input
                  value={editForm.value}
                  onChange={(e) => setEditForm(prev => ({ ...prev, value: e.target.value }))}
                />
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground">Type</label>
                <select
                  value={editForm.type}
                  onChange={(e) => setEditForm(prev => ({ ...prev, type: e.target.value as RegistryKey["type"] }))}
                  className="w-full px-3 py-2 rounded-lg bg-background border border-border"
                >
                  <option value="string">REG_SZ (String)</option>
                  <option value="dword">REG_DWORD (32-bit)</option>
                  <option value="binary">REG_BINARY</option>
                </select>
              </div>
              
              <Button onClick={handleSaveEdit} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-2">{selectedKey.name}</h3>
                <p className="text-sm text-muted-foreground font-mono">{selectedKey.path}</p>
              </div>
              
              {selectedKey.critical && (
                <div className="mb-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Critical system key - Cannot be modified or deleted
                </div>
              )}
              
              <div className="space-y-4">
                <div className="p-4 rounded-lg glass-panel">
                  <div className="text-xs text-muted-foreground mb-1">Type</div>
                  <div className="font-mono">
                    {selectedKey.type === "string" ? "REG_SZ" : selectedKey.type === "dword" ? "REG_DWORD" : "REG_BINARY"}
                  </div>
                </div>
                
                <div className="p-4 rounded-lg glass-panel">
                  <div className="text-xs text-muted-foreground mb-1">Value</div>
                  <div className="font-mono break-all">{selectedKey.value}</div>
                </div>
              </div>
              
              {!selectedKey.critical && (
                <div className="flex gap-2 mt-6">
                  <Button onClick={() => handleEdit(selectedKey)} className="flex-1">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button onClick={() => handleDelete(selectedKey)} variant="destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          )
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            Select a registry key to view details
          </div>
        )}
      </div>
    </div>
  );
};
