import { Button } from "@/components/ui/button";
import { Trophy, RotateCcw, Star } from "lucide-react";

interface GameCompleteProps {
  players: string[];
  finalScores: number[];
  onNewGame: () => void;
}

export function GameComplete({ players, finalScores, onNewGame }: GameCompleteProps) {
  const maxScore = Math.max(...finalScores);
  const winnerIndex = finalScores.indexOf(maxScore);
  const sortedPlayers = players
    .map((p, i) => ({ name: p, score: finalScores[i], index: i }))
    .sort((a, b) => b.score - a.score);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-bounce-in">
      <div className="card-table rounded-2xl border-2 border-primary/50 p-6 md:p-8 max-w-md w-full text-center red-glow">
        {/* Celebration header */}
        <div className="mb-6">
          <div className="text-6xl animate-float mb-4">🏆</div>
          <h2 className="text-2xl md:text-3xl font-display font-bold mb-2">
            Game Complete!
          </h2>
          <p className="text-muted-foreground">5 rounds played</p>
        </div>

        {/* Winner announcement */}
        <div className="bg-primary/20 border border-primary/40 rounded-xl p-4 mb-6 animate-pulse-red">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-primary">WINNER</span>
            <Trophy className="w-6 h-6 text-primary" />
          </div>
          <p className="text-2xl font-display font-bold">{players[winnerIndex]}</p>
          <p className="text-3xl font-bold red-text mt-1">
            {maxScore.toFixed(1)} points
          </p>
        </div>

        {/* All players ranking */}
        <div className="space-y-2 mb-6">
          {sortedPlayers.map((player, rank) => (
            <div 
              key={player.index}
              className={`flex items-center justify-between p-3 rounded-lg ${
                rank === 0 
                  ? "bg-primary/10 border border-primary/30" 
                  : "bg-muted/30"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                  rank === 0 ? "bg-primary text-primary-foreground" :
                  rank === 1 ? "bg-secondary text-foreground" :
                  rank === 2 ? "bg-secondary text-foreground" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {rank + 1}
                </span>
                <span className={rank === 0 ? "font-bold" : ""}>{player.name}</span>
                {rank === 0 && <Star className="w-4 h-4 text-primary" />}
              </div>
              <span className={`font-bold ${
                player.score >= 0 ? "text-success" : "text-destructive"
              }`}>
                {player.score.toFixed(1)}
              </span>
            </div>
          ))}
        </div>

        {/* New game button */}
        <Button 
          onClick={onNewGame}
          size="lg"
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-lg gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          Start New Game
        </Button>
      </div>
    </div>
  );
}