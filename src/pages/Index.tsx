import { useState, useCallback, useEffect } from "react";
import { GameHeader } from "@/components/GameHeader";
import { PlayerCard } from "@/components/PlayerCard";
import { RoundInput } from "@/components/RoundInput";
import { RoundHistory } from "@/components/RoundHistory";
import { GameComplete } from "@/components/GameComplete";
import { GameHistory } from "@/components/GameHistory";
import { toast } from "sonner";

interface Round {
  bids: number[];
  tricks: number[];
  scores: number[];
}

interface CompletedGame {
  id: string;
  date: string;
  players: string[];
  finalScores: number[];
  winner: string;
  winnerScore: number;
  rounds: Round[];
}

const SUITS = ["♠", "♥", "♦", "♣"];
const MAX_ROUNDS = 5;
const STORAGE_KEY = "callbreak-game-history";

const calculateScore = (bid: number, tricks: number): number => {
  if (tricks >= bid) {
    return bid + (tricks - bid) * 0.1;
  } else {
    return -bid;
  }
};

const loadGameHistory = (): CompletedGame[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveGameHistory = (games: CompletedGame[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
};

export default function Index() {
  const [players, setPlayers] = useState<string[]>([
    "Player 1", "Player 2", "Player 3", "Player 4"
  ]);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [gameComplete, setGameComplete] = useState(false);
  const [gameHistory, setGameHistory] = useState<CompletedGame[]>([]);

  // Load game history on mount
  useEffect(() => {
    setGameHistory(loadGameHistory());
  }, []);

  const totalScores = players.map((_, playerIndex) => 
    rounds.reduce((sum, round) => sum + round.scores[playerIndex], 0)
  );

  const leaderIndex = totalScores.indexOf(Math.max(...totalScores));

  const handleNameChange = useCallback((index: number, name: string) => {
    setPlayers(prev => {
      const newPlayers = [...prev];
      newPlayers[index] = name;
      return newPlayers;
    });
  }, []);

  const handleAddRound = useCallback((bids: number[], tricks: number[], isAutoRound?: boolean) => {
    const scores = bids.map((bid, i) => calculateScore(bid, tricks[i]));
    const newRounds = [...rounds, { bids, tricks, scores }];
    
    setRounds(newRounds);
    
    if (isAutoRound) {
      toast.success(
        `Round ${rounds.length + 1} - Auto Round! ⚡`,
        { description: `Bids = 9! Everyone gets their bid points.` }
      );
    } else {
      const maxScore = Math.max(...scores);
      const winners = scores
        .map((s, i) => s === maxScore ? players[i] : null)
        .filter(Boolean);
      
      toast.success(
        `Round ${rounds.length + 1} complete! 🎉`,
        { description: `${winners.join(" & ")} won with ${maxScore.toFixed(1)} points` }
      );
    }

    // Check if game is complete (5 rounds)
    if (newRounds.length >= MAX_ROUNDS) {
      const finalScores = players.map((_, playerIndex) => 
        newRounds.reduce((sum, round) => sum + round.scores[playerIndex], 0)
      );
      const maxFinalScore = Math.max(...finalScores);
      const winnerIndex = finalScores.indexOf(maxFinalScore);

      // Save to history
      const completedGame: CompletedGame = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        players: [...players],
        finalScores,
        winner: players[winnerIndex],
        winnerScore: maxFinalScore,
        rounds: newRounds
      };

      const updatedHistory = [completedGame, ...gameHistory];
      setGameHistory(updatedHistory);
      saveGameHistory(updatedHistory);

      setTimeout(() => setGameComplete(true), 500);
    }
  }, [rounds, players, gameHistory]);

  const handleDeleteRound = useCallback((index: number) => {
    setRounds(prev => prev.filter((_, i) => i !== index));
    toast.info("Round deleted");
  }, []);

  const handleDeleteGame = useCallback((id: string) => {
    const updated = gameHistory.filter(g => g.id !== id);
    setGameHistory(updated);
    saveGameHistory(updated);
    toast.info("Game deleted from history");
  }, [gameHistory]);

  const handleNewGame = useCallback(() => {
    setRounds([]);
    setGameComplete(false);
    toast.success("New game started! 🃏");
  }, []);

  const handleReset = useCallback(() => {
    if (window.confirm("Start a new game? This will clear all scores.")) {
      handleNewGame();
    }
  }, [handleNewGame]);

  return (
    <div className="min-h-screen p-4 md:p-8 suit-pattern">
      {gameComplete && (
        <GameComplete
          players={players}
          finalScores={totalScores}
          onNewGame={handleNewGame}
        />
      )}

      <div className="max-w-4xl mx-auto">
        <GameHeader 
          roundsPlayed={rounds.length}
          maxRounds={MAX_ROUNDS}
          onReset={handleReset}
        />

        {/* Player Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          {players.map((player, index) => (
            <PlayerCard
              key={index}
              playerIndex={index}
              name={player}
              totalScore={totalScores[index]}
              onNameChange={(name) => handleNameChange(index, name)}
              suit={SUITS[index]}
              isLeader={rounds.length > 0 && index === leaderIndex}
            />
          ))}
        </div>

        {/* Main content */}
        {rounds.length < MAX_ROUNDS ? (
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <RoundInput
              players={players}
              onAddRound={handleAddRound}
              roundNumber={rounds.length + 1}
            />
            <RoundHistory
              rounds={rounds}
              players={players}
              onDeleteRound={handleDeleteRound}
            />
          </div>
        ) : (
          <div className="card-table rounded-xl p-8 border border-border text-center mb-6">
            <div className="text-5xl mb-4">🎊</div>
            <h3 className="text-xl font-display font-bold mb-2">Game Complete!</h3>
            <p className="text-muted-foreground">View your results above</p>
          </div>
        )}

        {/* Game History */}
        <div className="mb-6">
          <GameHistory 
            games={gameHistory}
            onDeleteGame={handleDeleteGame}
          />
        </div>

        {/* Footer with Rules */}
        <footer className="space-y-3">
          <div className="text-center text-muted-foreground text-sm">
            <p>♠ ♥ ♦ ♣ • {MAX_ROUNDS}-round game • Bid 1-13 • ♣ ♦ ♥ ♠</p>
          </div>
          
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 text-sm">
            <h4 className="font-semibold text-foreground mb-2 text-center">📖 Scoring Rules</h4>
            <div className="grid md:grid-cols-3 gap-3 text-muted-foreground">
              <div className="text-center">
                <span className="text-success font-medium">✓ Make Bid</span>
                <p className="text-xs mt-1">Bid 3, Win 3 = <strong className="text-foreground">3.0 pts</strong></p>
              </div>
              <div className="text-center">
                <span className="text-blue-400 font-medium">★ Over-tricks</span>
                <p className="text-xs mt-1">Bid 3, Win 5 = <strong className="text-foreground">3.2 pts</strong></p>
              </div>
              <div className="text-center">
                <span className="text-destructive font-medium">✗ Bust</span>
                <p className="text-xs mt-1">Bid 4, Win 2 = <strong className="text-foreground">-4.0 pts</strong></p>
              </div>
            </div>
          </div>

          <div className="text-center text-xs text-muted-foreground/70 space-y-1">
            <p className="italic">Redeal if: No Spades • No Face Cards (J,Q,K,A) • Total bids &lt; 8</p>
            <p className="text-warning">⚡ Auto Round: If total bids = 9, each player gets their bid points</p>
          </div>
        </footer>
      </div>
    </div>
  );
}