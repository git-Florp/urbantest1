import { useEffect, useState } from "react";

interface RebootScreenProps {
  onComplete: () => void;
}

export const RebootScreen = ({ onComplete }: RebootScreenProps) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [stage, setStage] = useState<"commands" | "black">("commands");

  const rebootMessages = [
    { text: "[  OK  ] Stopping all processes", duration: 800 },
    { text: "[  OK  ] Unmounting file systems", duration: 1200 },
    { text: "[  OK  ] Stopping containment systems", duration: 1500 },
    { text: "[  OK  ] Stopping security services", duration: 900 },
    { text: "[  OK  ] Stopping network services", duration: 1100 },
    { text: "[  OK  ] Flushing system cache", duration: 700 },
    { text: "[  OK  ] Reached target Reboot", duration: 600 },
    { text: "", duration: 300 },
    { text: "[ INFO ] System restart initiated", duration: 800 },
    { text: "[ INFO ] Preparing for reboot...", duration: 1000 },
    { text: "", duration: 500 },
    { text: "Reboot in progress...", duration: 1500 },
  ];

  useEffect(() => {
    let currentIndex = 0;
    
    const showNextMessage = () => {
      if (currentIndex < rebootMessages.length) {
        setMessages(prev => [...prev, rebootMessages[currentIndex].text]);
        const duration = rebootMessages[currentIndex].duration;
        currentIndex++;
        setTimeout(showNextMessage, duration);
      } else {
        setTimeout(() => {
          setStage("black");
          setTimeout(onComplete, 3000);
        }, 1000);
      }
    };

    showNextMessage();
  }, [onComplete]);

  if (stage === "black") {
    return <div className="fixed inset-0 bg-black" />;
  }

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center text-white font-mono">
      <div className="w-full max-w-3xl px-8">
        <div className="space-y-1 mb-6">
          {messages.map((msg, i) => (
            <div key={i} className="text-sm text-yellow-400 animate-fade-in">
              {msg}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
