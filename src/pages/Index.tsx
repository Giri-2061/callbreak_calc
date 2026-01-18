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

  const handleAddRound = useCallback((bids: number[], tricks: number[], isAutoRound?: boolean) => {
    const scores = bids.map((bid, i) => calculateScore(bid, tricks[i]));
    
    setRounds(prev => [...prev, { bids, tricks, scores }]);
    
    if (isAutoRound) {
      toast.success(
        `Round ${rounds.length + 1} - Auto Round! ⚡`,
        { description: `Bids = 9! Everyone gets their bid points.` }
      );
    } else {
      // Find winner of this round (highest score)
      const maxScore = Math.max(...scores);
      const winners = scores
        .map((s, i) => s === maxScore ? players[i] : null)
        .filter(Boolean);
      
      toast.success(
        `Round ${rounds.length + 1} complete! 🎉`,
        { description: `${winners.join(" & ")} won with ${maxScore.toFixed(1)} points` }
      );
    }
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

        {/* Footer with Rules */}
        <footer className="mt-8 space-y-3">
          <div className="text-center text-muted-foreground text-sm">
            <p>♠ ♥ ♦ ♣ • Standard 5-round game • Bid 1-13 • ♣ ♦ ♥ ♠</p>
          </div>
          
          {/* Scoring Rules */}
          <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 text-sm">
            <h4 className="font-semibold text-foreground mb-2 text-center">📖 Scoring Rules</h4>
            <div className="grid md:grid-cols-3 gap-3 text-muted-foreground">
              <div className="text-center">
                <span className="text-green-400 font-medium">✓ Make Bid</span>
                <p className="text-xs mt-1">Bid 3, Win 3 = <strong className="text-foreground">3.0 pts</strong></p>
              </div>
              <div className="text-center">
                <span className="text-blue-400 font-medium">★ Over-tricks</span>
                <p className="text-xs mt-1">Bid 3, Win 5 = <strong className="text-foreground">3.2 pts</strong></p>
              </div>
              <div className="text-center">
                <span className="text-red-400 font-medium">✗ Bust</span>
                <p className="text-xs mt-1">Bid 4, Win 2 = <strong className="text-foreground">-4.0 pts</strong></p>
              </div>
            </div>
          </div>

          {/* Special Rules */}
          <div className="text-center text-xs text-muted-foreground/70 space-y-1">
            <p className="italic">Redeal if: No Spades • No Face Cards (J,Q,K,A) • Total bids &lt; 8</p>
            <p className="text-warning/80">⚡ Auto Round: If total bids = 9, each player gets their bid points (no tricks played)</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
