import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GameHeaderProps {
  roundsPlayed: number;
  maxRounds: number;
  onReset: () => void;
}

export function GameHeader({ roundsPlayed, maxRounds, onReset }: GameHeaderProps) {
  return (
    <header className="text-center mb-8">
      {/* Card suits decoration */}
      <div className="flex justify-center gap-2 mb-4 text-3xl">
        <span className="animate-float" style={{ animationDelay: "0ms" }}>♠️</span>
        <span className="text-destructive animate-float" style={{ animationDelay: "100ms" }}>♥️</span>
        <span className="text-destructive animate-float" style={{ animationDelay: "200ms" }}>♦️</span>
        <span className="animate-float" style={{ animationDelay: "300ms" }}>♣️</span>
      </div>

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-display font-black mb-2">
        <span className="red-text">Call Break</span>
      </h1>
      <h2 className="text-xl md:text-2xl font-display text-muted-foreground mb-4">
        Score Calculator
      </h2>

      {/* Stats bar */}
      <div className="flex items-center justify-center gap-4 flex-wrap">
        <div className="bg-secondary/50 px-4 py-2 rounded-full flex items-center gap-2">
          <span className="text-xl">🎯</span>
          <span className="font-semibold">{roundsPlayed}/{maxRounds}</span>
          <span className="text-muted-foreground text-sm">Rounds</span>
        </div>

        {/* Progress indicator */}
        <div className="bg-secondary/50 px-4 py-2 rounded-full">
          <div className="flex gap-1">
            {Array.from({ length: maxRounds }).map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all ${
                  i < roundsPlayed 
                    ? "bg-primary red-glow" 
                    : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>
        
        {roundsPlayed > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="border-destructive/50 text-destructive hover:bg-destructive/10 gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            New Game
          </Button>
        )}
      </div>
    </header>
  );
}
