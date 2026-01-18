import { Button } from "@/components/ui/button";
import { Trophy, RotateCcw, Star } from "lucide-react";

interface GameCompleteProps {
  players: string[];
  finalScores: number[];
  onNewGame: () => void;
  onViewHistory?: () => void;
}

export function GameComplete({ players, finalScores, onNewGame, onViewHistory }: GameCompleteProps) {
  const maxScore = Math.max(...finalScores);
  const winnerIndex = finalScores.indexOf(maxScore);
  const sortedPlayers = players
    .map((p, i) => ({ name: p, score: finalScores[i], index: i }))
    .sort((a, b) => b.score - a.score);

  const winnerMessages = [
    "Absolutely dominant! 👑",
    "Pure skill on display! 🎯",
    "Unstoppable force! ⚡",
    "The master of CallBreak! 🧙",
    "Too good, too fast, too strong! 💪",
    "Your opponents had no chance! 😎",
    "Legendary performance! 🌟",
    "Bow down to royalty! 👸",
  ];

  const loserMessages = [
    "Great effort! Better luck next time! 💪",
    "You fought hard! Keep practicing! 🎯",
    "Close game! Almost had them! 🔥",
    "Not today, but tomorrow's your day! 🚀",
    "Good try warrior! Back for more! ⚔️",
    "You'll get 'em next round! 💥",
    "Respect the grind! Keep climbing! 📈",
    "One step closer to victory! 🏃",
  ];

  const getRandomMessage = (messages: string[]) => {
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const winnerMessage = getRandomMessage(winnerMessages);
  const getLoserMessage = (rank: number) => {
    if (rank === sortedPlayers.length - 1) {
      return "Don't worry, everyone has their day! 🌈";
    }
    return getRandomMessage(loserMessages);
  };

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
        <div className="bg-yellow-500/15 border-2 border-yellow-500/60 rounded-xl p-4 mb-4 animate-pulse-red shadow-lg shadow-yellow-500/30">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <span className="text-xl font-bold text-yellow-500">🥇 WINNER 🥇</span>
            <Trophy className="w-6 h-6 text-yellow-500" />
          </div>
          <p className="text-2xl font-display font-bold">{players[winnerIndex]}</p>
          <p className="text-3xl font-bold text-yellow-500 mt-1">
            {maxScore.toFixed(1)} points
          </p>
          <p className="text-sm text-yellow-400 mt-2 italic font-semibold">
            "{winnerMessage}"
          </p>
        </div>

        {/* All players ranking */}
        <div className="space-y-2 mb-6">
          {sortedPlayers.map((player, rank) => {
            const medalColor = rank === 0 ? "yellow" : rank === 1 ? "gray" : rank === 2 ? "orange" : "muted";
            const medalEmoji = rank === 0 ? "🥇" : rank === 1 ? "🥈" : rank === 2 ? "🥉" : "";
            const glowClass = rank === 0 ? "shadow-md shadow-yellow-500/40 border-yellow-500/50" :
                            rank === 1 ? "shadow-md shadow-gray-400/30 border-gray-400/50" :
                            rank === 2 ? "shadow-md shadow-orange-600/30 border-orange-600/50" :
                            "border-muted/30";
            const personMessage = rank === 0 ? winnerMessage : getLoserMessage(rank);
            
            return (
              <div 
                key={player.index}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                  rank === 0 
                    ? `bg-yellow-500/15 ${glowClass}` 
                    : rank === 1
                    ? `bg-gray-400/15 ${glowClass}`
                    : rank === 2
                    ? `bg-orange-600/15 ${glowClass}`
                    : `bg-muted/30 ${glowClass}`
                }`}
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                    rank === 0 ? "bg-yellow-500/50 text-yellow-100" :
                    rank === 1 ? "bg-gray-400/50 text-gray-100" :
                    rank === 2 ? "bg-orange-600/50 text-orange-100" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {rank + 1}
                  </span>
                  <div className="flex-1">
                    <p className={`font-semibold text-sm ${rank === 0 ? "font-bold" : ""}`}>{player.name}</p>
                    <p className={`text-xs ${rank === 0 ? "text-yellow-400" : "text-muted-foreground"}`}>
                      {personMessage}
                    </p>
                  </div>
                </div>
                <span className={`font-bold text-right ${
                  player.score >= 0 ? "text-success" : "text-destructive"
                }`}>
                  {player.score.toFixed(1)}
                </span>
              </div>
            );
          })}
        </div>

        {/* New game button */}
        <div className="space-y-2">
          <Button 
            onClick={onNewGame}
            size="lg"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-lg gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Start New Game
          </Button>
          {onViewHistory && (
            <Button 
              onClick={onViewHistory}
              size="lg"
              variant="outline"
              className="w-full font-semibold text-lg gap-2"
            >
              <span>📜</span>
              Check Game History
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}