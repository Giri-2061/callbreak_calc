import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Zap } from "lucide-react";
import { useRef } from "react";

interface RoundInputProps {
  players: string[];
  onAddRound: (bids: number[], hands: number[], isAutoRound?: boolean) => void;
  roundNumber: number;
}

export function RoundInput({ players, onAddRound, roundNumber }: RoundInputProps) {
  const [bids, setBids] = useState<string[]>(["", "", "", ""]);
  const [hands, setHands] = useState<string[]>(["", "", "", ""]);
  const [error, setError] = useState<string>("");
  const bidRefs = useRef<(HTMLInputElement | null)[]>([]);
  const handsRefs = useRef<(HTMLInputElement | null)[]>([]);

  const parsedBids = bids.map(b => parseInt(b) || 0);
  const bidsSum = parsedBids.reduce((a, b) => a + b, 0);
  const allBidsValid = parsedBids.every(b => b >= 1 && b <= 13);
  const isAutoRound = bidsSum === 9 && allBidsValid;

  const handleAutoRound = () => {
    setError("");
    // Auto round: each player gets exactly their bid
    onAddRound(parsedBids, parsedBids, true);
    setBids(["", "", "", ""]);
    setHands(["", "", "", ""]);
  };

  const handleSubmit = () => {
    setError("");
    
    const parsedHands = hands.map(t => parseInt(t) || 0);

    // Validate bids (1-13)
    if (parsedBids.some(b => b < 1 || b > 13)) {
      setError("Bids must be between 1 and 13");
      return;
    }

    // Validate bid sum >= 9
    if (bidsSum < 9) {
      setError(`Total bids must be at least 9 (currently ${bidsSum})`);
      return;
    }

    // Validate hands sum = 13
    const handsSum = parsedHands.reduce((a, b) => a + b, 0);
    if (handsSum !== 13) {
      setError(`Hands must total 13 (currently ${handsSum})`);
      return;
    }

    onAddRound(parsedBids, parsedHands);
    setBids(["", "", "", ""]);
    setHands(["", "", "", ""]);
  };

  const updateBid = (index: number, value: string) => {
    const newBids = [...bids];
    newBids[index] = value;
    setBids(newBids);
  };

  const updateHands = (index: number, value: string) => {
    const newHands = [...hands];
    newHands[index] = value;
    setHands(newHands);
  };

  const handleBidKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (index < players.length - 1) {
        bidRefs.current[index + 1]?.focus();
      } else {
        handsRefs.current[0]?.focus();
      }
    }
  };

  const handleHandsKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (index < players.length - 1) {
        handsRefs.current[index + 1]?.focus();
      } else {
        handleSubmit();
      }
    }
  };

  const handsSum = hands.reduce((sum, t) => sum + (parseInt(t) || 0), 0);

  return (
    <div className="card-table rounded-xl p-6 border border-border suit-pattern">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-display font-bold flex items-center gap-2">
          <span className="text-2xl">🎴</span>
          Round {roundNumber}
        </h2>
        <div className="flex items-center gap-2">
          {isAutoRound && (
            <div className="text-xs px-2 py-1 rounded-full bg-warning/20 text-warning animate-pulse">
              ⚡ Auto Round!
            </div>
          )}
          <div className={`text-sm px-3 py-1 rounded-full ${
            handsSum === 13 
              ? "bg-success/20 text-success" 
              : handsSum > 13 
                ? "bg-destructive/20 text-destructive" 
                : "bg-muted text-muted-foreground"
          }`}>
            Hands: {handsSum}/13
          </div>
        </div>
      </div>

      {/* Auto Round Alert */}
      {isAutoRound && (
        <div className="bg-warning/10 border border-warning/30 rounded-lg p-3 mb-4 text-center">
          <p className="text-warning text-sm font-medium">
            ⚡ Total bids = 9! Auto round available
          </p>
          <p className="text-warning/70 text-xs mt-1">
            Each player gets their bid as points, no tricks played
          </p>
        </div>
      )}

      {/* Headers */}
      <div className="grid grid-cols-[1fr_80px_80px] gap-2 mb-2 text-xs text-muted-foreground uppercase tracking-wider">
        <div>Player</div>
        <div className="text-center">Bid</div>
        <div className="text-center">Hands</div>
      </div>

      {/* Player inputs */}
      <div className="space-y-2 mb-4">
        {players.map((player, index) => (
          <div key={index} className="grid grid-cols-[1fr_80px_80px] gap-2 items-center">
            <span className="font-medium truncate">{player}</span>
            <Input
              ref={(el) => { bidRefs.current[index] = el; }}
              type="number"
              min={1}
              max={13}
              value={bids[index]}
              onChange={(e) => updateBid(index, e.target.value)}
              onKeyDown={(e) => handleBidKeyDown(index, e)}
              placeholder="1-13"
              className="bg-secondary border-border text-center"
            />
            <Input
              ref={(el) => { handsRefs.current[index] = el; }}
              type="number"
              min={0}
              max={13}
              value={hands[index]}
              onChange={(e) => updateHands(index, e.target.value)}
              onKeyDown={(e) => handleHandsKeyDown(index, e)}
              placeholder="0-13"
              className={`bg-secondary border-border text-center ${isAutoRound ? "opacity-50" : ""}`}
              disabled={isAutoRound}
            />
          </div>
        ))}
      </div>

      {/* Error message */}
      {error && (
        <p className="text-destructive text-sm mb-3 animate-bounce-in">
          ⚠️ {error}
        </p>
      )}

      {/* Submit buttons */}
      <div className="space-y-2">
        {isAutoRound ? (
          <Button 
            onClick={handleAutoRound}
            className="w-full bg-warning text-warning-foreground hover:bg-warning/90 font-semibold text-lg gap-2"
          >
            <Zap className="w-5 h-5" />
            Apply Auto Round
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-lg gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Round
          </Button>
        )}
      </div>
    </div>
  );
}
