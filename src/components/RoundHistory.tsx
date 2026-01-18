import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Round {
  bids: number[];
  hands: number[];
  scores: number[];
}

interface RoundHistoryProps {
  rounds: Round[];
  players: string[];
  onDeleteRound: (index: number) => void;
}

export function RoundHistory({ rounds, players, onDeleteRound }: RoundHistoryProps) {
  if (rounds.length === 0) {
    return (
      <div className="card-table rounded-xl p-8 border border-border text-center">
        <div className="text-6xl mb-4 animate-float">🃏</div>
        <h3 className="text-lg font-semibold mb-2">No rounds yet</h3>
        <p className="text-muted-foreground text-sm">
          Start playing and add your first round!
        </p>
      </div>
    );
  }

  return (
    <div className="card-table rounded-xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border bg-secondary/30">
        <h2 className="font-display font-bold text-lg flex items-center gap-2">
          <span>📊</span> Round History
        </h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="p-3 text-left font-semibold">Round</th>
              {players.map((player, i) => (
                <th key={i} className="p-3 text-center font-semibold min-w-[100px]">
                  {player}
                </th>
              ))}
              <th className="p-3 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {rounds.map((round, roundIndex) => (
              <tr 
                key={roundIndex} 
                className="border-b border-border/50 hover:bg-muted/30 transition-colors animate-bounce-in"
                style={{ animationDelay: `${roundIndex * 50}ms` }}
              >
                <td className="p-3">
                  <span className="bg-primary/20 text-primary px-2 py-1 rounded-full text-xs font-bold">
                    R{roundIndex + 1}
                  </span>
                </td>
                {round.scores.map((score, playerIndex) => {
                  const bid = round.bids[playerIndex];
                  const hands = round.hands[playerIndex];
                  const success = hands >= bid;
                  
                  return (
                    <td key={playerIndex} className="p-3 text-center">
                      <div className={`inline-flex flex-col items-center px-3 py-1 rounded-lg ${
                        success ? "bg-success/20" : "bg-destructive/20"
                      }`}>
                        <span className={`font-bold ${
                          success ? "text-success" : "text-destructive"
                        }`}>
                          {score > 0 ? "+" : ""}{score.toFixed(1)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {bid}→{hands}
                        </span>
                      </div>
                    </td>
                  );
                })}
                <td className="p-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteRound(roundIndex)}
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
