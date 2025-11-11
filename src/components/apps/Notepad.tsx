import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, FileText } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const Notepad = () => {
  const [content, setContent] = useState("");

  const handleSave = () => {
    toast.success("Note saved successfully!");
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="border-b border-border p-2 flex items-center gap-2">
        <FileText className="w-4 h-4" />
        <span className="text-sm font-mono">NOTEPAD.TXT</span>
        <Button size="sm" variant="outline" className="ml-auto" onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type your notes here..."
        className="flex-1 border-none rounded-none resize-none focus-visible:ring-0 font-mono"
      />
    </div>
  );
};
