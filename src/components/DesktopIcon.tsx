import { App } from "./Desktop";

interface DesktopIconProps {
  app: App;
  onOpen: (app: App) => void;
}

export const DesktopIcon = ({ app, onOpen }: DesktopIconProps) => {
  return (
    <div
      className="w-30 flex flex-col items-center gap-2 text-center cursor-default select-none group"
      onDoubleClick={() => app.run()}
    >
      <div className="w-22 h-22 rounded-xl glass-panel flex items-center justify-center text-primary group-hover:urbanshade-glow transition-all">
        {app.icon}
      </div>
      <div className="text-xs text-muted-foreground">{app.name}</div>
    </div>
  );
};
