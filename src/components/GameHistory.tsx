import { Button } from "@/components/ui/button";
import { Trophy, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { useState } from "react";

interface CompletedGame {
  id: string;
  date: string;
  players: string[];
  finalScores: number[];
  winner: string;
  winnerScore: number;
  rounds: {
    bids: number[];
    tricks: number[];
    scores: number[];
  }[];
}

interface GameHistoryProps {
  games: CompletedGame[];
  onDeleteGame: (id: string) => void;
}

export function GameHistory({ games, onDeleteGame }: GameHistoryProps) {
  const [expandedGame, setExpandedGame] = useState<string | null>(null);

  if (games.length === 0) {
    return (
      <div className="card-table rounded-xl p-6 border border-border text-center">
        <div className="text-5xl mb-3 animate-float">📜</div>
        <h3 className="text-lg font-semibold mb-2">No games played yet</h3>
        <p className="text-muted-foreground text-sm">
          Complete 5 rounds to finish a game!
        </p>
      </div>
    );
  }

  return (
    <div className="card-table rounded-xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border bg-secondary/30">
        <h2 className="font-display font-bold text-lg flex items-center gap-2">
          <span>🏆</span> Game History ({games.length} games)
        </h2>
      </div>
      
      <div className="divide-y divide-border/50 max-h-[400px] overflow-y-auto">
        {games.map((game) => (
          <div key={game.id} className="hover:bg-muted/20 transition-colors">
            <div 
              className="p-4 cursor-pointer flex items-center justify-between"
              onClick={() => setExpandedGame(expandedGame === game.id ? null : game.id)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold flex items-center gap-2">
                    {game.winner} 
                    <span className="text-primary font-bold">{game.winnerScore.toFixed(1)} pts</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{game.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteGame(game.id);
                  }}
                  className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                {expandedGame === game.id ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
            </div>

            {expandedGame === game.id && (
              <div className="px-4 pb-4 animate-bounce-in">
                <div className="bg-muted/30 rounded-lg p-3">
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {game.players.map((player, i) => (
                      <div 
                        key={i} 
                        className={`text-sm p-2 rounded ${
                          game.finalScores[i] === game.winnerScore 
                            ? "bg-primary/20 border border-primary/30" 
                            : "bg-muted/50"
                        }`}
                      >
                        <span className="text-muted-foreground">{player}:</span>
                        <span className={`ml-2 font-bold ${
                          game.finalScores[i] >= 0 ? "text-success" : "text-destructive"
                        }`}>
                          {game.finalScores[i].toFixed(1)}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-muted/50">
                    <p className="text-xs font-semibold text-foreground mb-2">Round Details:</p>
                    <div className="space-y-2">
                      {game.rounds.map((round, roundIdx) => (
                        <div key={roundIdx} className="bg-background/50 rounded p-2">
                          <p className="text-xs font-bold text-primary mb-1">Round {roundIdx + 1}</p>
                          <div className="grid grid-cols-1 gap-1">
                            {game.players.map((player, playerIdx) => {
                              const bid = round.bids[playerIdx];
                              const tricks = round.tricks[playerIdx];
                              const score = round.scores[playerIdx];
                              const success = tricks >= bid;
                              return (
                                <div key={playerIdx} className="flex justify-between items-center text-xs">
                                  <span className="text-muted-foreground">{player}:</span>
                                  <span className="text-muted-foreground">Bid {bid} • Won {tricks}</span>
                                  <span className={`font-bold ${success ? "text-success" : "text-destructive"}`}>
                                    {score > 0 ? "+" : ""}{score.toFixed(1)}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}