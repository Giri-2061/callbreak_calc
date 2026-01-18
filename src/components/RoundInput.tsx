import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface RoundInputProps {
  players: string[];
  onAddRound: (bids: number[], tricks: number[]) => void;
  roundNumber: number;
}

export function RoundInput({ players, onAddRound, roundNumber }: RoundInputProps) {
  const [bids, setBids] = useState<string[]>(["", "", "", ""]);
  const [tricks, setTricks] = useState<string[]>(["", "", "", ""]);
  const [error, setError] = useState<string>("");

  const handleSubmit = () => {
    setError("");
    
    const parsedBids = bids.map(b => parseInt(b) || 0);
    const parsedTricks = tricks.map(t => parseInt(t) || 0);

    // Validate bids (1-13)
    if (parsedBids.some(b => b < 1 || b > 13)) {
      setError("Bids must be between 1 and 13");
      return;
    }

    // Validate tricks sum = 13
    const tricksSum = parsedTricks.reduce((a, b) => a + b, 0);
    if (tricksSum !== 13) {
      setError(`Tricks must total 13 (currently ${tricksSum})`);
      return;
    }

    onAddRound(parsedBids, parsedTricks);
    setBids(["", "", "", ""]);
    setTricks(["", "", "", ""]);
  };

  const updateBid = (index: number, value: string) => {
    const newBids = [...bids];
    newBids[index] = value;
    setBids(newBids);
  };

  const updateTricks = (index: number, value: string) => {
    const newTricks = [...tricks];
    newTricks[index] = value;
    setTricks(newTricks);
  };

  const tricksSum = tricks.reduce((sum, t) => sum + (parseInt(t) || 0), 0);

  return (
    <div className="card-table rounded-xl p-6 border border-border suit-pattern">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-display font-bold flex items-center gap-2">
          <span className="text-2xl">🎴</span>
          Round {roundNumber}
        </h2>
        <div className={`text-sm px-3 py-1 rounded-full ${
          tricksSum === 13 
            ? "bg-success/20 text-success" 
            : tricksSum > 13 
              ? "bg-destructive/20 text-destructive" 
              : "bg-muted text-muted-foreground"
        }`}>
          Tricks: {tricksSum}/13
        </div>
      </div>

      {/* Headers */}
      <div className="grid grid-cols-[1fr_80px_80px] gap-2 mb-2 text-xs text-muted-foreground uppercase tracking-wider">
        <div>Player</div>
        <div className="text-center">Bid</div>
        <div className="text-center">Won</div>
      </div>

      {/* Player inputs */}
      <div className="space-y-2 mb-4">
        {players.map((player, index) => (
          <div key={index} className="grid grid-cols-[1fr_80px_80px] gap-2 items-center">
            <span className="font-medium truncate">{player}</span>
            <Input
              type="number"
              min={1}
              max={13}
              value={bids[index]}
              onChange={(e) => updateBid(index, e.target.value)}
              placeholder="1-13"
              className="bg-secondary border-border text-center"
            />
            <Input
              type="number"
              min={0}
              max={13}
              value={tricks[index]}
              onChange={(e) => updateTricks(index, e.target.value)}
              placeholder="0-13"
              className="bg-secondary border-border text-center"
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

      {/* Submit button */}
      <Button 
        onClick={handleSubmit}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-lg gap-2"
      >
        <Plus className="w-5 h-5" />
        Add Round
      </Button>
    </div>
  );
}
