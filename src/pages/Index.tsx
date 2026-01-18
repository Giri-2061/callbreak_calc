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
  const [dealerIndex, setDealerIndex] = useState(0);
  const [lastWinnerIndex, setLastWinnerIndex] = useState<number | null>(null);
  const [showStandings, setShowStandings] = useState(false);

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
    
    // Move dealer to next player
    setDealerIndex(prev => (prev + 1) % players.length);
    
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
      
      // Set last winner and reset dealer for next game
      setLastWinnerIndex(winnerIndex);
      setDealerIndex(winnerIndex);
      setShowStandings(false);

      setTimeout(() => setGameComplete(true), 500);
    } else if (newRounds.length === 4) {
      // Show standings after round 4
      setShowStandings(true);
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
    // If there was a previous winner, start next game with them as dealer
    // Otherwise reset to player 0
    if (lastWinnerIndex !== null) {
      setDealerIndex(lastWinnerIndex);
    } else {
      setDealerIndex(0);
    }
    toast.success("New game started! 🃏");
  }, [lastWinnerIndex]);

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
              isDealer={index === dealerIndex}
              isGameWinner={lastWinnerIndex === index && gameComplete}
            />
          ))}
        </div>

        {/* Main content */}
        {rounds.length < MAX_ROUNDS ? (
          <>
            {showStandings && rounds.length >= 4 && (
              <div className="card-table rounded-xl p-6 border border-border mb-6 animate-bounce-in bg-gradient-to-br from-primary/5 to-secondary/5">
                <div className="text-center mb-4">
                  <h2 className="text-2xl font-display font-bold mb-1">
                    {rounds.length === 4 ? "📊 Standings After Round 4" : "🏆 Final Standings"}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {rounds.length === 4 ? "Round 5 will decide the winner" : "Game will be decided by Round 5"}
                  </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {players
                    .map((player, index) => ({
                      player,
                      score: totalScores[index],
                      index
                    }))
                    .sort((a, b) => b.score - a.score)
                    .map((item, rank) => (
                      <div
                        key={item.index}
                        className={`p-3 rounded-lg border-2 text-center transition-all ${
                          rank === 0
                            ? "bg-yellow-500/15 border-yellow-500/60 shadow-lg shadow-yellow-500/30 scale-105"
                            : rank === 1
                            ? "bg-gray-400/15 border-gray-400/60 shadow-md shadow-gray-400/20"
                            : rank === 2
                            ? "bg-orange-600/15 border-orange-600/60 shadow-md shadow-orange-600/20"
                            : "bg-muted/10 border-muted/30"
                        }`}
                      >
                        <div className="text-2xl mb-1">
                          {rank === 0 ? "🥇" : rank === 1 ? "🥈" : rank === 2 ? "🥉" : ""}
                        </div>
                        <p className="font-semibold text-sm truncate">{item.player}</p>
                        <p className={`text-lg font-bold mt-1 ${
                          rank === 0 ? "text-primary" : "text-foreground"
                        }`}>
                          {item.score.toFixed(1)}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            )}
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
          </>
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


      </div>
    </div>
  );
}