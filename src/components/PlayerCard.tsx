import { useState } from "react";
import { Input } from "@/components/ui/input";

interface PlayerCardProps {
  playerIndex: number;
  name: string;
  totalScore: number;
  onNameChange: (name: string) => void;
  suit: string;
  isLeader: boolean;
  isDealer?: boolean;
  isGameWinner?: boolean;
}

const suitColors: Record<string, string> = {
  "♠": "text-foreground",
  "♥": "text-destructive",
  "♦": "text-destructive",
  "♣": "text-foreground",
};

export function PlayerCard({ playerIndex, name, totalScore, onNameChange, suit, isLeader, isDealer, isGameWinner }: PlayerCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div 
      className={`card-table rounded-xl p-4 border-2 transition-all duration-300 relative ${
        isLeader 
          ? "border-primary red-glow animate-pulse-red" 
          : isGameWinner
          ? "border-primary red-glow"
          : isDealer
          ? "border-amber-500/50 hover:border-amber-500"
          : "border-border hover:border-primary/50"
      }`}
    >
      {/* Suit decoration */}
      <div className={`text-4xl opacity-20 absolute top-2 right-2 ${suitColors[suit]}`}>
        {suit}
      </div>
      
      {/* Player number badge */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
          P{playerIndex + 1}
        </span>
        {isDealer && (
          <span className="text-xs bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded-full animate-bounce-in">
            🂡 Dealer
          </span>
        )}
      </div>

      {/* Player name */}
      {isEditing ? (
        <Input
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          onBlur={() => setIsEditing(false)}
          onKeyDown={(e) => e.key === "Enter" && setIsEditing(false)}
          autoFocus
          className="bg-secondary border-primary/30 text-lg font-semibold mb-2"
          maxLength={12}
        />
      ) : (
        <h3 
          onClick={() => setIsEditing(true)}
          className="text-lg font-semibold truncate cursor-pointer hover:text-primary transition-colors mb-2"
          title="Click to edit name"
        >
          {name || `Player ${playerIndex + 1}`}
        </h3>
      )}

      {/* Total score */}
      <div className="relative">
        <p className="text-3xl font-display font-bold red-text">
          {totalScore.toFixed(1)}
        </p>
        <p className="text-xs text-muted-foreground uppercase tracking-wider">
          Total Score
        </p>
      </div>
    </div>
  );
}
