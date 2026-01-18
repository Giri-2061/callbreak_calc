import { useState, useCallback } from "react";
import { GameHeader } from "@/components/GameHeader";
import { PlayerCard } from "@/components/PlayerCard";
import { RoundInput } from "@/components/RoundInput";
import { RoundHistory } from "@/components/RoundHistory";
import { toast } from "sonner";

interface Round {
  bids: number[];
  tricks: number[];
  scores: number[];
}

const SUITS = ["♠", "♥", "♦", "♣"];

const calculateScore = (bid: number, tricks: number): number => {
  if (tricks >= bid) {
    // Made the bid: get bid points + 0.1 for each extra trick
    return bid + (tricks - bid) * 0.1;
  } else {
    // Failed the bid: negative bid points
    return -bid;
  }
};

export default function Index() {
  const [players, setPlayers] = useState<string[]>([
    "Player 1", "Player 2", "Player 3", "Player 4"
  ]);
  const [rounds, setRounds] = useState<Round[]>([]);

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

  const handleAddRound = useCallback((bids: number[], tricks: number[]) => {
    const scores = bids.map((bid, i) => calculateScore(bid, tricks[i]));
    
    setRounds(prev => [...prev, { bids, tricks, scores }]);
    
    // Find winner of this round (highest score)
    const maxScore = Math.max(...scores);
    const winners = scores
      .map((s, i) => s === maxScore ? players[i] : null)
      .filter(Boolean);
    
    toast.success(
      `Round ${rounds.length + 1} complete! 🎉`,
      { description: `${winners.join(" & ")} won with ${maxScore.toFixed(1)} points` }
    );
  }, [rounds.length, players]);

  const handleDeleteRound = useCallback((index: number) => {
    setRounds(prev => prev.filter((_, i) => i !== index));
    toast.info("Round deleted");
  }, []);

  const handleReset = useCallback(() => {
    if (window.confirm("Start a new game? This will clear all scores.")) {
      setRounds([]);
      toast.success("New game started! 🃏");
    }
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-8 suit-pattern">
      <div className="max-w-4xl mx-auto">
        <GameHeader 
          roundsPlayed={rounds.length} 
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

        {/* Main content grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Round Input */}
          <RoundInput
            players={players}
            onAddRound={handleAddRound}
            roundNumber={rounds.length + 1}
          />

          {/* Round History */}
          <RoundHistory
            rounds={rounds}
            players={players}
            onDeleteRound={handleDeleteRound}
          />
        </div>

        {/* Footer */}
        <footer className="text-center mt-8 text-muted-foreground text-sm">
          <p>♠ ♥ ♦ ♣ • Bid 1-13 • Total tricks must equal 13 • ♣ ♦ ♥ ♠</p>
        </footer>
      </div>
    </div>
  );
}
